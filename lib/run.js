/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

var spawn = require("child_process").spawn;
var defer = require("when").defer;
var extend = require("lodash").extend;
var normalizeBinary = require("./utils").normalizeBinary;

/**
 * Takes a manifest object (from package.json) and options,
 * and runs Firefox.
 *
 * @param {Object} options
 *   - `binary` path to Firefox binary to use
 *   - `profile` path to profile or profile name to use
 * @return ChildProcess
 */
function runFirefox (options) {
  options = options || {};
  var code = 0;
  var profilePath = options.profile;
  var env = extend({}, process.env, options.env || {});
  var args = [];
  if (profilePath) {
    if (isProfileName(profilePath)) {
      args.unshift("-P", profilePath );
    }
    else {
      args.unshift("-profile", profilePath );
    }
  }
  if (options["new-instance"]) {
    args.unshift( "-new-instance" );
  }
  if (options["no-remote"]) {
    args.unshift( "-no-remote" );
  }
  if (options["foreground"]) {
    args.unshift( "-foreground" );
  }

  return normalizeBinary(options.binary).then(function(binary) {
    if (options.verbose)  {
      console.log("Executing Firefox binary: " + binary);
      console.log("Executing Firefox with args: " + args);
    }

    // Using `spawn` so we can stream logging as they come in, rather than buffer them up
    // until the end, which can easily hit the max buffer size.
    var firefox = spawn(binary, args, { env: env });

    firefox.on("close", function () {
      process.removeListener("exit", killFirefox);
    });

    function killFirefox () {
      firefox.kill();
    }

    // Kill child process when main process is killed
    process.once("exit", killFirefox);

    return firefox;
  });
}
module.exports = runFirefox;

// profiles that do not include "/" are treated
// as profile names to be used by the firefox profile manager
function isProfileName (profile) {
  if (!profile) {
    return false;
  }
  return !/[\\\/]/.test(profile);
}
