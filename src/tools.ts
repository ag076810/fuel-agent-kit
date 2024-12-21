import { tool } from '@langchain/core/tools';
import { bn, Provider, Wallet, arrayify, DateTime } from 'fuels';
import { z } from 'zod';
import { getAllVerifiedFuelAssets } from './utils/assets.js';
import { getTxExplorerUrl } from './utils/explorer.js';
import { Market, type PriceDataUpdateInput } from './types/Market.js';
import { HermesClient } from '@pythnetwork/hermes-client';
import { PythContract } from '@pythnetwork/pyth-fuel-js';
import { swapExactInput } from './mira/swap.js';

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

export const swapExactInputTool = tool(swapExactInput, {
  name: 'swap_exact_input',
  description: 'Swap exact input on Mira',
  schema: z.object({
    amount: z.number().describe('The amount to swap'),
    fromSymbol: z
      .string()
      .describe('The asset symbol to swap from. eg. USDC, ETH'),
    toSymbol: z.string().describe('The asset symbol to swap to. eg. USDC, ETH'),
  }),
});

export const supplyCollateral = async ({
  amount,
  symbol,
}: {
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

  const marketContractId =
    '0x657ab45a6eb98a4893a99fd104347179151e8b3828fd8f2a108cc09770d1ebae';
  const marketContract: Market = new Market(marketContractId, wallet);

  const allAssets = await getAllVerifiedFuelAssets();
  const asset = allAssets.find((asset) => asset.symbol === symbol);
  const assetId = asset?.assetId;

  const weiAmount = bn.parseUnits(amount.toString(), asset?.decimals);

  const tx: any = await marketContract.functions
    .supply_collateral()
    .callParams({
      forward: {
        assetId: assetId,
        amount: weiAmount,
      } as any,
    })
    .call();

  const { id, status } = await tx.waitForResult();

  return {
    status,
    id,
  };
};

export const supplyCollateralTool = tool(supplyCollateral, {
  name: 'supply_collateral',
  description: 'Supply collateral on swaylend',
  schema: z.object({
    amount: z.number().describe('The amount to lend'),
    symbol: z.string().describe('The asset symbol to lend. eg. USDC, ETH'),
  }),
});

export const borrowAsset = async ({ amount }: { amount: number }) => {
  const provider = await Provider.create(
    'https://twilight-dimensional-patina.fuel-mainnet.quiknode.pro/c073528c935daad04cb641c844c7e10a33dabf35/v1/graphql',
  );
  const wallet = Wallet.fromPrivateKey(
    process.env.FUEL_WALLET_PRIVATE_KEY as string,
    provider,
  );


  const marketContractId =
    '0x657ab45a6eb98a4893a99fd104347179151e8b3828fd8f2a108cc09770d1ebae';
  const marketContract: Market = new Market(marketContractId, wallet);

  const allAssets = await getAllVerifiedFuelAssets();
  const asset = allAssets.find((asset) => asset.symbol === 'USDC'); // base asset
  const assetId: any = asset?.assetId;

  const weiAmount = bn.parseUnits(amount.toString(), asset?.decimals);

  // fetch configs
  const { value: marketConfiguration } = await marketContract.functions
    .get_market_configuration()
    .get();

  const { value: collateralConfigurations } = await marketContract.functions
    .get_collateral_configurations()
    .get();

  const priceFeedAssets: Map<string, string> = new Map();

  priceFeedAssets.set(
    marketConfiguration.base_token_price_feed_id,
    marketConfiguration.base_token.bits,
  );

  // fetch oracle data from pyth
  for (const [assetId, collateralConfiguration] of Object.entries(
    collateralConfigurations,
  )) {
    priceFeedAssets.set(collateralConfiguration.price_feed_id, assetId);
  }

  const priceFeedIds = Array.from(priceFeedAssets.keys());

  const client = new HermesClient('https://hermes.pyth.network');

  const priceUpdates: any = await client.getLatestPriceUpdates(priceFeedIds);

  const buffer = Buffer.from(priceUpdates.binary.data[0], 'hex');
  const updateData = [arrayify(buffer)];

  const pythContract = new PythContract(
    '0x1c86fdd9e0e7bc0d2ae1bf6817ef4834ffa7247655701ee1b031b52a24c523da',
    wallet,
  );
  
  // before initiating the borrow make sure the wallet has some small amount of USDC for the oracle fee
  const priceUpdateData: PriceDataUpdateInput = {
    update_fee: 0,
    publish_times: priceUpdates.parsed.map((parsedPrice: any) =>
      DateTime.fromUnixSeconds(parsedPrice.price.publish_time).toTai64(),
    ),
    price_feed_ids: priceFeedIds,
    update_data: updateData,
  };

  const { waitForResult } = await marketContract.functions
    .withdraw_base(amount.toFixed(0), priceUpdateData)
    .callParams({
      forward: {
        amount: 0,
        assetId: assetId,
      },
    })
    .addContracts([pythContract])
    .call();

  // Wait for the transaction to complete
  const transactionResult = await waitForResult();

  // Return the transaction ID
  return transactionResult.transactionId;
};

export const borrowAssetTool = tool(borrowAsset, {
  name: 'borrow_asset',
  description: 'Borrow asset on swaylend',
  schema: z.object({
    amount: z.number().describe('The amount to borrow'),
  }),
});

export const tools = [transferTool, swapExactInputTool, supplyCollateralTool];
