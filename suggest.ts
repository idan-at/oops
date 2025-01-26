import readline, { Key } from "node:readline";
import process from "node:process";
import { exec } from "node:child_process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function suggest(commands: string[]) {
  let commandExecuted = false;
  let currentCommandIndex = 0;

  function displayCommands() {
    console.clear();
    commands.forEach((command, index) => {
      const indicator = index === currentCommandIndex ? "> " : "  ";
      console.log(`${indicator}${command}`);
    });
    if (!commandExecuted) {
      console.log(
        "\nPress ENTER/y to run selected, CTRL+C/n to skip, j/k or arrows to navigate.",
      );
    }
  }

  displayCommands();

  rl.on("line", (input) => {
    input = input.trim().toLowerCase();

    if (input === "" || input === "y" && !commandExecuted) {
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
  process.stdin.on("keypress", (_str: string, key: Key) => {
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
    process.stdin.setRawMode(false);
    process.exit(0);
  });
}
