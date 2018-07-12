/* global describe it beforeEach afterEach */
import "mocha";
import chai from "chai";
import ChaiAsPromised from "chai-as-promised";
import moxios from "moxios";

import UserUpdate from "../lib/userupdate";

chai.use(ChaiAsPromised);
chai.should();

describe("Handle updates from users", () => {
  describe("cis update response body parser", () => {
    it("parse proper cis body", () => {
      const body = { updateID: "abcd1234" };
      const updateID = UserUpdate.parseCISUpdateID(body);
      updateID.should.equal(body.updateID);
    });
    it("throw exception when something is wrong", () => {
      const body = {};
      const call = () => UserUpdate.parseCISUpdateID(body);
      call.should.throw();
    });
  });
  describe("cis call", () => {
    beforeEach(() => {
      moxios.install();
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("successful publish call", () => {
      const data = { updateID: "abcd1234" };
      const updater = new UserUpdate({ cisURL: "" });

      const res = updater
        .publishToCIS()
        .then(updateID => updateID.should.be.equal(data.updateID));
      moxios.wait(() => {
        const req = moxios.requests.mostRecent();
        req.respondWith({
          status: 200,
          response: data
        });
      }, 0);
      return res;
    });
    it("fail on 404", () => {
      const updater = new UserUpdate({ cisURL: "" });

      const res = updater.publishToCIS().then();
      moxios.wait(() => {
        const req = moxios.requests.mostRecent();
        req.respondWith({
          status: 404,
          response: ""
        });
      }, 0);
      return res.should.be.rejected;
    });
    it("fail on weird response", () => {
      const updater = new UserUpdate({ cisURL: "" });

      const res = updater.publishToCIS().then();
      moxios.wait(() => {
        const req = moxios.requests.mostRecent();
        req.respondWith({
          status: 200,
          response: "weirdo"
        });
      }, 0);
      return res.should.be.rejected;
    });
  });
});
