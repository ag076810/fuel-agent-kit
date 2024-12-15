import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { transferTool, transferToWallet } from './tools.js';
import { AIMessage } from '@langchain/core/messages';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { tools } from './tools.js';

export const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    'You are an AI agent on Fuel network capable of executing all kinds of transactions and interacting with the Fuel blockchain.',
  ],
  ['placeholder', '{chat_history}'],
  ['human', '{input}'],
  ['placeholder', '{agent_scratchpad}'],
]);

export const getModel = () => {
  const model = new ChatOpenAI({
    modelName: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
  });

  const boundModel = model.bindTools([transferTool]);

  return boundModel;
};

export async function handleModelResponse(response: AIMessage) {
  // Check if there are tool calls in the response
  if (response.tool_calls && response.tool_calls.length > 0) {
    const toolCall = response.tool_calls[0]; // Handle first tool call

    if (!toolCall) {
      throw new Error('No tool call found in response');
    }

    // Verify we have the expected tool and args
    if (
      toolCall.name === 'fuel_transfer' &&
      toolCall.args &&
      toolCall.args.to &&
      toolCall.args.amount
    ) {
      try {
        // Execute the actual tool function
        // You'll need to implement or import this function
        const transferResult = await transferToWallet({
          to: toolCall.args.to,
          amount: toolCall.args.amount,
        });

        return transferResult;
      } catch (error) {
        console.error('Error executing fuel transfer:', error);
        throw error;
      }
    } else {
      throw new Error('Invalid or unexpected tool call format');
    }
  } else {
    throw new Error('No tool calls found in response');
  }
}

export const agent = createToolCallingAgent({
  llm: new ChatOpenAI({
    modelName: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
  }),
  tools,
  prompt,
});

export const agentExector = new AgentExecutor({
  agent,
  tools,
});
