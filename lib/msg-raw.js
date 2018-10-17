"use strict";

var Msg = require("./msg").Msg;

exports.MsgRaw = MsgRaw;

/**
 * raw msgpack representation container
 */

function MsgRaw(buffer, start, end) {
  if (!(this instanceof MsgRaw)) {
    return new MsgRaw(buffer, start, end);
  }

  Msg.call(this);

  // payload
  if (buffer && !Buffer.isBuffer(buffer)) {
    buffer = Buffer.from(buffer);
  }

  this.buffer = buffer;

  // offset
  this.offset = start = +start || 0;

  if (isNaN(end)) end = buffer.length;

  this.msgpackLength = end - start;
}

(function(P) {
  MsgRaw.prototype = P;
  P.buffer = void 0;
  P.offset = void 0;
  P.writeMsgpackTo = writeMsgpackTo;
})(Object.create(Msg.prototype));

function writeMsgpackTo(buffer, offset) {
  var payload = this.buffer;
  var start = this.offset;
  var end = start + this.msgpackLength;
  return payload.copy(buffer, offset, start, end);
}
