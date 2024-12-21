import { test } from 'vitest';
import { addLiquidity } from '../src/mira/addLiquidity.js';
import { FuelAgent } from '../src/FuelAgent.js';

test(
  'add liquidity',
  {
    timeout: 30000,
  },
  async () => {
    console.log(
      await addLiquidity({
        amount0: '0.0001',
        asset0Symbol: 'ETH',
        asset1Symbol: 'USDT',
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
          'Add liquidity into USDC/USDT pool for 0.1 USDC with 5% slippage',
        ),
      );
    },
  );
