import { ChatOpenAI } from '@langchain/openai';
import OpenAI from 'openai';

export interface LLMConfig {
  temperature?: number;
}

/**
 * Returns a LangChain ChatOpenAI instance configured for either Gemini or Nvidia/Anthropic.
 */
export function getLLM(config: LLMConfig = {}) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY;

  if (geminiKey) {
    return new ChatOpenAI({
      openAIApiKey: geminiKey,
      configuration: { baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/' },
      modelName: 'gemini-2.5-flash', 
      temperature: config.temperature ?? 0.7,
    });
  }

  // Fallback to Nvidia llama-3.1
  return new ChatOpenAI({
    openAIApiKey: nvidiaKey || 'placeholder',
    configuration: { baseURL: 'https://integrate.api.nvidia.com/v1' },
    modelName: 'nvidia/llama-3.1-nemotron-70b-instruct',
    temperature: config.temperature ?? 0.7,
  });
}

/**
 * Returns a standard OpenAI SDK client configured for either Gemini or Nvidia.
 */
export function getOpenAIClient() {
  const geminiKey = process.env.GEMINI_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY;

  if (geminiKey) {
    return new OpenAI({
      apiKey: geminiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });
  }

  return new OpenAI({
    apiKey: nvidiaKey || 'placeholder',
    baseURL: 'https://integrate.api.nvidia.com/v1',
  });
}

/**
 * Returns the correct model name based on provider.
 */
export function getModelName() {
  return process.env.GEMINI_API_KEY ? 'gemini-2.5-flash' : 'nvidia/llama-3.1-nemotron-70b-instruct';
}
