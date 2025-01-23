import { getLastCommand } from "./history.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { InputCommand } from "./commands/mod.ts";
import * as rules from "./rules/mod.ts";
import process from "node:process";

async function main() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const lastCommand = await getLastCommand();
  const [name, ...args2] = lastCommand.split(" ");
  const c = new Deno.Command(name, {
    args: args2,
  });
  const stderr = (await c.output()).stderr;
  const command = new InputCommand(
    lastCommand,
    new TextDecoder().decode(stderr),
  );

  console.log(`Last command: "${JSON.stringify(command)}"`);

  const response = await model.generateContent(
    `I have a type in this command "${command.raw}".
Can you please provide me with the most similar correct command you know? I want you to output a plain json with two fields:
"command" for the first part of the command: probably a binary name, and certainly should not contain s apce, and "args" as an array of arguments. Do not include any other text in the response, including any markdown hints. The response should start with "{"`,
  );

  for (const Rule of Object.values(rules)) {
    const rule = new Rule();
    console.log(
      "Rule: ",
      Rule,
      rule.matches(command),
      rule.fix(command),
    );
  }

  console.log(response.response.text());
  const x = JSON.parse(response.response.text());
  const correctedCommand = x.command;
  const args = x.args;

  if (correctedCommand) {
    const command = new Deno.Command(correctedCommand, {
      args,
    });
    const stdout = (await command.output()).stdout;
    console.log(new TextDecoder().decode(stdout));
  } else {
    console.log("Skipped.");
  }
}

await main();
