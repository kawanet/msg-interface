"use strict";

exports.Msg = Msg;

/**
 * a msgpack representation container
 */

function Msg() {
  //
}

(function(P) {
  P.byteLength = void 0;
  P.writeMsgpackTo = writeMsgpackTo;
  P.toMsgpack = toMsgpack;
})(Msg.prototype);

function writeMsgpackTo(buffer, offset) {
  if (this.toMsgpack === toMsgpack) {
    throw new Error("Method not implemented: writeMsgpackTo");
  }

  return this.toMsgpack().copy(buffer, offset);
}

function toMsgpack() {
  if (this.writeMsgpackTo === writeMsgpackTo) {
    throw new Error("Method not implemented: writeMsgpackTo");
  }

  var expected = +this.byteLength;

  if (isNaN(expected)) {
    throw new Error("Invalid byteLength");
  }

  var buffer = alloc(expected);
  var actual = +this.writeMsgpackTo(buffer, 0);

  // trim
  if (expected > actual) {
    buffer = buffer.slice(0, actual);
  }

  return buffer;
}

/**
 * @private
 */

function alloc(length) {
  return Buffer.alloc ? Buffer.alloc(length) : new Buffer(length);
}
