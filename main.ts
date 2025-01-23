import { getCommandStderr, getLastCommand } from "./history.ts";
import { InputCommand } from "./commands/mod.ts";
import * as rules from "./rules/mod.ts";
import { getAICorrectedCommand } from "./ai/gemini.ts";
import { Logger } from "jsr:@deno-library/logger";

const logger = new Logger();

async function main() {
  const lastCommand = await getLastCommand();
  const stderr = await getCommandStderr(lastCommand);

  const input = new InputCommand(
    lastCommand,
    stderr,
  );
  logger.debug(`Last command: ${lastCommand}`);
  logger.debug(`stderr: ${stderr}`);

  const results = [await getAICorrectedCommand(input)];

  for (const [name, rule] of Object.entries(rules)) {
    const matches = rule.matches(input);
    logger.debug(`rule ${name} matches: ${matches}`);

    if (matches) {
      results.push(...rule.fix(input));
    }
  }

  logger.debug(`results: ${JSON.stringify(results)}`);
  if (results.length > 0) {
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
