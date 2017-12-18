"use strict";

exports.Msg = Msg;

/**
 * a msgpack representation container
 */

function Msg() {
  //
}

Msg.isMsg = isMsg;

(function(P) {
  P.byteLength = void 0;
  P.toMsgpack = toMsgpack;
  P.writeMsgpackTo = writeMsgpackTo;
})(Msg.prototype);

function isMsg(msg) {
  return !!(msg && msg.byteLength > 0 && "function" === typeof msg.writeMsgpackTo);
}

function writeMsgpackTo(buffer, offset) {
  if (this.toMsgpack === toMsgpack) {
    throw new Error("writeMsgpackTo() not implemented");
  }

  return this.toMsgpack().copy(buffer, offset);
}

function toMsgpack() {
  if (this.writeMsgpackTo === writeMsgpackTo) {
    throw new Error("toMsgpack() not implemented");
  }

  var length = +this.byteLength;
  if (isNaN(length)) {
    throw new Error("byteLength not given");
  }

  var buffer = alloc(length);
  this.writeMsgpackTo(buffer);
  return buffer;
}

/**
 * @private
 */

function alloc(length) {
  return Buffer.alloc ? Buffer.alloc(length) : new Buffer(length);
}
