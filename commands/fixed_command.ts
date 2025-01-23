export class CorrectedCommand {
  raw: string;
  parts: string[];

  constructor(raw: string) {
    this.raw = raw;
    this.parts = raw.split(" ");
  }
}
