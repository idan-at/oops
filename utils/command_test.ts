import { expect } from "expect";
import { test } from "node:test";
import os from "node:os";
import { getCommandOutput } from "./command.ts";

test("getCommandOutput stdout", async () => {
  const { stdout, stderr } = await getCommandOutput("echo 1");

  expect(stdout).toBe(`1${os.EOL}`);
  expect(stderr).toBe("");
});

test("getCommandOutput stderr", async () => {
  const { stdout, stderr } = await getCommandOutput("ls does-not-exist");

  expect(stdout).toBe("");
  expect(stderr).toMatch(/No such file or directory/);
});

test("getCommandOutput timeout", async () => {
  const { stdout, stderr } = await getCommandOutput("sleep 10");

  expect(stdout).toBe("");
  expect(stderr).toBe("");
});
