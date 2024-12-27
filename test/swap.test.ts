import { test, beforeEach } from 'vitest';
import { createTestAgent, type FuelAgentType } from './setup.js';

let agent: FuelAgentType;

beforeEach(() => {
  agent = createTestAgent();
});

test(
  'swap exact input',
  {
    timeout: 30000,
  },
  async () => {
    console.log(
      await agent.swapExactInput({
        amount: '1',
        fromSymbol: 'USDC',
        toSymbol: 'ETH',
      }),
    );
  },
);

test(
  'swap via natural language',
  {
    timeout: 60000,
  },
  async () => {
    console.log(await agent.execute('Swap 0.1 USDC to ETH with 5% slippage'));
  },
);
