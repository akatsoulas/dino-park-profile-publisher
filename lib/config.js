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

function int(x) {
  if (!Number.isInteger(x)) {
    throw new Error("should be an integer");
  }
}

function url(s) {
  try {
    const u = new URL(s);
  } catch (e) {
    throw new Error(`should be an vaild URL (${e})`);
  }
}

const VALID = [
  ["port", int],
  ["cisUpdateUrl", url],
  ["cisStatusUrl", url],
  ["cisStatusTimeout", int],
  ["cisStatusRetryCount", int],
  ["personApiUrl", url]
];

function validateConfig(config) {
  let error;
  for (const [key, validate] of VALID) {
    if (!(key in config)) {
      error = `missing ${key}`;
      break;
    }
    try {
      validate(config[key]);
    } catch (e) {
      error = `${key} ${e.message}`;
      break;
    }
  }
  if (error) {
    throw new Error(`Config file malformed: ${error}!`);
  }
  return config;
}

async function load(configFile) {
  try {
    const configString = await promisify(fs.readFile)(configFile, {
      encoding: "utf-8"
    });
    const config = JSON.parse(configString);
    return validateConfig(config);
  } catch (e) {
    throw new Error(`error reading config: ${e}`);
  }
}

export { load, logger, validateConfig, int, url };
