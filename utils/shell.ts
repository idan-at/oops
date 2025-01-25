import process from "node:process"
import os from "node:os"

export function getHistoryFilePath(shell: string): string {
  const fromEnv = process.env.HISTFILE;

  return fromEnv || specificShellHistoryFile(shell);
}

function specificShellHistoryFile(shell: string) {
  if (shell == "/bin/bash") {
    return `${os.homedir()}/.bash_history`;
  } else if (shell == "/bin/zsh") {
    return `${os.homedir()}/.zsh_history`;
  }

  throw new Error(`Unsupported shell ${shell}`);
}
