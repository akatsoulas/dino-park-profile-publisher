import express from "express";
import bodyParser from "body-parser";
import { load, logger } from "./lib/config";

async function main() {
  try {
    const app = express();
    app.use(bodyParser.json());
    const cfg = await load();

    app.listen(cfg.port, () => undefined);
  } catch (e) {
    logger.error(`Something went batshit wrong: ${e}`);
    process.exit(1);
  }
}

main();
