import { userInfo } from "node:os";

export function getHistoryFilePath(): string {
  const fromEnv = Deno.env.get("HISTFILE");

  return fromEnv || specificShellHistoryFile();
}

function specificShellHistoryFile() {
  // TODO: act by this
  userInfo().shell;

  return `${Deno.env.get("HOME")}/.zsh_history`;
}
