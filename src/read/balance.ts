import { getAllVerifiedFuelAssets } from '../utils/assets.js';
import { setupWallet, getProvider } from '../utils/setup.js';

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

// ===============================

export type GetBalanceParams = {
  walletAddress: string;
  assetSymbol: string;
};

export const getBalance = async (params: GetBalanceParams) => {
  const provider = await getProvider();

  const allAssets = await getAllVerifiedFuelAssets();
  const asset = allAssets.find((asset) => asset.symbol === params.assetSymbol);

  if (!asset) {
    throw new Error(`Asset ${params.assetSymbol} not found`);
  }

  const balance = await provider.getBalance(
    params.walletAddress,
    asset.assetId,
  );

  return `The ${params.assetSymbol} balance of ${params.walletAddress} is ${balance.formatUnits(asset.decimals)} ${params.assetSymbol}`;
};
