# oops

A `thefuck` alternative written in Typescript with Deno.

## Compile

- Deno:
  `deno compile --allow-env --allow-read --allow-run --allow-net --allow-sys main.ts`
- Bun: `bun build main.ts --compile`

## TODO:

- Drop deno specific code from main_test
- Test compilation of deno&bun in main_test
- move cli to a new cli.ts file
- direct cli tests
- multiple ai services support (--ai gemini/model for example)
