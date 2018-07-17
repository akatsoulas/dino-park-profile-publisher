/* global describe it beforeEach afterEach */
import EventEmitter from "events";

import "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import UserUpdate from "../lib/userUpdate";
import { EMPTY } from "./configs";
import { createRequest, createResponse } from "node-mocks-http";

chai.use(chaiAsPromised);
chai.should();

describe("Handle updates from users", () => {
  describe("handler", () => {
    let mock;
    before(() => {
      mock = new MockAdapter(axios);
    });
    beforeEach(() => {
      mock.reset();
    });
    afterEach(() => {
      mock.reset();
    });
    after(() => {
      mock.restore();
    });

    it("all working", () => {
      const updateId = "abcd1234";
      const userId = "deadbeef";
      const userUpdate = { updateId };
      const updatedProfile = { updateId, something: "else" };
      const updater = new UserUpdate(EMPTY);

      mock.onPost().replyOnce(200, { updateId });
      mock.onGet().replyOnce(404);
      mock.onGet().replyOnce(200, { userId });
      mock.onGet().replyOnce(200, updatedProfile);

      const handler = updater.handler();
      const req = createRequest({ method: "POST", body: userUpdate });
      const res = createResponse({
        eventEmitter: EventEmitter
      });

      const result = new Promise(resolve => {
        res.on("end", () => {
          res._isEndCalled().should.be.true;
          res.statusCode.should.be.equal(200);
          const data = JSON.parse(res._getData());
          data.should.be.deep.equal(updatedProfile);
          resolve();
        });
      });

      handler(req, res);

      return result;
    });
    it("an error happens", () => {
      const updateId = "abcd1234";
      const userId = "deadbeef";
      const userUpdate = { updateId };
      const updatedProfile = { updateId, something: "else" };

      mock.onPost().replyOnce(200, { updateId });
      mock.onGet().replyOnce(404);
      mock.onGet().replyOnce(503);

      const handler = UserUpdate.createHandler(EMPTY);
      const req = createRequest({ method: "POST", body: userUpdate });
      const res = createResponse({
        eventEmitter: EventEmitter
      });

      const result = new Promise(resolve => {
        res.on("end", () => {
          res._isEndCalled().should.be.true;
          res.statusCode.should.be.equal(503);
          resolve();
        });
      });

      handler(req, res);

      return result;
    });
  });
});
