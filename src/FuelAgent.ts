
import { agentExector } from "./agent.js";

export class FuelAgent {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    if (!process.env.FUEL_WALLET_PRIVATE_KEY) {
      throw new Error("FUEL_WALLET_PRIVATE_KEY is not set");
    }
  }

  async invoke(input: string) {
    const response = await agentExector.invoke({
      input,
    });

    return response;
  }
}
