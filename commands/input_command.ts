export class InputCommand {
  raw: string;
  parts: string[];
  stderr: string;

  constructor(raw: string, stderr: string) {
    this.raw = raw;
    this.parts = raw.split(" ");
    this.stderr = stderr;
  }
}
