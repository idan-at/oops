import { FixedCommand, InputCommand } from "./commands/mod.ts";

export interface Rule {
  matches(command: InputCommand): boolean;
  fix(command: InputCommand): FixedCommand;
}
