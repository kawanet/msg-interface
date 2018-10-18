"use strict";

exports.isMsg = isMsg;
exports.msgToBuffer = gen(Buffer.alloc);
exports.Msg = require("./lib/msg").Msg;
exports.MsgExt = require("./lib/msg-ext").MsgExt;

/**
 * @return {boolean} true when the argument has the MsgInterface implemented
 */

function isMsg(msg) {
  return !!(msg && msg.msgpackLength >= 0 && msg.writeMsgpackTo);
}

/**
 * @private
 */

function gen(alloc) {
  return msgTo;

  function msgTo(msg) {
    var expected = +msg.msgpackLength;

    if (isNaN(expected)) {
      throw new Error("Invalid msgpackLength");
    }

    var buffer = alloc(expected);
    var actual = +msg.writeMsgpackTo(buffer, 0);

    // trim
    if (expected > actual) {
      buffer = buffer.slice(0, actual);
    }

    return buffer;
  }
}
