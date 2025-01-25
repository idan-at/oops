import winston from "winston";
import process from "node:process";

export const logger = winston.createLogger({
  level: process.env.OOPS_DEBUG === undefined ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.cli(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
