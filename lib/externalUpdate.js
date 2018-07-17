import personApi from "./personApi";
import updateOrgchart from "./updateOrgchart";
import updateSearch from "./updateSearch";

import { logger } from "./config";

class ExternalUpdate {
  constructor(cfg) {
    this.personApi = personApi(cfg);
    this.orgchartService = updateOrgchart(cfg);
    this.searchService = updateSearch(cfg);
  }

  handler() {
    return (req, res) => {
      ExternalUpdate.getUserId(req.body)
        .then(userId => this.getAndDistributeUpdate(userId))
        .then(updatedProfile => {
          logger.info(
            `successfully distributed update for ${updatedProfile.userId}`
          );
          res.end();
        })
        .catch(e => {
          logger.error(e);
          res.status(503);
          res.end();
        });
    };
  }

  async getAndDistributeUpdate(userId) {
    return this.personApi(userId)
      .then(updatedProfile => this.searchService(updatedProfile))
      .then(updatedProfile => this.orgchartService(updatedProfile));
  }

  static getUserId(data) {
    if (data && data.userId) {
      return Promise.resolve(data.userId);
    }
    return Promise.reject("No userId in update event");
  }

  static createHandler(cfg) {
    const updater = new ExternalUpdate(cfg);
    return updater.handler();
  }
}

export { ExternalUpdate as default };
