import { expect } from "expect";
import { test } from "node:test";
import { describe } from "jsr:@std/testing/bdd";

const decoder = new TextDecoder();

await new Deno.Command("deno", {
  args: [
    "compile",
    "--allow-env",
    "--allow-read",
    "--allow-run",
    "--allow-net",
    "--allow-sys",
    "main.ts",
  ],
}).spawn().status;

describe("integratoin tests", () => {
  test("help menu", async () => {
    const { stdout, success } = await new Deno.Command("./oops", {
      args: ["--help"],
    }).output();

    expect(success).toBeTruthy();
    expect(decoder.decode(stdout)).toContain(
      "Correct your previous command",
    );
  });
});
