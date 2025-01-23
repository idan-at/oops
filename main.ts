import { getLastCommand } from "./history.ts";
import { InputCommand } from "./commands/mod.ts";
import * as rules from "./rules/mod.ts";
import { getAICorrectedCommand } from "./ai/gemini.ts";

async function main() {
  const lastCommand = await getLastCommand();
  const [name, ...args2] = lastCommand.split(" ");
  const c = new Deno.Command(name, {
    args: args2,
  });
  const stderr = (await c.output()).stderr;
  const input = new InputCommand(
    lastCommand,
    new TextDecoder().decode(stderr),
  );

  console.log(`Last command: "${JSON.stringify(input)}"`);
  const results = [await getAICorrectedCommand(input)];

  for (const rule of Object.values(rules)) {
    if (rule.matches(input)) {
      results.push(...rule.fix(input));
    }
  }

  if (results.length > 0) {
    console.log("[idan debug]", results);

    const command = new Deno.Command(results[0].parts[0], {
      args: results[0].parts.slice(1),
    });
    const stdout = (await command.output()).stdout;
    console.log(new TextDecoder().decode(stdout));
  } else {
    console.log("Skipped.");
  }
}

await main();
