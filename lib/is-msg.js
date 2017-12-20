"use strict";

exports.isMsg = isMsg;

function isMsg(msg) {
  return !!(msg && msg.msgpackLength >= 0 && msg.writeMsgpackTo && msg.toMsgpack);
}
