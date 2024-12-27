import { FuelAgent } from '../src/FuelAgent.js';

export type FuelAgentType = FuelAgent;

export const TEST_CREDENTIALS = {
  walletPrivateKey: process.env.FUEL_WALLET_PRIVATE_KEY!,
  openAIKey: process.env.OPENAI_API_KEY!,
};

export const createTestAgent = () => {
  return new FuelAgent(TEST_CREDENTIALS);
};
