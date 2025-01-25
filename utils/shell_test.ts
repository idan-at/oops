import { expect } from "jsr:@std/expect";
// @deno-types="npm:@types/chance@1"
import { Chance } from "chance";
import os from "node:os";
import { getHistoryFilePath } from "./shell.ts";

const chance = new Chance();

Deno.test("getHistoryFilePath when HISTFILE is defined", () => {
  const expected = chance.string();

  withHistFileEnvVarAs(expected, () => {
    expect(getHistoryFilePath("")).toEqual(expected);
  });
});

Deno.test("getHistoryFilePath bash", () => {
  withHistFileEnvVarAs(null, () => {
    expect(getHistoryFilePath("/bin/bash")).toEqual(
      `${os.homedir()}/.bash_history`,
    );
  });
});

Deno.test("getHistoryFilePath zsh", () => {
  withHistFileEnvVarAs(null, () => {
    expect(getHistoryFilePath("/bin/zsh")).toEqual(
      `${os.homedir()}/.zsh_history`,
    );
  });
});

Deno.test("getHistoryFilePath unsupported", () => {
  withHistFileEnvVarAs(null, () => {
    expect(() => getHistoryFilePath("/bin/unsupported")).toThrow(
      /Unsupported shell/,
    );
  });
});

function withHistFileEnvVarAs(value: string | null, cb: () => void) {
  const before = Deno.env.get("HISTFILE");

  if (value === null) {
    Deno.env.delete("HISTFILE");
  } else {
    Deno.env.set("HISTFILE", value);
  }

  try {
    cb();
  } finally {
    if (before) {
      Deno.env.set("HISTFILE", before);
    } else {
      Deno.env.delete("HISTFILE");
    }
  }
}
