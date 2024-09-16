import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_AI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export const validateJavascriptContent = async (textInput: string) => {
  const prompt = `
  You are a Senior Javascript/Typescript Engineer with tons of experience in the field.
  Check the Input whether it is a Javascript or Typescript format.
  Check if the input content is a syntax or code otherwise it should be automatically be FALSE.

  #Input
  ${textInput}

  The output should meet the following list:
  - Must be only a boolean type.
  - Response only either TRUE or FALSE.
  `
  const result = await model.generateContent(prompt)
  const responseText = result.response.text()
  if (!responseText) return false

  return responseText.toLowerCase().includes("false") ? false : true
}

export const generateUnitTest = async (textInput: string) => {
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
  `
  
  const result = await model.generateContent(prompt)
  const responseText = result.response.text()
  if (!responseText) return ""

  return responseText.replace("```javascript\n", "").replace("```", "")
}