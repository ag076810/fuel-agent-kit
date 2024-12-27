import { addLiquidity, type AddLiquidityParams } from './mira/addLiquidity.js';
import { swapExactInput, type SwapExactInputParams } from './mira/swap.js';
import { borrowAsset, type BorrowAssetParams } from './swaylend/borrow.js';
import {
  supplyCollateral,
  type SupplyCollateralParams,
} from './swaylend/supply.js';
import {
  transfer as walletTransfer,
  type TransferParams,
} from './transfers/transfers.js';
import { createAgent } from './agent.js';
import { AgentExecutor } from 'langchain/agents';
import { getOwnBalance, type GetOwnBalanceParams } from './read/balance.js';

interface FuelAgentConfig {
  walletPrivateKey: string;
  openAIKey: string;
}

export class FuelAgent {
  private walletPrivateKey: string;
  private openAIKey: string;
  private agentExecutor: AgentExecutor;

  constructor(config: FuelAgentConfig) {
    this.walletPrivateKey = config.walletPrivateKey;
    this.openAIKey = config.openAIKey;

    if (!this.openAIKey) {
      throw new Error('OpenAI API key is required.');
    }

    if (!this.walletPrivateKey) {
      throw new Error('Fuel wallet private key is required.');
    }

    this.agentExecutor = createAgent(this.openAIKey, this);
  }

  getCredentials() {
    return {
      walletPrivateKey: this.walletPrivateKey,
      openAIKey: this.openAIKey,
    };
  }

  async execute(input: string) {
    const response = await this.agentExecutor.invoke({
      input,
    });

    return response;
  }

  async swapExactInput(params: SwapExactInputParams) {
    return await swapExactInput(params, this.walletPrivateKey);
  }

  async transfer(params: TransferParams) {
    return await walletTransfer(params, this.walletPrivateKey);
  }

  async supplyCollateral(params: SupplyCollateralParams) {
    return await supplyCollateral(params, this.walletPrivateKey);
  }

  async borrowAsset(params: BorrowAssetParams) {
    return await borrowAsset(params, this.walletPrivateKey);
  }

  async addLiquidity(params: AddLiquidityParams) {
    return await addLiquidity(params, this.walletPrivateKey);
  }

  async getOwnBalance(params: GetOwnBalanceParams) {
    return await getOwnBalance(params, this.walletPrivateKey);
  }
}
