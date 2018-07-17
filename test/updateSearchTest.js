/* global describe it beforeEach afterEach */
import "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import { EMPTY } from "./configs";
import updateSearch from "../lib/updateSearch";

chai.use(chaiAsPromised);
chai.should();

const searchService = updateSearch(EMPTY);

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

  it("simple post", () => {
    const userId = "deadbeef";
    const profile = { userId, something: "something new" };
    mock.onPost().replyOnce(200, {});

    return searchService(profile).should.eventually.deep.equal(profile);
  });

  it("broken profile", () => {
    const userId = "deadbeef";
    const profile = { userId, something: "something new" };
    mock.onPost().replyOnce(200, null);

    return searchService(profile).should.be.rejected;
  });

  it("server error", () => {
    const userId = "deadbeef";
    const profile = { userId, something: "something new" };
    mock.onPost().replyOnce(503);

    return searchService(profile).should.be.rejected;
  });
});
