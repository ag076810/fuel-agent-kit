import { test } from 'vitest';
import { FuelAgent } from '../dist/index.js';

test(
  'supplyCollateral',
  async () => {
    const agent = new FuelAgent();
    console.log(await agent.execute('Supply 2 USDT as collateral'));
  },
  {
    timeout: 500000,
  },
);
