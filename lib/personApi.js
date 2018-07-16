import axios from "axios";

import url from "url";

function personApi(cfg) {
  return async function getProfileByUserID(userId) {
    const profileUrl = url.resolve(cfg.personApiUrl, userId);
    return axios.get(profileUrl).then(res => {
      if (res.status === 200 && res.data) {
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(`PersonApi return status code ${res.status}`);
      }
    });
  };
}

export { personApi as default };
