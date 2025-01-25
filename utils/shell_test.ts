import { expect } from "expect";
import { test } from "node:test";
// @deno-types="npm:@types/chance@1"
import { Chance } from "chance";
import os from "node:os";
import process from "node:process";
import { getHistoryFilePath } from "./shell.ts";

const chance = new Chance();

test("getHistoryFilePath when HISTFILE is defined", () => {
  const expected = chance.string();

  withHistFileEnvVarAs(expected, () => {
    expect(getHistoryFilePath("")).toEqual(expected);
  });
});

test("getHistoryFilePath bash", () => {
  withHistFileEnvVarAs(null, () => {
    expect(getHistoryFilePath("/bin/bash")).toEqual(
      `${os.homedir()}/.bash_history`,
    );
  });
});

test("getHistoryFilePath zsh", () => {
  withHistFileEnvVarAs(null, () => {
    expect(getHistoryFilePath("/bin/zsh")).toEqual(
      `${os.homedir()}/.zsh_history`,
    );
  });
});

test("getHistoryFilePath unsupported", () => {
  withHistFileEnvVarAs(null, () => {
    expect(() => getHistoryFilePath("/bin/unsupported")).toThrow(
      /Unsupported shell/,
    );
  });
});

function withHistFileEnvVarAs(value: string | null, cb: () => void) {
  const before = process.env.HISTFILE;

  if (value === null) {
    delete process.env.HISTFILE;
  } else {
    process.env.HISTFILE = value;
  }

  try {
    cb();
  } finally {
    if (before) {
      process.env.HISTFILE = before;
    } else {
      delete process.env.HISTFILE;
    }
  }
}
