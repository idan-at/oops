import { GoogleGenerativeAI } from "@google/generative-ai";
import process from "node:process";
import { InputCommand } from "../input_command.ts";

export async function getAICorrectedCommand(
  input: InputCommand,
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const response = await model.generateContent(
    `I have a typo in this command "${input.raw}". Please give me up to 3 most similar commands as correct suggestions. I want you to output a plain json array that I can parse using JSON.parse. For example: ["one", "two"]. The response should start with "["`,
  );

  return JSON.parse(response.response.text());
}
