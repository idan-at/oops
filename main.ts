import { getCommandOoutput, getLastCommand } from "./command_utils.ts";
import { InputCommand } from "./commands/mod.ts";
import * as rules from "./rules/mod.ts";
import { getAICorrectedCommand } from "./ai/gemini.ts";
import { logger } from "./logger.ts";
import { parseArgs } from "jsr:@std/cli";

function parseArguments() {
  return parseArgs(Deno.args, {
    alias: {
      "help": "h",
      "version": "v",
    },
    boolean: [
      "help",
      "ai",
    ],
    string: [
      "version",
    ],
    default: {
      ai: false,
      help: false,
    },
  });
}

async function main() {
  const args = parseArguments();

  if (args.help) {
    console.log("--ai for gemini based suggestions.");
    Deno.exit(0);
  }

  const lastCommand = await getLastCommand();
  const { stderr } = await getCommandOoutput(lastCommand);

  const input = new InputCommand(
    lastCommand,
    stderr,
  );
  logger.debug(`Last command: ${lastCommand}`);
  logger.debug(`stderr: ${stderr}`);

  const results = [];
  if (args.ai) {
    const result = await getAICorrectedCommand(input);
    logger.debug(`ai based correction: ${JSON.stringify(result)}`);
    results.push(result);
  }

  for (const [name, rule] of Object.entries(rules)) {
    const matches = rule.matches(input);
    logger.debug(`rule ${name} matches: ${matches}`);

    if (matches) {
      results.push(...rule.correct(input));
    }
  }

  logger.debug(`results: ${JSON.stringify(results)}`);
  if (results.length > 0) {
    const { stdout } = await getCommandOoutput(results[0].raw);
    console.log(stdout);
  } else {
    console.log("Skipped.");
  }
}

await main();
