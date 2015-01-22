/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

var when = require("when");
var fs = require("fs-promise");
var path = require("path");
var utils = require("../utils");
var chai = require("chai");
var expect = chai.expect;
var exec = utils.exec;
var isWindows = /^win/.test(process.platform);
var normalizeBinary = require("../../lib/utils").normalizeBinary;
var cp = require("child_process");

var fakeBinary = path.join(__dirname, "..", "utils", "dummybinary" +
  (isWindows ? ".bat" : ".sh"));

describe("fx-runner start", function () {
  describe("-b/--binary <BINARY>", function () {
    it("Uses specified binary instead of default Firefox", function (done) {
      var proc = exec("start -v -b " + fakeBinary + " -p erik", {}, function (err, stdout, stderr) {
        expect(err).to.not.be.ok;
        expect(stderr).to.not.be.ok;
        expect(stdout).to.contain("-P erik");
        done();
      });
    });
  });
});
