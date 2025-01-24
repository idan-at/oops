import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import process from "node:process";
import { CorrectedCommand, InputCommand } from "../commands/mod.ts";

export async function getAICorrectedCommand(
  input: InputCommand,
): Promise<CorrectedCommand> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const response = await model.generateContent(
    `I have a type in this command "${input.raw}".
Can you please provide me with the most similar correct command you know? I want you to output a plain json with two fields:
"command" for the first part of the command: probably a binary name, and certainly should not contain s apce, and "args" as an array of arguments. Do not include any other text in the response, including any markdown hints. The response should start with "{"`,
  );

  const x = JSON.parse(response.response.text());
  const correctedCommand = x.command;
  const args = x.args;

  return new CorrectedCommand(`${correctedCommand} ${args.join(" ")}`);
}
