import axios from "axios";

import { logger } from "./config";

function updateSearch(cfg) {
  return async function searchService(profileUpdate) {
    return axios.post(cfg.searchServiceApiUrl, profileUpdate).then(res => {
      if (res.status === 200 && res.data) {
        logger.info(
          `successfull update for ${profileUpdate.userId} to search service`
        );
        return Promise.resolve(profileUpdate);
      } else {
        logger.error(`failed to publish update for ${profileUpdate.userId}`);
        return Promise.reject(
          `search service returned status code ${res.status}`
        );
      }
    });
  };
}

export { updateSearch as default };
