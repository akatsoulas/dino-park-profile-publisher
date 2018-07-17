import { load, logger } from "./lib/config";
import App from "./lib/app";

async function main() {
  try {
    const cfg = await load("config.json");

    const app = App(cfg);

    logger.info(`starting to serve on port: ${cfg.port}`);
    app.listen(cfg.port, () => undefined);
  } catch (e) {
    logger.error(`Something went batshit wrong: ${e}`);
    process.exit(1);
  }
}

main();
