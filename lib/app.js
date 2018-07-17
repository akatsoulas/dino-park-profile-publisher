import express from "express";
import bodyParser from "body-parser";

import { logger } from "./config";
import UserUpdate from "./userUpdate";
import ExternalUpdate from "./externalUpdate";

function App(cfg) {
  const app = express();
  app.use(bodyParser.json());
  app.post("/userupdate", UserUpdate.createHandler(cfg));
  app.post("/externalupdate", ExternalUpdate.createHandler(cfg));
  return app;
}

export { App as default };
