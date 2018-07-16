import { load, logger } from "./lib/config";
import App from "./lib/app";

async function main() {
  try {
    const cfg = await load();

    const app = App(cfg);

    app.listen(cfg.port, () => undefined);
  } catch (e) {
    logger.error(`Something went batshit wrong: ${e}`);
    process.exit(1);
  }
}

main();
