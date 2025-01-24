import { getHistoryFilePath } from "./shell.ts";

const decoder = new TextDecoder();

export async function getLastCommand(): Promise<string> {
  const historyLines = decoder
    .decode(await Deno.readFile(getHistoryFilePath()))
    .split("\n");

  return historyLines[historyLines.length - 3].split(";")[1];
}

export async function getCommandOutput(
  command: string,
): Promise<{ stdout: string; stderr: string }> {
  const [name, ...rest] = splitCommand(command);
  const c = new Deno.Command(name, {
    args: rest,
  });
  const { stdout, stderr } = await c.output();

  return {
    stdout: decoder.decode(stdout),
    stderr: decoder.decode(stderr),
  };
}

export function splitCommand(command: string): string[] {
  return command.split(" ");
}
