import { bn, Provider } from 'fuels';
import { getAllVerifiedFuelAssets } from '../utils/assets.js';
import { buildPoolId, MiraAmm } from 'mira-dex-ts';
import { setupWallet } from '../utils/setup.js';
import { getTxExplorerUrl } from '../utils/explorer.js';

async function futureDeadline(provider: Provider) {
  const block = await provider.getBlock('latest');
  return block?.height.add(1000) ?? 1000000000;
}

export type SwapExactInputParams = {
  amount: string;
  fromSymbol: string;
  toSymbol: string;
};

export const swapExactInput = async ({
  amount,
  fromSymbol,
  toSymbol,
}: {
  amount: string;
  fromSymbol: string;
  toSymbol: string;
}) => {
  const assets = await getAllVerifiedFuelAssets();

  const fromAsset = assets.find((asset) => asset.symbol === fromSymbol);
  const toAsset = assets.find((asset) => asset.symbol === toSymbol);

  if (!fromAsset) {
    throw new Error(`Asset ${fromSymbol} not found`);
  }

  if (!toAsset) {
    throw new Error(`Asset ${toSymbol} not found`);
  }

  const fromAssetId = fromAsset?.assetId;
  const toAssetId = toAsset?.assetId;

  if (!fromAssetId) {
    throw new Error(`Asset ${fromSymbol} not found`);
  }

  if (!toAssetId) {
    throw new Error(`Asset ${toSymbol} not found`);
  }

  const fromAssetDecimals = fromAsset?.decimals;
  const toAssetDecimals = toAsset?.decimals;

  if (!fromAssetDecimals) {
    throw new Error(`Asset ${fromSymbol} not found`);
  }

  if (!toAssetDecimals) {
    throw new Error(`Asset ${toSymbol} not found`);
  }

  const { wallet, provider } = await setupWallet();

  const amountInWei = bn.parseUnits(amount, fromAssetDecimals);

  const poolId = buildPoolId(fromAssetId, toAssetId, true);

  const miraAmm = new MiraAmm(wallet);

  const deadline = await futureDeadline(provider);

  const req = await miraAmm.swapExactInput(
    amountInWei,
    {
      bits: fromAssetId,
    },
    0,
    [poolId],
    deadline,
    {
      gasLimit: 1000000,
      maxFee: 1000000,
    },
  );

  const tx = await wallet.sendTransaction(req);

  const { id, status } = await tx.waitForResult();

  return `Successfully swapped ${amount} ${fromSymbol} for ${toSymbol}. Explorer link: ${getTxExplorerUrl(id)}`;
};

