import { getLastCommand } from "./history.ts";

async function main() {
  console.log(`Last command: ${await getLastCommand()}`);

  const correctedCommand = "echo";
  const args = ["1", "2"];

  if (correctedCommand) {
    const command = new Deno.Command(correctedCommand, {
      args,
    });
    console.log((await command.output()).stdout);
  } else {
    console.log("Skipped.");
  }
}

await main();
