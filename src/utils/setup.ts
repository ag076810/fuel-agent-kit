import { Provider, Wallet } from 'fuels';

export const setupWallet = async () => {
  const provider = await Provider.create(
    'https://mainnet.fuel.network/v1/graphql',
  );
  const wallet = Wallet.fromPrivateKey(
    process.env.FUEL_WALLET_PRIVATE_KEY as string,
    provider,
  );

  return {
    wallet,
    provider,
  };
};
