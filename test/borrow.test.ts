import { test } from 'vitest';
import { FuelAgent } from '../src/FuelAgent.js';
import { borrowAsset } from '../src/tools.js';

test(
  'borrowAsset',
  async () => {
    const tx = await borrowAsset({
      amount: 11,
    });
    console.log('TX', tx);
  },
  {
    timeout: 500000,
  },
);
