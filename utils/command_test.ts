import { expect } from "jsr:@std/expect";
import { getCommandOoutput } from "./command.ts";

Deno.test("getCommandOoutput stdout", async () => {
  const { stdout, stderr } = await getCommandOoutput("echo 1");
  expect(stdout).toBe("1\n");
  expect(stderr).toBe("");
});

Deno.test("getCommandOoutput stderr", async () => {
  const { stdout, stderr } = await getCommandOoutput("ls does-not-exist");
  expect(stdout).toBe("");
  expect(stderr).toMatch(/No such file or directory/);
});
