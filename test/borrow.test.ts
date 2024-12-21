import { test } from 'vitest';
import { FuelAgent } from '../dist/index.js';

test(
  'borrowAsset',
  async () => {
    const agent = new FuelAgent();
    console.log(await agent.execute('Borrow 11 USDC'));
  },
  {
    timeout: 500000,
  },
);
