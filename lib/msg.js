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
  P.toMsgpack = toMsgpack;
})(Msg.prototype);

/**
 * @return {boolean}
 */

function isMsg(msg) {
  return !!(msg && msg._isMsg && "function" === typeof msg.toMsgpack);
}

/**
 * @return {Buffer}
 */

function toMsgpack() {
  throw new Error("method not implemented: toMsgpack");
}
