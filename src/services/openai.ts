import { OpenAIApi, Configuration } from 'openai';

export const createChatCompletion = async (prompt: string) => {
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_AI_API_KEY,
  });

  delete configuration.baseOptions.headers['User-Agent'];
  const openAi = new OpenAIApi(configuration);
  
  return await openAi.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 2048,
  });
}