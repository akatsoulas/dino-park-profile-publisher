import axios from "axios";

import url from "url";

function personApi(cfg) {
  return async function getProfileByUserID(userId) {
    const profileUrl = url.resolve(cfg.personApiUrl, userId);
    return axios.get(profileUrl);
  };
}

export { personApi as default };
