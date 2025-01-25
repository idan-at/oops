import { expect } from "jsr:@std/expect";
import os from "node:os";
import { getCommandOutput } from "./command.ts";

Deno.test("getCommandOutput stdout", async () => {
  const { stdout, stderr } = await getCommandOutput("echo 1");
  expect(stdout).toBe(`1${os.EOL}`);
  expect(stderr).toBe("");
});

Deno.test("getCommandOutput stderr", async () => {
  const { stdout, stderr } = await getCommandOutput("ls does-not-exist");
  expect(stdout).toBe("");
  expect(stderr).toMatch(/No such file or directory/);
});
