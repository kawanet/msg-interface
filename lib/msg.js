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
  P._isMsg = true;
  P.byteLength = void 0;
  P.toMsgpack = toMsgpack;
  P.writeTo = writeTo;
})(Msg.prototype);

function isMsg(msg) {
  return !!(msg && msg._isMsg && "function" === typeof msg.toMsgpack);
}

function writeTo(buffer, offset) {
  if (this.toMsgpack === toMsgpack) {
    throw new Error("writeTo() not implemented");
  }

  return this.toMsgpack().copy(buffer, offset);
}

function toMsgpack() {
  if (this.writeTo === writeTo) {
    throw new Error("toMsgpack() not implemented");
  }

  var length = +this.byteLength;
  if (isNaN(length)) {
    throw new Error("byteLength not given");
  }

  var buffer = alloc(length);
  this.writeTo(buffer);
  return buffer;
}

/**
 * @private
 */

function alloc(length) {
  return Buffer.alloc ? Buffer.alloc(length) : new Buffer(length);
}
