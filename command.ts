export class Command {
  raw: string;
  parts: string[];
  stderr: string;

  constructor(command: string, stderr: string) {
    this.raw = command;
    this.parts = command.split(" ");
    this.stderr = stderr;
  }

  toString() {
    return JSON.stringify({
      raw: this.raw,
      parts: this.parts,
      stdout: this.stderr,
    });
  }
}
