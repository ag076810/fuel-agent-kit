export const getTxExplorerUrl = (txId: string) => {
  const network = process.env.FUEL_NETWORK || 'testnet';

  if (network === 'testnet') {
    return `https://app-testnet.fuel.network/tx/${txId}/simple`;
  } else if (network === 'ignition') {
    return `https://app.fuel.network/tx/${txId}/simple`;
  }

  // 默認返回測試網
  return `https://app-testnet.fuel.network/tx/${txId}/simple`;
};
