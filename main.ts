import { readLines } from "https://deno.land/std@0.170.0/io/mod.ts";
import { getLastCommand } from "./history.ts";

// Show the last command and ask for corrections
console.log(`Last command: ${await getLastCommand()}`);
console.log("Enter corrected command (or press Enter to skip):");

// Get user input
const correctedCommand = (await (await readLines(Deno.stdin)).next()).value;

// Execute the corrected command
if (correctedCommand) {
  const command = new Deno.Command("echo", {
    args: ["hello world"],
  });
  await command.output();
} else {
  console.log("Skipped.");
}
