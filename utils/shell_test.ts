import { expect } from "jsr:@std/expect";
// @deno-types="npm:@types/chance@1"
import { Chance } from "chance";
import { getHistoryFilePath } from "./shell.ts";

const chance = new Chance();

Deno.test("getHistoryFilePath when HISTFILE is defined", () => {
  const expected = chance.string();

  const before = Deno.env.get("HISTFILE");
  Deno.env.set("HISTFILE", expected);

  try {
    expect(getHistoryFilePath()).toEqual(expected);
  } finally {
    if (before) {
      Deno.env.set("HISTFILE", before);
    } else {
      Deno.env.delete("HISTFILE");
    }
  }
});

// TODO: support machines where HISTFILE is defined.
Deno.test("getHistoryFilePath zsh", () => {
  expect(getHistoryFilePath()).toEqual(`${Deno.env.get("HOME")}/.zsh_history`);
});
