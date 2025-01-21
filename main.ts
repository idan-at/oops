import { getLastCommand } from "./history.ts";

async function main() {
  console.log(`Last command: ${await getLastCommand()}`);

  const correctedCommand = "echo";
  const args = ["1", "2"];

  if (correctedCommand) {
    const command = new Deno.Command(correctedCommand, {
      args,
    });
    const stdout = (await command.output()).stdout;
    new TextDecoder().decode(stdout);
    console.log(new TextDecoder().decode(stdout));
  } else {
    console.log("Skipped.");
  }
}

await main();
