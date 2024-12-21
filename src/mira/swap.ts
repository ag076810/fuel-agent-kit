import { bn, Provider, Wallet } from 'fuels';
import { getAllVerifiedFuelAssets } from '../utils/assets.js';
import { buildPoolId, MiraAmm } from 'mira-dex-ts';

async function futureDeadline(provider: Provider) {
  const block = await provider.getBlock('latest');
  return block?.height.add(1000) ?? 1000000000;
}

export const swapExactInput = async ({
  amount,
  fromSymbol,
  toSymbol,
}: {
  amount: number;
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

  const provider = await Provider.create(
    'https://mainnet.fuel.network/v1/graphql',
  );

  const wallet = Wallet.fromPrivateKey(
    process.env.FUEL_WALLET_PRIVATE_KEY as string,
    provider,
  );

  const amountInWei = bn.parseUnits(amount.toString(), fromAssetDecimals);

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

  return {
    status,
    id,
  };
};
