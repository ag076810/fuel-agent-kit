import { test, beforeEach } from 'vitest';
import { createTestAgent } from './setup.js';
import type { FuelAgent } from '../src/FuelAgent.js';

let agent: FuelAgent;

beforeEach(() => {
  agent = createTestAgent();
});

// 1. 使用資產 ID 查詢餘額
test('get balance by asset id', async () => {
  const result = await agent.getOwnBalanceByAssetId({
    assetId: "0xd9835efc97796abc977acbd51e1a033deb8bac954910a0b936dc82341cc8d8ee",
    decimals: 9
  });
  console.log('Balance by Asset ID:', result);
});

// 2. 使用代幣符號查詢餘額
test('get balance by symbol', async () => {
  const result = await agent.getOwnBalance({
    symbol: "ETH"
  });
  console.log('Balance by Symbol:', result);
});

// 3. 使用代幣符號轉賬
test('transfer by symbol', async () => {
  const result = await agent.transfer({
    to: "0x6e8Ba05f0D2c8F229d9214255dfC5dC8432e00702acfA00156f1f7aA4EBB4c81",
    amount: "0.1",
    symbol: "ETH"
  });
  console.log('Transfer by Symbol:', result);
});

// 4. 使用資產 ID 轉賬
test('transfer by asset id', async () => {
  const result = await agent.transferByAssetId({
    to: "0x6e8Ba05f0D2c8F229d9214255dfC5dC8432e00702acfA00156f1f7aA4EBB4c81",
    amount: "0.1",
    assetId: "0xd9835efc97796abc977acbd51e1a033deb8bac954910a0b936dc82341cc8d8ee",
    decimals: 9
  });
  console.log('Transfer by Asset ID:', result);
});
