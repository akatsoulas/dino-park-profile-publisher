import axios from "axios";
import axiosRetry from "axios-retry";

import CallError from "./error";

class UserUpdate {
  constructor(cfg) {
    this.cisUpdateUrl = cfg.cisUpdateUrl;
    this.cisStatusUrl = cfg.cisStatusUrl;
    this.cisPersonApiUrl = cfg.cisPersonApiUrl;
    this.cisStatusTimeout = cfg.cisStatusTimeout;
    this.cisStatusRetryCount = cfg.cisStatusRetryCount;
  }

  handler() {
    return (req, res) => {
      this.publishToCIS(res.body);
    };
  }

  async getUpdateFromCIS(updateID) {
    const statusUrl = url.resolve(this.cisStatusUrl, updateID);
    const retry = axios.create({ timeout: this.cisStatusTimeout });
    axiosRetry(retry, {
      retries: this.cisStatusRetryCount,
      shouldResetTimeout: true
    });
    try {
      const statusResponse = await retry.get(statusUrl);
    } catch (e) {
      if (e.request) {
        throw new CallError(
          `error retrieving update status for ${updateID}`,
          CallError.ERR_NORESP
        );
      } else if (e.response) {
        throw new CallError(
          `error retrieving update status for ${updateID}\
          (status code: ${e.response.status}`,
          CallError.ERR_BADCODE
        );
      } else {
        throw new CallError(`error retrieving update status for ${updateID}`);
      }
    }
  }

  async publishToCIS(profileUpdate) {
    const response = await axios.post(this.cisUpdateUrl, profileUpdate);
    if (response.status !== 200) {
      throw new CallError(
        `publishing profile for ${profileUpdate.user_id} faild with status ${
          response.status
        }`
      );
    }
    return UserUpdate.parseCISUpdateID(response.data);
  }

  static parseCISUpdateID(data) {
    if (!data.updateID) {
      throw new CallError("CIS update id missing");
    }
    return data.updateID;
  }
}

export { UserUpdate as default };
