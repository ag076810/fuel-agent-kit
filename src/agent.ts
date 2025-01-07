import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { createTools } from './tools.js';
import { modelMapping } from './utils/models.js';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage } from '@langchain/core/messages';

const systemMessage = new SystemMessage(
  `You are an AI assistant running on the Fuel network, capable of helping users perform various blockchain operations.

   You should:
   - Understand user's natural language requests
   - Clearly explain your operation steps
   - Provide complete and easy-to-understand information
   - Respond in a natural conversational way
   - Provide relevant important information before and after operations

   You can:
   - Query token balances
   - Execute token transfers
   - Provide transaction status and links
   - Answer user questions and concerns

   Please interact with users in a natural and friendly way, ensuring they fully understand the results of each operation.`,
);

export const prompt = ChatPromptTemplate.fromMessages([
  systemMessage,
  ['placeholder', '{chat_history}'],
  ['human', '{input}'],
  ['placeholder', '{agent_scratchpad}'],
]);

export const createAgent = (
  fuelAgent: { getCredentials: () => { walletPrivateKey: string } },
  modelName: keyof typeof modelMapping,
  openAiApiKey?: string,
  anthropicApiKey?: string,
  googleGeminiApiKey?: string,
) => {
  const model = () => {
    if (modelMapping[modelName] === 'openai') {
      if (!openAiApiKey) {
        throw new Error('OpenAI API key is required');
      }
      return new ChatOpenAI({
        modelName: modelName,
        apiKey: openAiApiKey,
      });
    }
    if (modelMapping[modelName] === 'anthropic') {
      if (!anthropicApiKey) {
        throw new Error('Anthropic API key is required');
      }
      return new ChatAnthropic({
        modelName: modelName,
        anthropicApiKey: anthropicApiKey,
      });
    }
    if (modelMapping[modelName] === 'gemini') {
      if (!googleGeminiApiKey) {
        throw new Error('Google Gemini API key is required');
      }
      return new ChatGoogleGenerativeAI({
        modelName: modelName,
        apiKey: googleGeminiApiKey,
        convertSystemMessageToHumanContent: true,
      });
    }
  };

  const selectedModel = model();

  if (!selectedModel) {
    throw new Error('Error initializing model');
  }

  const tools = createTools(fuelAgent);

  const agent = createToolCallingAgent({
    llm: selectedModel,
    tools,
    prompt,
  });

  return new AgentExecutor({
    agent,
    tools,
  });
};
