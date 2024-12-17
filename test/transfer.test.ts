import { test } from 'vitest';
import { FuelAgent } from '../src/FuelAgent.js';
import { transferToWallet } from '../src/tools.js';

test('transferToWallet', async () => {
  const id = await transferToWallet({
    to: '0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
    amount: 5,
    symbol: 'USDC',
  });
  console.log(`TX ID: ${id}`);
});

test(
  'transfer USDC to another wallet',
  async () => {
    const agent = new FuelAgent();
    console.log(
      await agent.execute(
        'Transfer 2 USDC to 0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
      ),
    );
  },
  {
    timeout: 60000,
  },
);
