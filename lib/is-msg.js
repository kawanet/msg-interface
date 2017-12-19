"use strict";

exports.isMsg = isMsg;

function isMsg(msg) {
  return !!(msg && msg.byteLength > 0 && msg.writeMsgpackTo && msg.toMsgpack);
}
