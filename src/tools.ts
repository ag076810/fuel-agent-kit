import { tool } from '@langchain/core/tools';
import { z } from 'zod';

// Import functions
import { transfer, transferByAssetId } from './transfers/transfers.js';
import { getOwnBalance, getOwnBalanceByAssetId } from './read/balance.js';

// Types
type FuelAgentInterface = {
  getCredentials: () => { walletPrivateKey: string };
};

/**
 * Wraps a function to inject the wallet private key from the agent
 * @param fn - The function to wrap
 * @param agent - The FuelAgent instance containing credentials
 */
const withWalletKey = <T>(
  fn: (params: T, privateKey: string) => Promise<any>,
  agent: FuelAgentInterface,
) => {
  return (params: T) => fn(params, agent.getCredentials().walletPrivateKey);
};

// Schema definitions
const transferSchema = z.object({
  to: z.string().describe('The wallet address to transfer to'),
  amount: z.string().describe('The amount to transfer'),
  symbol: z.string().describe('The asset symbol to transfer. eg. USDC, ETH'),
});

const transferByAssetIdSchema = z.object({
  to: z.string().describe('The wallet address to transfer to'),
  amount: z.string().describe('The amount to transfer'),
  assetId: z.string().describe('The asset ID to transfer'),
  decimals: z.number().describe('The number of decimals for the asset'),
});

const getOwnBalanceSchema = z.object({
  symbol: z
    .string()
    .describe('The asset symbol to get the balance of. eg. USDC, ETH'),
});

const getOwnBalanceByAssetIdSchema = z.object({
  assetId: z.string().describe('The asset ID to get the balance of'),
  decimals: z.number().describe('The number of decimals for the asset'),
});

/**
 * Creates and returns all tools with injected agent credentials
 */
export const createTools = (agent: FuelAgentInterface) => [
  tool(withWalletKey(transfer, agent), {
    name: 'fuel_transfer',
    description: 'Transfer any verified Fuel asset to another wallet using asset symbol',
    schema: transferSchema,
  }),

  tool(withWalletKey(transferByAssetId, agent), {
    name: 'fuel_transfer_by_asset_id',
    description: 'Transfer any Fuel asset to another wallet using asset ID',
    schema: transferByAssetIdSchema,
  }),

  tool(withWalletKey(getOwnBalance, agent), {
    name: 'get_own_balance',
    description: 'Get the balance of an asset in your wallet using asset symbol',
    schema: getOwnBalanceSchema,
  }),

  tool(withWalletKey(getOwnBalanceByAssetId, agent), {
    name: 'get_own_balance_by_asset_id',
    description: 'Get the balance of an asset in your wallet using asset ID',
    schema: getOwnBalanceByAssetIdSchema,
  }),
];
