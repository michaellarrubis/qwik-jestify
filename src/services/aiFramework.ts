import { GoogleGenerativeAI } from '@google/generative-ai';

export const createChatCompletion = async (textInput: string) => {
  const testingFramework = 'Jest'
  const prompt = `
  You are a Senior Javascript Engineer with tons of experience using ${testingFramework}. 
  Write a unit Test based on ${testingFramework}.

  # Input Block
  ${textInput}
  # Input Block

  The output should only contain the following:
    - import scripts
    - describe() blocks
    - explainations should be excluded.
  `;

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  if (!responseText) return "";

  return responseText.replace("```javascript\n", "").replace("```", "");
}