/* global describe it beforeEach afterEach */
import "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import UserUpdate from "../lib/userUpdate";
import CallError from "../lib/error";
import { EMPTY } from "./configs";

chai.use(chaiAsPromised);
chai.should();

describe("Handle updates from users", () => {
  describe("cis update response body parser", () => {
    it("parse proper cis body", () => {
      const body = { updateId: "abcd1234" };
      const updateId = UserUpdate.parseCISUpdateId(body);
      updateId.should.equal(body.updateId);
    });

    it("throw exception when something is wrong", () => {
      const body = {};
      const call = () => UserUpdate.parseCISUpdateId(body);
      call.should.throw();
    });
  });

  describe("cis call", () => {
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
      const data = { updateId: "abcd1234" };
      const updater = new UserUpdate(EMPTY);

      mock.onPost().replyOnce(200, data);

      return updater.publishToCIS().should.eventually.be.equal(data.updateId);
    });

    it("fail on 404", () => {
      const updater = new UserUpdate(EMPTY);

      mock.onPost().replyOnce(404, null);

      return updater.publishToCIS().should.be.rejected;
    });

    it("fail on empty response", () => {
      const updater = new UserUpdate(EMPTY);

      mock.onPost().replyOnce(200, null);

      return updater.publishToCIS().should.be.rejected;
    });

    it("fail on weird response", () => {
      const updater = new UserUpdate(EMPTY);

      mock.onPost().replyOnce(200, "weirdo");

      return updater.publishToCIS().should.be.rejected;
    });
  });

  describe("poll updateId", () => {
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

    it("successful poll", () => {
      const updateId = "abcd1234";
      const userId = "deadbeef";
      const updater = new UserUpdate(EMPTY);

      mock.onGet().replyOnce(200, { userId });

      return updater.pollUpdateId(updateId).should.eventually.be.equal(userId);
    });

    it("successful poll after 3 attempts", () => {
      const updateId = "abcd1234";
      const userId = "deadbeef";
      const updater = new UserUpdate(EMPTY);

      mock
        .onGet()
        .replyOnce(404)
        .onGet()
        .replyOnce(404)
        .onGet()
        .replyOnce(200, { userId });

      return updater.pollUpdateId(updateId).should.eventually.be.equal(userId);
    });

    it("fail on empty response", () => {
      const updateId = "abcd1234";
      const userId = "deadbeef";
      const updater = new UserUpdate(EMPTY);

      mock.onGet().reply(200, null);

      return updater
        .pollUpdateId(updateId)
        .should.be.rejectedWith(CallError, /FAILED/);
    });

    it("fail on error response", () => {
      const updateId = "abcd1234";
      const userId = "deadbeef";
      const updater = new UserUpdate(EMPTY);

      mock.onGet().reply(200, { error: "Anything" });

      return updater
        .pollUpdateId(updateId)
        .should.be.rejectedWith(CallError, /FAILED/);
    });

    it("fail poll after 3 attempts", () => {
      const updateId = "abcd1234";
      const userId = "deadbeef";
      const updater = new UserUpdate(EMPTY);

      mock.onGet().reply(404);

      return updater
        .pollUpdateId(updateId)
        .should.be.rejectedWith(CallError, /BADCODE/);
    });

    it("timeout poll", () => {
      const updateId = "abcd1234";
      const userId = "deadbeef";
      const updater = new UserUpdate(EMPTY);

      mock.onGet().timeout();

      return updater
        .pollUpdateId(updateId)
        .should.be.rejectedWith(CallError, /UNKNOWN/);
    });

    it("network error on poll", () => {
      const updateId = "abcd1234";
      const userId = "deadbeef";
      const updater = new UserUpdate(EMPTY);

      mock.onGet().networkError();

      return updater
        .pollUpdateId(updateId)
        .should.be.rejectedWith(CallError, /UNKNOWN/);
    });

    it("empty response on poll", () => {
      const updateId = "abcd1234";
      const updater = new UserUpdate(EMPTY);

      mock.onGet().reply(200);

      return updater
        .pollUpdateId(updateId)
        .should.be.rejectedWith(CallError, /FAILED/);
    });
  });
});
