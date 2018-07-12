import { promisify } from "util";
import fs from "fs";
import winston from "winston";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple()
  )
});

const VALID = [["port", parseInt], ["cisURL"]];

function identity(x) {
  return x;
}

function validateConfig(config) {
  return VALID.map(([key, validate = identity]) => {
    let error;
    try {
      const val = validate(config[key]);
      if (config.hasKey(key) || typeof val !== "undefined") {
        return val;
      }
      error = `missing ${key}`;
    } catch (e) {
      error = `${e}`;
    }
    throw new Error(`Config file malformed: ${error}!`);
  });
}

async function load(configFile = "config.json") {
  try {
    const configString = await promisify(fs.readFile)(configFile, {
      encoding: "utf-8"
    });
    const config = JSON.parse(configString);
    return validateConfig(config);
  } catch (e) {
    return Promise.reject(new Error(`error reading config: ${e}`));
  }
}

export { load, logger };
