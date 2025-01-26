import readline, { Key } from "node:readline";
import process from "node:process";
import { exec } from "node:child_process";

export function suggest(commands: string[]): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let currentCommandIndex = 0;
  let commandExecuted = false;
  let linesWritten = 0;

  function displayCommands() {
    readline.moveCursor(process.stdout, 0, -linesWritten - 1);
    readline.clearScreenDown(process.stdout);

    linesWritten = 0;

    commands.forEach((command, index) => {
      const indicator = index === currentCommandIndex ? "> " : "  ";
      process.stdout.write(`${indicator}${command}\n`);
      linesWritten++;
    });

    if (!commandExecuted) {
      process.stdout.write(
        "\nPress ENTER/y to run selected, CTRL+C/n to skip, j/k or arrows to navigate.\n",
      );
      linesWritten++;
    }
  }

  displayCommands();

  rl.on("line", (input: string) => {
    input = input.trim().toLowerCase();

    if ((input === "" || input === "y") && !commandExecuted) {
      commandExecuted = true;
      const commandToRun = commands[currentCommandIndex];
      console.log(`Executing: ${commandToRun}`);

      exec(commandToRun, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          if (stderr) {
            console.error(`Stderr: ${stderr}`);
          }
        } else {
          console.log(`Stdout: ${stdout}`);
        }
        rl.close();
      });
    } else if (input === "n" && !commandExecuted) {
      console.log("Skipping command.");
      currentCommandIndex++;
      if (currentCommandIndex >= commands.length) {
        console.log("No more commands.");
        rl.close();
        return;
      }
      displayCommands();
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (_str: string, key: Key) => { // Key type is now Key
    if (!commandExecuted) {
      if (key.name === "up" || key.name === "k") {
        currentCommandIndex = Math.max(0, currentCommandIndex - 1);
        displayCommands();
      } else if (key.name === "down" || key.name === "j") {
        currentCommandIndex = Math.min(
          commands.length - 1,
          currentCommandIndex + 1,
        );
        displayCommands();
      } else if (key.ctrl && key.name === "c") {
        console.log("Exiting.");
        rl.close();
      }
    }
  });

  rl.on("SIGINT", () => {
    console.log("Exiting.");
    rl.close();
  });

  rl.on("close", () => {
    process.exit(0);
  });
}
