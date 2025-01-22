import { Command } from "../command.ts";

export interface Fix {
  command: string;
  args: string[];
}

export interface Rule {
  matches(command: Command): boolean;
  fix(command: Command): Fix;
}
