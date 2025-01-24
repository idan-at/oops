import { Logger } from "jsr:@deno-library/logger";

export const logger = new Logger();

if (Deno.env.get("OOPS_DEBUG") == null) {
  logger.disable("debug");
}
