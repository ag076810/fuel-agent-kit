import { bn } from 'fuels';
import { getAllVerifiedFuelAssets } from '../utils/assets.js';
import { getTxExplorerUrl } from '../utils/explorer.js';
import { setupWallet } from '../utils/setup.js';

export type TransferParams = {
  to: string;
  amount: string;
  symbol: string;
};

export const transfer = async ({
  to,
  amount, // eg. 0.2
  symbol,
}: TransferParams) => {
  const { wallet } = await setupWallet();

  const allAssets = await getAllVerifiedFuelAssets();
  const asset = allAssets.find((asset) => asset.symbol === symbol);
  const assetId = asset?.assetId;

  if (!assetId) {
    throw new Error(`Asset ${symbol} not found`);
  }

  const response = await wallet.transfer(
    to,
    bn.parseUnits(amount, asset.decimals),
    assetId,
  );
  const { id, isStatusFailure } = await response.waitForResult();

  if (isStatusFailure) {
    console.error('TX failed');
  }

  return `Sucessfully transferred ${amount}${symbol} to ${to}. Explorer link: ${getTxExplorerUrl(id)}`;
};
