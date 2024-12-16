import { test } from 'vitest';
import { FuelAgent } from '../src/FuelAgent.js';

test(
  'swap eth for usdc',
  async () => {
    const agent = new FuelAgent();
    console.log(await agent.execute('swap 0.005 eth for usdc'));
  },
  {
    timeout: 30000,
  },
);
