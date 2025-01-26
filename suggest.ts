import readline, { Key } from "node:readline";
import process from "node:process";
import { exec } from "node:child_process";
import colors from "colors";

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
      const indicator = index === currentCommandIndex
        ? colors.green("> ")
        : "  ";
      process.stdout.write(`${indicator}${command}\n`);
      linesWritten++;
    });

    const instructions = colors.yellow(
      "Press ENTER to run selected, CTRL+C to skip, arrows to navigate.",
    );
    process.stdout.write(`\n${instructions}\n`);
    linesWritten++;
  }

  displayCommands();

  rl.on("line", (input: string) => {
    input = input.trim().toLowerCase();

    if (input === "" && !commandExecuted) {
      commandExecuted = true;
      const commandToRun = commands[currentCommandIndex];
      console.log(colors.cyan(commandToRun));

      exec(commandToRun, (error, stdout, stderr) => {
        if (error) {
          console.error(colors.red(`Error executing command: ${error}`));
          if (stderr) {
            console.error(colors.red(`Stderr: ${stderr}`));
          }
        } else {
          console.log(stdout);
        }
        rl.close();
      });
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (_str: string, key: Key) => {
    if (!commandExecuted) {
      if (key.name === "up") {
        currentCommandIndex = Math.max(0, currentCommandIndex - 1);
        displayCommands();
      } else if (key.name === "down") {
        currentCommandIndex = Math.min(
          commands.length - 1,
          currentCommandIndex + 1,
        );
        displayCommands();
      } else if (key.ctrl && key.name === "c") {
        console.log(colors.red("Aborted."));
        rl.close();
      }
    }
  });

  rl.on("SIGINT", () => {
    console.log(colors.red("Aborted."));
    rl.close();
  });

  rl.on("close", () => {
    process.exit(0);
  });
}
