import { OpenAIApi, Configuration } from 'openai';

export const createChatCompletion = async (content: string) => {
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_AI_API_KEY,
  });

  delete configuration.baseOptions.headers['User-Agent'];
  const openAi = new OpenAIApi(configuration);
  
  return await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": content}]
  });
}