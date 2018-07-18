/* global describe it beforeEach afterEach */
import "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import { EMPTY } from "./configs";
import personApi from "../lib/personApi";

chai.use(chaiAsPromised);
chai.should();

const getProfileByUserId = personApi(EMPTY);

describe("Get user profile from person api", () => {
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

    return getProfileByUserId(userId).should.eventually.deep.equal(profile);
  });

  it("broken profile", () => {
    const userId = "deadbeef";
    mock.onGet().replyOnce(200, null);

    return getProfileByUserId(userId).should.be.rejected;
  });
});
