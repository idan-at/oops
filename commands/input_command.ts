import { splitCommand } from "../command_utils.ts";
export class InputCommand {
  raw: string;
  parts: string[];
  stderr: string;

  constructor(raw: string, stderr: string) {
    this.raw = raw;
    this.parts = splitCommand(raw);
    this.stderr = stderr;
  }
}
