import { test } from 'vitest';
import { FuelAgent } from '../dist/index.js';

test(
  'execute swap',
  async () => {
    const agent = new FuelAgent();
    console.log(await agent.execute('swap 5 usdc for eth'));
  },
  {
    timeout: 60000,
  },
);
