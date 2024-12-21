import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { swapExactInput } from './mira/swap.js';
import { transfer } from './transfers/transfers.js';
import { supplyCollateral } from './swaylend/supply.js';
import { borrowAsset } from './swaylend/borrow.js';
import { addLiquidity } from './mira/addLiquidity.js';

export const transferTool = tool(transfer, {
  name: 'fuel_transfer',
  description: 'Transfer any verified Fuel asset to another wallet',
  schema: z.object({
    to: z.string().describe('The wallet address to transfer to'),
    amount: z.string().describe('The amount to transfer'),
    symbol: z.string().describe('The asset symbol to transfer. eg. USDC, ETH'),
  }),
});

export const swapExactInputTool = tool(swapExactInput, {
  name: 'swap_exact_input',
  description: 'Swap exact input on Mira',
  schema: z.object({
    amount: z.string().describe('The amount to swap'),
    fromSymbol: z
      .string()
      .describe('The asset symbol to swap from. eg. USDC, ETH'),
    toSymbol: z.string().describe('The asset symbol to swap to. eg. USDC, ETH'),
  }),
});

export const supplyCollateralTool = tool(supplyCollateral, {
  name: 'supply_collateral',
  description: 'Supply collateral on swaylend',
  schema: z.object({
    amount: z.string().describe('The amount to lend'),
    symbol: z.string().describe('The asset symbol to lend. eg. USDC, ETH'),
  }),
});

export const borrowAssetTool = tool(borrowAsset, {
  name: 'borrow_asset',
  description: 'Borrow asset on swaylend',
  schema: z.object({
    amount: z.string().describe('The amount to borrow'),
  }),
});

export const addLiquidityTool = tool(addLiquidity, {
  name: 'add_liquidity',
  description: 'Add liquidity to a Mira pool',
  schema: z.object({
    amount0: z.number().describe('The amount of the first asset to add'),
    asset0Symbol: z.string().describe('The symbol of the first asset'),
    asset1Symbol: z.string().describe('The symbol of the second asset'),
    slippage: z.number().optional().describe('Slippage tolerance (default: 0.01 for 1%)'),
  }),
});

export const tools = [
  transferTool,
  swapExactInputTool,
  supplyCollateralTool,
  borrowAssetTool,
  addLiquidityTool
];
