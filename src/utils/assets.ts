import { CHAIN_IDS, type Asset, type NetworkFuel } from 'fuels';
import { promises as fs } from 'fs';
import { join } from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get project root directory (will try to save the the dev's project root)
const CACHE_DIR = join(process.cwd(), '.fuel-agent-kit'); // change name or dir maybe?
const CACHE_FILE = join(CACHE_DIR, 'verified-assets.json');
const CACHE_TTL = 1000 * 60 * 60; // 1 hour in milliseconds

interface CacheData {
  timestamp: number;
  data: Asset[];
}

export const getVerifiedAssets = async () => {
  try {
    // Try to read from cache first
    const cacheExists = await fs
      .access(CACHE_FILE)
      .then(() => true)
      .catch(() => false);

    if (cacheExists) {
      const cacheContent = await fs.readFile(CACHE_FILE, 'utf-8');
      const cache = JSON.parse(cacheContent) as CacheData;

      // Check if cache is still valid
      if (Date.now() - cache.timestamp < CACHE_TTL) {
        return cache.data;
      }
    } else {
    }
  } catch (error) {}

  const allAssets = (await fetch(
    'https://verified-assets.fuel.network/assets.json',
  ).then((res) => res.json())) as Asset[];
  // Save to cache
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(
      CACHE_FILE,
      JSON.stringify({
        timestamp: Date.now(),
        data: allAssets,
      }),
    );
  } catch (error) {}

  return allAssets;
};

export const getAssetIdAndDecimals = async (
  symbol: string,
  assets: Asset[],
) => {
  const asset = assets.find((asset) => asset.symbol === symbol);
  if (!asset) {
    throw new Error(`Asset ${symbol} not found`);
  }
  const networks = asset.networks;

  const fuelNetworkIndex = networks.findIndex(
    (network) =>
      network.type === 'fuel' && network.chainId === CHAIN_IDS.fuel.mainnet,
  );

  if (fuelNetworkIndex === -1) {
    throw new Error(`Asset ${symbol} not found on Fuel`);
  }

  return {
    assetId: (asset.networks[fuelNetworkIndex] as NetworkFuel).assetId,
    decimals: (asset.networks[fuelNetworkIndex] as NetworkFuel).decimals,
  };
};

export const getAllVerifiedSymbols = async (assets: Asset[]) => {
  return assets.map((asset) => asset.symbol);
};

export type FuelAgentAsset = {
  symbol: string;
  assetId: string;
  decimals: number;
};

export const getAllVerifiedFuelAssets = async () => {
  const allAssets = await getVerifiedAssets();
  const symbols = await getAllVerifiedSymbols(allAssets);
  const assets: FuelAgentAsset[] = [];

  for await (const symbol of symbols) {
    const { assetId, decimals } = await getAssetIdAndDecimals(
      symbol,
      allAssets,
    );
    assets.push({
      symbol,
      assetId,
      decimals,
    });
  }

  return assets;
};
