import { test, beforeEach } from 'vitest';
import { createTestAgent } from './setup.js';
import type { FuelAgent } from '../src/FuelAgent.js';

let agent: FuelAgent;

beforeEach(() => {
  agent = createTestAgent();
});

// 1. Query balance using asset ID
test('get balance by asset id', async () => {
  const result = await agent.getOwnBalanceByAssetId({
    assetId:
      '0xd9835efc97796abc977acbd51e1a033deb8bac954910a0b936dc82341cc8d8ee',
    decimals: 9,
  });
  console.log('Balance by Asset ID:', result);
});

// 2. Query balance using token symbol
test('get balance by symbol', async () => {
  const result = await agent.getOwnBalance({
    symbol: 'ETH',
  });
  console.log('Balance by Symbol:', result);
});

// 3. Transfer using token symbol
test('transfer by symbol', async () => {
  const result = await agent.transfer({
    to: '0x6e8Ba05f0D2c8F229d9214255dfC5dC8432e00702acfA00156f1f7aA4EBB4c81',
    amount: '0.1',
    symbol: 'ETH',
  });
  console.log('Transfer by Symbol:', result);
});

// 4. Transfer using asset ID
test('transfer by asset id', async () => {
  const result = await agent.transferByAssetId({
    to: '0x6e8Ba05f0D2c8F229d9214255dfC5dC8432e00702acfA00156f1f7aA4EBB4c81',
    amount: '0.1',
    assetId:
      '0xd9835efc97796abc977acbd51e1a033deb8bac954910a0b936dc82341cc8d8ee',
    decimals: 9,
  });
  console.log('Transfer by Asset ID:', result);
});
