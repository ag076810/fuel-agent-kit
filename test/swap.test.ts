import { test } from 'vitest';
import { swapExactInput } from '../src/mira/swap.js';
import { FuelAgent } from '../src/FuelAgent.js';

test(
  'swap exact input',
  {
    timeout: 30000,
  },
  async () => {
    console.log(
      await swapExactInput({
        amount: '1',
        fromSymbol: 'USDC',
        toSymbol: 'ETH',
      }),
    );
  },
);

test(
  'add 0.1 USDC liquidity to USDC/USDT pool',
  {
      timeout: 60000,
  },
  async () => {
    const agent = new FuelAgent();
    console.log(
      await agent.execute(
        'Swap 0.1 USDC to ETH with 5% slippage',
      ),
    );
  },
);