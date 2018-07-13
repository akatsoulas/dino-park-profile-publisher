/* global describe it beforeEach afterEach */
import "mocha";
import chai from "chai";
import ChaiAsPromised from "chai-as-promised";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import { EMPTY } from "./configs";
import personApi from "../lib/personApi";

chai.use(ChaiAsPromised);
chai.should();

const getProfileByUserId = personApi(EMPTY);

describe("get user profile from person api", () => {
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

  it("simple get", () => {
    const userId = "deadbeef";
    const profile = { userId };
    mock.onGet().replyOnce(200, profile);

    return getProfileByUserId(userId)
      .should.eventually.have.property("data")
      .deep.equal(profile);
  });
});
