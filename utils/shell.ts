export function getHistoryFilePath(shell: string): string {
  const fromEnv = Deno.env.get("HISTFILE");

  return fromEnv || specificShellHistoryFile(shell);
}

function specificShellHistoryFile(shell: string) {
  if (shell == "/bin/bash") {
    return `${Deno.env.get("HOME")}/.bash_history`;
  } else if (shell == "/bin/zsh") {
    return `${Deno.env.get("HOME")}/.zsh_history`;
  }

  throw new Error(`Unsupported shell ${shell}`);
}
