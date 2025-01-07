import { test, beforeEach } from 'vitest';
import { createTestAgent } from './setup.js';
import type { FuelAgent } from '../src/FuelAgent.js';

let agent: FuelAgent;

beforeEach(() => {
  agent = createTestAgent();
});

test('AI automated balance check and transfer', async () => {
  const result = await agent.execute(
    `I want to check the balance of this token in my wallet: 0xd9835efc97796abc977acbd51e1a033deb8bac954910a0b936dc82341cc8d8ee,
    if there is sufficient balance, please transfer 100 tokens to this address: 0x86B96265096c9E4395bfAB02F77A1b05EBD33E183C2ef7d09534B6753E689571.
    By the way, this token uses 9 decimals.`,
  );

  console.log('AI Response:', result);
});
