import { splitCommand } from "../command_utils.ts";

export class CorrectedCommand {
  raw: string;
  parts: string[];

  constructor(raw: string) {
    this.raw = raw;
    this.parts = splitCommand(raw);
  }
}
