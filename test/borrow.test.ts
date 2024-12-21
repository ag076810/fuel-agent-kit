import { test } from 'vitest';
import { borrowAsset } from '../src/swaylend/borrow.js';

test(
  'borrowAsset',
  async () => {
    const tx = await borrowAsset({
      amount: '11',
    });
    console.log('TX', tx);
  },
  {
    timeout: 500000,
  },
);
