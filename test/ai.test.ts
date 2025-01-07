import { test, beforeEach } from 'vitest';
import { createTestAgent } from './setup.js';
import type { FuelAgent } from '../src/FuelAgent.js';

let agent: FuelAgent;

beforeEach(() => {
  agent = createTestAgent();
});

test('AI automated balance check and transfer', async () => {
  const result = await agent.execute(
    `我想查看我的錢包裡這個代幣的餘額：0xd9835efc97796abc977acbd51e1a033deb8bac954910a0b936dc82341cc8d8ee，
    如果有足夠的餘額，請幫我轉 100 個到這個地址：0x86B96265096c9E4395bfAB02F77A1b05EBD33E183C2ef7d09534B6753E689571。
    對了，這個代幣用 9 位小數。`
  );
  
  console.log('AI 回應:', result);
}); 