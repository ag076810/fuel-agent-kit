import { Provider, Wallet } from 'fuels';

let cachedProvider: Provider | null = null;

export const getProvider = async () => {
  if (!cachedProvider) {
    cachedProvider = await Provider.create(
      'https://mainnet.fuel.network/v1/graphql',
    );
  }
  return cachedProvider;
};

export const setupWallet = async (privateKey: string) => {
  const provider = await getProvider();
  const wallet = Wallet.fromPrivateKey(privateKey, provider);

  return {
    wallet,
    provider,
  };
};
