import { Provider, Wallet } from 'fuels';

export class ProviderInstance {
  private static instance: Provider | null = null;

  private static getRpcUrl(): string {
    const network = process.env.FUEL_NETWORK || 'testnet';

    if (network === 'testnet') {
      return (
        process.env.FUEL_TESTNET_RPC ||
        'https://testnet.fuel.network/v1/graphql'
      );
    } else if (network === 'ignition') {
      return (
        process.env.FUEL_IGNITION_RPC ||
        'https://mainnet.fuel.network/v1/graphql'
      );
    }

    throw new Error(
      'Invalid FUEL_NETWORK value. Must be either "testnet" or "ignition"',
    );
  }

  private constructor() {} // Prevent direct construction

  public static async getProvider(): Promise<Provider> {
    if (!ProviderInstance.instance) {
      const rpcUrl = this.getRpcUrl();
      console.log(
        `Connecting to Fuel network: ${process.env.FUEL_NETWORK} at ${rpcUrl}`,
      );
      ProviderInstance.instance = await Provider.create(rpcUrl);
    }
    return ProviderInstance.instance;
  }
}

export const setupWallet = async (privateKey: string) => {
  const provider = await ProviderInstance.getProvider();
  const wallet = Wallet.fromPrivateKey(privateKey, provider);

  return {
    wallet,
    provider,
  };
};
