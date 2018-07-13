/* global describe it beforeEach afterEach */
import "mocha";
import chai from "chai";

import CallError from "../lib/error";

chai.should();

describe("CallError", () => {
  it("default constructor", () => {
    const e = new CallError("something");
    e.typ.should.equal(CallError.UNKNOWN);
    e.message.toString().should.equal(`(${CallError.UNKNOWN}) something`);
  });
  it("specific error", () => {
    const e = new CallError("something", CallError.TIMEOUT);
    e.typ.should.equal(CallError.TIMEOUT);
    e.message.toString().should.equal(`(${CallError.TIMEOUT}) something`);
  });
});
