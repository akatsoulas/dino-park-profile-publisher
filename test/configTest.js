import { promisify } from "util";
import fs from "fs";

import { validateConfig, load } from "../lib/config";
import { EMPTY } from "./configs";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import mock from "mock-fs";
import tmp from "tmp";

chai.use(chaiAsPromised);
chai.should();

describe("everything configy", () => {
  describe("config validation", () => {
    it("validate valid config", () => {
      return validateConfig(EMPTY).should.be.deep.equal(EMPTY);
    });

    it("error on empty config", () => {
      (() => validateConfig({})).should.throw(Error, /missing/);
    });

    it("error on null port", () => {
      (() => validateConfig({ port: null })).should.throw(Error, /missing/);
    });
  });

  describe("config validation", () => {
    afterEach(() => {
      mock.restore();
    });

    function mkConfig(cfg) {
      return async () => (typeof cfg === "string" ? cfg : JSON.stringify(cfg));
    }

    it("validate valid config", done => {
      tmp.file((_, path, fd) =>
        promisify(fs.write)(fd, JSON.stringify(EMPTY))
          .then(() => load(path).should.eventually.be.deep.equal(EMPTY))
          .then(() => done())
      );
    });

    it("error on empty config", done => {
      tmp.file((_, path, fd) =>
        promisify(fs.write)(fd, JSON.stringify({}))
          .then(() => load(path).should.throw)
          .then(() => done())
      );
    });
  });
});
