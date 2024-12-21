import { test } from 'vitest';
import { supplyCollateral } from '../src/swaylend/supply.js';

test(
  'supplyCollateral',
  async () => {
    const tx = await supplyCollateral({
      amount: '12',
      symbol: 'USDT',
    });
    console.log('TX', tx);
  },
  {
    timeout: 500000,
  },
);
