/* global describe it beforeEach afterEach */
import "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import ExternalUpdate from "../lib/externalUpdate";
import { EMPTY } from "./configs";

chai.use(chaiAsPromised);
chai.should();

describe("Handle updates from extenal sources", () => {
  describe("cis update event body parser", () => {
    it("parse proper cis body", () => {
      const body = { userId: "deadbeef" };
      const userId = ExternalUpdate.getUserId(body);
      userId.should.eventually.be.equal(body.userId);
    });

    it("throw exception when something is wrong", () => {
      const body = {};
      const userId = ExternalUpdate.getUserId(body);
      userId.should.be.rejected;
    });
  });

  describe("get and publish", () => {
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

    it("successful publish call", () => {
      const userId = "deadbeef";
      const updatedProfile = { userId, something: "something new" };
      const updater = new ExternalUpdate(EMPTY);

      mock.onGet().replyOnce(200, updatedProfile);
      mock.onPost().replyOnce(200, {});
      mock.onPost().replyOnce(200, {});

      return updater
        .getAndDistributeUpdate(userId)
        .should.eventually.be.deep.equal(updatedProfile);
    });
  });
});
