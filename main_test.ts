import { expect } from "expect";
import { test } from "node:test";
import { before, describe } from "jsr:@std/testing/bdd";

const decoder = new TextDecoder();

describe("integratoin tests", () => {
  before(async () => {
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
  });

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
