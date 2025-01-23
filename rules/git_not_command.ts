import { FixedCommand, InputCommand } from "../commands/mod.ts";
import { Rule } from "./rule.ts";

export class GitNotCommandRule implements Rule {
  matches(input: InputCommand): boolean {
    return input.stderr.includes("is not a git command");
  }

  fix(input: InputCommand): FixedCommand {
    const typo = input.stderr.match("git: '(.+)' is")![1];
    const fix = input.stderr.split("The most similar command is")[1].trim();

    return new FixedCommand(input.raw.replace(typo, fix));
  }
}
