import { tool } from '@langchain/core/tools';
import { bn, Provider, Wallet } from 'fuels';
import { MiraAmm, type PoolId } from 'mira-dex-ts';
import { z } from 'zod';

export const transferToWallet = async ({
  to,
  amount,
}: {
  to: string;
  amount: number;
}) => {
  const provider = await Provider.create(
    'https://testnet.fuel.network/v1/graphql',
  );
  const wallet = Wallet.fromPrivateKey(
    process.env.FUEL_WALLET_PRIVATE_KEY as string,
    provider,
  );

  const response = await wallet.transfer(to, amount, provider.getBaseAssetId());
  const { id } = await response.waitForResult();

  return id;
};

export const transferTool = tool(transferToWallet, {
  name: 'fuel_transfer',
  description: "Transfer funds from the user's wallet to another",
  schema: z.object({
    to: z.string().describe('The wallet address to transfer to'),
    amount: z.number().describe('The amount to transfer'),
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

  const { id, receipts, status } = await res.waitForResult();

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
