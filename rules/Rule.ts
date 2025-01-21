import { Command } from "../command.ts";

interface Rule {
  matches(command: Command): boolean;
}
