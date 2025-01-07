import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { createTools } from './tools.js';
import { modelMapping } from './utils/models.js';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage } from '@langchain/core/messages';

const systemMessage = new SystemMessage(
  `您是一個在 Fuel 網路上運行的 AI 助手，能夠幫助用戶執行各種區塊鏈操作。

   您應該：
   - 理解用戶的自然語言請求
   - 清晰地解釋您的操作步驟
   - 提供完整且易於理解的資訊
   - 使用自然的對話方式回應
   - 在執行操作前後提供相關的重要資訊

   您可以：
   - 查詢代幣餘額
   - 執行代幣轉賬
   - 提供交易狀態和鏈接
   - 回答用戶的問題和疑慮

   請用自然、友善的方式與用戶互動，確保用戶能夠完全理解每個操作的結果。`,
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
