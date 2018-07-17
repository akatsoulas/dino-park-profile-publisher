import url from "url";

import axios from "axios";
import axiosRetry from "axios-retry";

import CallError from "./error";
import personApi from "./personApi";

import { logger } from "./config";

class UserUpdate {
  constructor(cfg) {
    this.cisUpdateUrl = cfg.cisUpdateUrl;
    this.cisStatusUrl = cfg.cisStatusUrl;
    this.cisStatusTimeout = cfg.cisStatusTimeout;
    this.cisStatusRetryCount = cfg.cisStatusRetryCount;

    this.getProfileByUserId = personApi(cfg);
  }

  handler() {
    return (req, res) => {
      this.publishToCIS(req.body)
        .then(x => this.pollUpdateId(x))
        .then(x => this.getProfileByUserId(x))
        .then(x => res.json(x))
        .catch(e => {
          logger.error(`failed to update profile: ${e}`);
          res.status(503).json({});
        });
    };
  }

  async pollUpdateId(updateId) {
    const statusUrl = url.resolve(this.cisStatusUrl, updateId);
    const retry = axios.create({ timeout: this.cisStatusTimeout });
    axiosRetry(retry, {
      retryCondition: res => {
        return res.status !== 200;
      },
      retries: this.cisStatusRetryCount,
      shouldResetTimeout: true
    });
    try {
      const status = await retry.get(statusUrl);
      if (!(status.data && status.data.userId)) {
        throw new CallError(
          `failed to publish profile: ${status.data && status.data.error}`,
          CallError.FAILED
        );
      }
      return status.data.userId;
    } catch (e) {
      if (e.response) {
        throw new CallError(
          `error retrieving update status for ${updateId}\
(status code: ${e.response.status})`,
          CallError.BADCODE
        );
      } else {
        throw new CallError(
          `error retrieving update status for ${updateId}: ${e}`
        );
      }
    }
  }

  async publishToCIS(profileUpdate) {
    const response = await axios.post(this.cisUpdateUrl, profileUpdate);
    if (!response.data) {
      throw new CallError(
        `publishing profile for ${
          profileUpdate.userId
        } faild with empty response`
      );
    }
    return UserUpdate.parseCISUpdateId(response.data);
  }

  static parseCISUpdateId(data) {
    if (!data.updateId) {
      throw new CallError("CIS update id missing");
    }
    return data.updateId;
  }

  static createHandler(cfg) {
    const updater = new UserUpdate(cfg);
    return updater.handler();
  }
}

export { UserUpdate as default };
