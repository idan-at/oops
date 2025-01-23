import { expect } from "jsr:@std/expect";
import { CorrectedCommand, InputCommand } from "../commands/mod.ts";
import { fix, matches } from "./git_not_command.ts";

Deno.test("matches - single suggestion", () => {
  const output = `\
git: 'stats' is not a git command. See 'git --help'.

The most similar command is
	status

`;
  const command = new InputCommand("git stats", output);

  expect(matches(command)).toBeTruthy();
});

Deno.test("matches - multiple suggestions", () => {
  const output = `\
git: 'b' is not a git command. See 'git --help'.

The most similar commands are
	bisect
  branch

`;
  const command = new InputCommand("git b", output);

  expect(matches(command)).toBeTruthy();
});

Deno.test("no match - missing suggestion", () => {
  const output = `\
git: 'lalalala' is not a git command. See 'git --help'.
`;
  const command = new InputCommand("git lalalala", output);

  expect(matches(command)).toBeFalsy();
});

Deno.test("fix - single suggestion", () => {
  const output = `\
git: 'stats' is not a git command. See 'git --help'.

The most similar command is
	status

`;
  const command = new InputCommand("git stats", output);

  expect(fix(command)).toStrictEqual([
    new CorrectedCommand("git status"),
  ]);
});

Deno.test("fix - multiple suggestions", () => {
  const output = `\
git: 'b' is not a git command. See 'git --help'.

The most similar commands are
	bisect
  branch

`;
  const command = new InputCommand("git b", output);

  expect(fix(command)).toStrictEqual([
    new CorrectedCommand("git bisect"),
    new CorrectedCommand("git branch"),
  ]);
});
