import { getAllVerifiedFuelAssets } from '../utils/assets.js';
import { setupWallet, ProviderInstance } from '../utils/setup.js';

export type GetOwnBalanceParams = {
  symbol: string;
};

export type GetOwnBalanceByAssetIdParams = {
  assetId: string;
  decimals: number;
};

export const getOwnBalance = async (
  params: GetOwnBalanceParams,
  privateKey: string,
) => {
  try {
    const { wallet } = await setupWallet(privateKey);

    const allAssets = await getAllVerifiedFuelAssets();
    const asset = allAssets.find((asset) => asset.symbol === params.symbol);

    if (!asset) {
      throw new Error(`Asset ${params.symbol} not found`);
    }

    const balance = await wallet.getBalance(asset.assetId);

    return JSON.stringify({
      status: 'success',
      balance: balance.formatUnits(asset.decimals),
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getOwnBalanceByAssetId = async (
  params: GetOwnBalanceByAssetIdParams,
  privateKey: string,
) => {
  try {
    const { wallet } = await setupWallet(privateKey);

    const balance = await wallet.getBalance(params.assetId);

    return JSON.stringify({
      status: 'success',
      balance: balance.formatUnits(params.decimals),
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
