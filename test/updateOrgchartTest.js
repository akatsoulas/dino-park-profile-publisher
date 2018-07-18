/* global describe it beforeEach afterEach */
import "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import { EMPTY } from "./configs";
import updateOrgchart from "../lib/updateOrgchart";

chai.use(chaiAsPromised);
chai.should();

const orgchartService = updateOrgchart(EMPTY);

describe("Send user profile update to orgchart", () => {
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

  it("simple post", () => {
    const userId = "deadbeef";
    const profile = { userId, something: "something new" };
    mock.onPost().replyOnce(200, {});

    return orgchartService(profile).should.eventually.deep.equal(profile);
  });

  it("broken profile", () => {
    const userId = "deadbeef";
    const profile = { userId, something: "something new" };
    mock.onPost().replyOnce(200, null);

    return orgchartService(profile).should.be.rejected;
  });

  it("server error", () => {
    const userId = "deadbeef";
    const profile = { userId, something: "something new" };
    mock.onPost().replyOnce(503);

    return orgchartService(profile).should.be.rejected;
  });
});
