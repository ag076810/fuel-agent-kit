import { beforeEach, test } from 'vitest';
import { createTestAgent } from './setup.js';
import type { FuelAgent } from '../src/FuelAgent.js';

let agent: FuelAgent;

beforeEach(() => {
  agent = createTestAgent();
});

test(
  'get own balance',
  async () => {
    const balance = await agent.execute('Get my USDC balance');
    console.log(balance);
  },
  {
    timeout: 500000,
  },
);
