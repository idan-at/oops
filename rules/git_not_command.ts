import { Command } from "../command.ts";
import { Fix, Rule } from "./rule.ts";

export class GitNotCommandRule implements Rule {
  matches(command: Command): boolean {
    return command.stderr.includes("is not a git command");
  }

  fix(command: Command): Fix {
    const typo = command.stderr.match("git: '(.+)' is")![1];
    const fix = command.stderr.split("The most similar command is")[1].trim();

    return command.raw.replace(typo, fix);
  }
}
