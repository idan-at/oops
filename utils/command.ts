import { getHistoryFilePath } from "./shell.ts";
import { logger } from "../logger.ts";
import { userInfo } from "node:os";
import { promisify } from "node:util";
import { exec } from "node:child_process";
import { readFile } from "node:fs/promises";

const execPromise = promisify(exec);

const DEFAULT_SHELL = "/bin/bash";

export async function getLastCommand(): Promise<string> {
  const shell = userInfo().shell || DEFAULT_SHELL;
  logger.debug("shell:", { shell });

  const historyLines =
    (await readFile(getHistoryFilePath(shell), { encoding: "utf-8" }))
      .split("\n");

  return historyLines[historyLines.length - 3].split(";")[1];
}

export async function getCommandOutput(
  command: string,
): Promise<{ stdout: string; stderr: string }> {
  const { stdout, stderr } = await execPromise(command).catch((x) => x);

  return {
    stdout,
    stderr,
  };
}

export function splitCommand(command: string): string[] {
  return command.split(" ");
}
