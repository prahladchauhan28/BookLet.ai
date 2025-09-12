import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";
dotenv.config();

// Initialize the Gemini model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash", 
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0,
});

// Define the prompt template
const promptTemplate = PromptTemplate.fromTemplate(
  "Summarize the following text into 5-7 concise bullet points:\n\n${text}"
);

// Create the chain
const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

// Function to summarize text
export async function getSummary(text) {
  try {
    const response = await chain.invoke({ text });
    return response;
  } catch (error) {
    console.error("Error summarizing text:", error);
    return error.message;
  }
}
