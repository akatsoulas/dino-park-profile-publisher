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

const VALID = [
  ["port", parseInt],
  ["cisUpdateUrl"],
  ["cisStatusUrl"],
  ["cisPersonApiUrl"],
  ["cisStatusTimeout"],
  ["cisStatusRetryCount"],
  ["personApiUrl"]
];
function identity(x) {
  return x;
}

function validateConfig(config) {
  let error;
  for (const [key, validate = identity] of VALID) {
    if (!(key in config)) {
      error = `missing ${key}`;
      break;
    }
    const val = validate(config[key]);
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

export { load, logger, validateConfig };
