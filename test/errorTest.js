/* global describe it beforeEach afterEach */
import "mocha";
import chai from "chai";

import CallError from "../lib/error";

chai.should();

describe("CallError", () => {
  it("default constructor", () => {
    const e = new CallError("something");
    e.typ.should.equal(CallError.ERR_UNKNOWN);
    e.message.toString().should.equal("something");
  });
  it("specific error", () => {
    const e = new CallError("something", CallError.ERR_TIMEOUT);
    e.typ.should.equal(CallError.ERR_TIMEOUT);
    e.message.toString().should.equal("something");
  });
});
