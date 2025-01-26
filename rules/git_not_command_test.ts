import { expect } from "expect";
import { test } from "node:test";
import { InputCommand } from "../input_command.ts";
import { correct, matches } from "./git_not_command.ts";

test("matches - single suggestion", () => {
  const output = `\
git: 'stats' is not a git command. See 'git --help'.

The most similar command is
	status

`;
  const command = new InputCommand("git stats", output);

  expect(matches(command)).toBeTruthy();
});

test("matches - multiple suggestions", () => {
  const output = `\
git: 'b' is not a git command. See 'git --help'.

The most similar commands are
	bisect
  branch

`;
  const command = new InputCommand("git b", output);

  expect(matches(command)).toBeTruthy();
});

test("no match - missing suggestion", () => {
  const output = `\
git: 'lalalala' is not a git command. See 'git --help'.
`;
  const command = new InputCommand("git lalalala", output);

  expect(matches(command)).toBeFalsy();
});

test("correct - single suggestion", () => {
  const output = `\
git: 'stats' is not a git command. See 'git --help'.

The most similar command is
	status

`;
  const command = new InputCommand("git stats", output);

  expect(correct(command)).toStrictEqual([
    "git status",
  ]);
});

test("correct - multiple suggestions", () => {
  const output = `\
git: 'b' is not a git command. See 'git --help'.

The most similar commands are
	bisect
  branch

`;
  const command = new InputCommand("git b", output);

  expect(correct(command)).toStrictEqual([
    "git bisect",
    "git branch",
  ]);
});
