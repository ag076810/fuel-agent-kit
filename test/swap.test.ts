import { test } from 'vitest';
import { swapExactInput } from '../src/mira/swap.js';

test(
  'swap exact input',
  async () => {
    console.log(
      await swapExactInput({
        amount: '5',
        fromSymbol: 'USDT',
        toSymbol: 'ETH',
      }),
    );
  },
  {
    timeout: 30000,
  },
);
