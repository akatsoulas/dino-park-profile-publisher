import { promisify } from "util";
import fs from "fs";

import { validateConfig, load, int, url } from "../lib/config";
import { EMPTY } from "./configs";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import mock from "mock-fs";
import tmp from "tmp";
import { doesNotReject } from "assert";

chai.use(chaiAsPromised);
chai.should();

describe("Everything configy", () => {
  describe("config validation", () => {
    it("validate valid config", () => {
      return validateConfig(EMPTY).should.be.deep.equal(EMPTY);
    });

    it("error on empty config", () => {
      return (() => validateConfig({})).should.throw(Error, /missing/);
    });

    it("error on null port", () => {
      return (() => validateConfig({ port: null })).should.throw(
        Error,
        /should/
      );
    });
  });

  describe("config validation", () => {
    afterEach(() => {
      mock.restore();
    });

    it("validate valid config", done => {
      tmp.file((_, path, fd) =>
        promisify(fs.write)(fd, JSON.stringify(EMPTY))
          .then(() => load(path).should.eventually.be.deep.equal(EMPTY))
          .then(() => done())
          .catch(e => done(e))
      );
    });

    it("error on empty config", done => {
      tmp.file((_, path, fd) =>
        promisify(fs.write)(fd, JSON.stringify({}))
          .then(() => load(path).should.be.rejected)
          .then(() => done())
          .catch(e => done(e))
      );
    });
  });

  describe("validation", () => {
    it("int", () => {
      (() => int("foo")).should.throw();
      (() => int(2)).should.not.throw();
    });

    it("url", () => {
      (() => url("http://foo.bar")).should.not.throw();
      (() => url("foo.com")).should.throw();
      (() => url(2)).should.throw();
    });
  });
});
