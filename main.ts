import { getCommandOutput, getLastCommand } from "./utils/command.ts";
import { InputCommand } from "./commands/mod.ts";
import * as rules from "./rules/mod.ts";
import { getAICorrectedCommand } from "./ai/gemini.ts";
import { logger } from "./logger.ts";
import process from "node:process";
import { program } from "commander";

function main() {
  program
    .name("oops")
    .description("Correct your previous command")
    .version("0.1.0")
    .option("--ai", "correct with ai", false)
    .action(async (args) => {
      logger.debug("args", args);

      const lastCommand = await getLastCommand();
      const { stderr } = await getCommandOutput(lastCommand);

      const input = new InputCommand(
        lastCommand,
        stderr,
      );
      logger.debug("last command:", lastCommand);
      logger.debug("stderr:", stderr);

      const results = [];
      if (args.ai) {
        const result = await getAICorrectedCommand(input);
        logger.debug("ai based correction:", result);
        results.push(result);
      }

      for (const [name, rule] of Object.entries(rules)) {
        const matches = rule.matches(input);
        logger.debug(`rule ${name} matches: ${matches}`);

        if (matches) {
          results.push(...rule.correct(input));
        }
      }

      logger.debug("results:", results);
      if (results.length > 0) {
        const { stdout } = await getCommandOutput(results[0].raw);
        console.log(stdout);
      } else {
        console.log("Skipped.");
      }
    });

  program.parse(process.argv);
}

if (import.meta.main) {
  main();
}
