import { Logger } from "jsr:@deno-library/logger";
import process from "node:process";

export const logger = new Logger();

if (process.env.OOPS_DEBUG === undefined) {
  logger.disable("debug");
}
