import { getCommandOutput, getLastCommand } from "./utils/command.ts";
import { InputCommand } from "./input_command.ts";
import * as rules from "./rules/mod.ts";
import { getAICorrectedCommand } from "./ai/gemini.ts";
import { logger } from "./logger.ts";
import { suggest } from "./suggest.ts";
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
      logger.debug("last command", { lastCommand });

      const { stderr } = await getCommandOutput(lastCommand);
      logger.debug("stderr", { stderr });

      const input = new InputCommand(
        lastCommand,
        stderr,
      );

      const results = [];
      if (args.ai) {
        const aiSgguestions = await getAICorrectedCommand(input);
        logger.debug("ai based correction:", aiSgguestions);
        results.push(...aiSgguestions);
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
        suggest(results);
      } else {
        console.log("No Corrections Found.");
      }
    });

  program.parse(process.argv);
}

if (import.meta.main) {
  main();
}
