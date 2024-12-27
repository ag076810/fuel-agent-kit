import { getAllVerifiedFuelAssets } from '../utils/assets.js';
import { setupWallet } from '../utils/setup.js';

export type GetOwnBalanceParams = {
  symbol: string;
};

export const getOwnBalance = async (
  params: GetOwnBalanceParams,
  privateKey: string,
) => {
  const { wallet } = await setupWallet(privateKey);

  const allAssets = await getAllVerifiedFuelAssets();
  const asset = allAssets.find((asset) => asset.symbol === params.symbol);

  if (!asset) {
    throw new Error(`Asset ${params.symbol} not found`);
  }

  const balance = await wallet.getBalance(asset.assetId);

  return `Your ${params.symbol} balance is ${balance.formatUnits(asset.decimals)} ${params.symbol}`;
};
