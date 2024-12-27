import { Provider, Wallet } from 'fuels';

export const setupWallet = async (privateKey: string) => {
  const provider = await Provider.create(
    'https://mainnet.fuel.network/v1/graphql',
  );

  const wallet = Wallet.fromPrivateKey(privateKey, provider);

  return {
    wallet,
    provider,
  };
};
