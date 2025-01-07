import {
  transfer as walletTransfer,
  transferByAssetId as walletTransferByAssetId,
  type TransferParams,
  type TransferByAssetIdParams,
} from './transfers/transfers.js';
import { createAgent } from './agent.js';
import type { AgentExecutor } from 'langchain/agents';
import { 
  getOwnBalance, 
  getOwnBalanceByAssetId,
  type GetOwnBalanceParams,
  type GetOwnBalanceByAssetIdParams,
} from './read/balance.js';
import type { modelMapping } from './utils/models.js';

export interface FuelAgentConfig {
  walletPrivateKey: string;
  model: keyof typeof modelMapping;
  openAiApiKey?: string;
  anthropicApiKey?: string;
  googleGeminiApiKey?: string;
}

export class FuelAgent {
  private walletPrivateKey: string;
  private agentExecutor: AgentExecutor;
  private model: keyof typeof modelMapping;
  private openAiApiKey?: string;
  private anthropicApiKey?: string;
  private googleGeminiApiKey?: string;

  constructor(config: FuelAgentConfig) {
    this.walletPrivateKey = config.walletPrivateKey;
    this.model = config.model;
    this.openAiApiKey = config.openAiApiKey;
    this.anthropicApiKey = config.anthropicApiKey;
    this.googleGeminiApiKey = config.googleGeminiApiKey;

    if (!this.walletPrivateKey) {
      throw new Error('Fuel wallet private key is required.');
    }

    this.agentExecutor = createAgent(
      this,
      this.model,
      this.openAiApiKey,
      this.anthropicApiKey,
      this.googleGeminiApiKey,
    );
  }

  getCredentials() {
    return {
      walletPrivateKey: this.walletPrivateKey,
      openAiApiKey: this.openAiApiKey || '',
      anthropicApiKey: this.anthropicApiKey || '',
      googleGeminiApiKey: this.googleGeminiApiKey || '',
    };
  }

  async execute(input: string) {
    const response = await this.agentExecutor.invoke({
      input,
    });

    return response;
  }

  async transfer(params: TransferParams) {
    return await walletTransfer(params, this.walletPrivateKey);
  }

  async transferByAssetId(params: TransferByAssetIdParams) {
    return await walletTransferByAssetId(params, this.walletPrivateKey);
  }

  async getOwnBalance(params: GetOwnBalanceParams) {
    return await getOwnBalance(params, this.walletPrivateKey);
  }

  async getOwnBalanceByAssetId(params: GetOwnBalanceByAssetIdParams) {
    return await getOwnBalanceByAssetId(params, this.walletPrivateKey);
  }
}
