import { tool } from '@langchain/core/tools';
import { bn, Provider, Wallet } from 'fuels';
import { MiraAmm, type PoolId } from 'mira-dex-ts';
import { z } from 'zod';
import { getAllVerifiedFuelAssets } from './utils/assets.js';
import { getTxExplorerUrl } from './utils/explorer.js';

export const transferToWallet = async ({
  to,
  amount, // eg. 0.2 ETH
  symbol,
}: {
  to: string;
  amount: number;
  symbol: string;
}) => {
  const provider = await Provider.create(
    'https://mainnet.fuel.network/v1/graphql',
  );
  const wallet = Wallet.fromPrivateKey(
    process.env.FUEL_WALLET_PRIVATE_KEY as string,
    provider,
  );

  const allAssets = await getAllVerifiedFuelAssets();
  const asset = allAssets.find((asset) => asset.symbol === symbol);
  const assetId = asset?.assetId;

  if (!assetId) {
    throw new Error(`Asset ${symbol} not found`);
  }

  const response = await wallet.transfer(
    to,
    bn.parseUnits(amount.toString(), asset.decimals),
    assetId,
  );
  const { id, isStatusFailure } = await response.waitForResult();

  if (isStatusFailure) {
    console.error('TX failed');
  }

  return `Sucessfully transferred ${amount}${symbol} to ${to}. Explorer link: ${getTxExplorerUrl(id)}`;
};

export const transferTool = tool(transferToWallet, {
  name: 'fuel_transfer',
  description: 'Transfer any verified Fuel asset to another wallet',
  schema: z.object({
    to: z.string().describe('The wallet address to transfer to'),
    amount: z.number().describe('The amount to transfer'),
    symbol: z.string().describe('The asset symbol to transfer. eg. USDC, ETH'),
  }),
});

export const swapEthForUSDC = async ({ amount }: { amount: string }) => {
  const provider = await Provider.create(
    'https://mainnet.fuel.network/v1/graphql',
  );
  const wallet = Wallet.fromPrivateKey(
    process.env.FUEL_WALLET_PRIVATE_KEY as string,
    provider,
  );

  const amountInWei = bn.parseUnits(amount);

  const pools: PoolId[] = [
    [
      {
        bits: provider.getBaseAssetId(),
      },
      {
        bits: '0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b', // USDC
      },
      true,
    ],
  ];

  const miraAmm = new MiraAmm(wallet);

  const response = await miraAmm.swapExactInput(
    amountInWei,
    {
      bits: provider.getBaseAssetId(),
    },
    0,
    pools,
    // 7 days from now in milliseconds
    bn(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7),
  );

  const res = await wallet.sendTransaction(response);

  const { id, status } = await res.waitForResult();

  return {
    status,
    id,
  };
};

export const swapEthForUSDCTool = tool(swapEthForUSDC, {
  name: 'swap_eth_for_usdc',
  description: 'Swap ETH for USDC on Mira',
  schema: z.object({
    amount: z.string().describe('The ETH amount to swap'),
  }),
});

export const tools = [transferTool, swapEthForUSDCTool];
