import { CorrectedCommand, InputCommand } from "../commands/mod.ts";

export function matches(input: InputCommand): boolean {
  return input.stderr.includes("is not a git command") &&
    input.stderr.includes("The most similar command");
}

export function fix(input: InputCommand): CorrectedCommand[] {
  const typo = input.stderr.match("git: '(.+)' is")![1];

  if (input.stderr.includes("The most similar command is")) {
    const fix = input.stderr.split("The most similar command is")[1].trim();

    return [new CorrectedCommand(input.raw.replace(typo, fix))];
  } else {
    const fixes = input.stderr.split("The most similar commands are")[1].trim()
      .split("\n");

    return fixes.map((fix) =>
      new CorrectedCommand(input.raw.replace(typo, fix.trim()))
    );
  }
}
