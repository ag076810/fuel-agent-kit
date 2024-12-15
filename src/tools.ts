import { tool } from '@langchain/core/tools';
import { Provider, Wallet } from 'fuels';
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

export const tools = [transferTool];
