"use strict";

exports.isMsg = isMsg;
exports.msgToBuffer = gen(Buffer.alloc);
exports.Msg = Msg;

/**
 * a msgpack representation container
 */

function Msg() {
  // do nothing
}

(function(P) {

  P.msgpackLength = void 0;

  P.writeMsgpackTo = writeMsgpackTo;

})(Msg.prototype);

function writeMsgpackTo(buffer, offset) {
  /*jshint unused:false*/
  throw new Error("Method not implemented: writeMsgpackTo");
}

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
