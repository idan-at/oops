const decoder = new TextDecoder();

export async function getLastCommand(): Promise<string> {
  const history = Deno.env.get("HISTFILE") ||
    `${Deno.env.get("HOME")}/.zsh_history`;

  const historyLines = decoder
    .decode(await Deno.readFile(history))
    .split("\n");

  return historyLines[historyLines.length - 3].split(";")[1];
}

export async function getCommandStderr(command: string): Promise<string> {
  const [name, ...args2] = command.split(" ");
  const c = new Deno.Command(name, {
    args: args2,
  });
  const { stderr } = await c.output();
  return decoder.decode(stderr);
}
