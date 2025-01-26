import winston from "winston";
import process from "node:process";

export const logger = winston.createLogger({
  level: process.env.OOPS_DEBUG === undefined ? "info" : "debug",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
