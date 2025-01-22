const decoder = new TextDecoder();

export async function getLastCommand() {
  const history = Deno.env.get("HISTFILE") ||
    `${Deno.env.get("HOME")}/.zsh_history`;

  const historyLines = decoder
    .decode(await Deno.readFile(history))
    .split("\n");

  return historyLines[historyLines.length - 3].split(";")[1];
}
