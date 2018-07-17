import axios from "axios";

import { logger } from "./config";

function updateOrgchart(cfg) {
  return async function orgchartService(profileUpdate) {
    return axios.post(cfg.orgchartApiUrl, profileUpdate).then(res => {
      if (res.status === 200 && res.data) {
        logger.info(
          `successfull update for ${profileUpdate.userId} to orgchart service`
        );
        return Promise.resolve(profileUpdate);
      } else {
        return Promise.reject(
          `orgchart service return status code ${res.status}`
        );
      }
    });
  };
}

export { updateOrgchart as default };
