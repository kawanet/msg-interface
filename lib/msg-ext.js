"use strict";

var Msg = require("./msg").Msg;

exports.MsgExt = MsgExt;

/**
 * msgpack ext type container
 */

function MsgExt(payload, type) {
  if (!(this instanceof MsgExt)) {
    return new MsgExt(payload, type);
  }

  Msg.call(this);

  if (!isNaN(payload) && Buffer.isBuffer(type)) {
    return MsgExt.call(this, type, +payload);
  }

  // ext type: -128 - +127
  if (type < -128 || 255 < type) {
    throw new RangeError("Invalid ext type: " + type);
  }

  if (-129 < type && type < 256) {
    this.type = type;
  }

  // payload
  if (payload && !Buffer.isBuffer(payload)) {
    payload = Buffer.from(payload);
  }

  if (!payload) {
    throw new TypeError("Invalid ext payload");
  }

  this.buffer = payload;
  this.msgpackLength = getByteLength(payload);
}

(function(P) {
  MsgExt.prototype = P;
  P.type = void 0;
  P.buffer = void 0;
  P.writeMsgpackTo = writeMsgpackTo;
})(Object.create(Msg.prototype));

var fixedToken = [];
fixedToken[1] = 0xd4;
fixedToken[2] = 0xd5;
fixedToken[4] = 0xd6;
fixedToken[8] = 0xd7;
fixedToken[16] = 0xd8;

var flexToken = [];
flexToken[1] = 0xc7;
flexToken[2] = 0xc8;
flexToken[4] = 0xc9;

function writeMsgpackTo(buffer, offset) {
  var payload = this.buffer;
  var length = payload.length;

  offset |= 0;

  // token
  buffer[offset++] = getToken(length);

  // length for body length
  var addr = getAddressLength(length);
  if (addr === 1) {
    buffer.writeUInt8(length, offset);
  } else if (addr === 2) {
    buffer.writeUInt16BE(length, offset);
  } else if (addr === 4) {
    buffer.writeUInt32BE(length, offset);
  }
  offset += addr;

  // ext type
  buffer[offset++] = this.type & 255;

  // body
  payload.copy(buffer, offset, 0, length);

  return offset + length;
}

/**
 * @private
 */

function getToken(length) {
  return fixedToken[length] || flexToken[getAddressLength(length)];
}

function getByteLength(payload) {
  var length = payload && payload.length || 0;
  return 2 + getAddressLength(length) + length;
}

function getAddressLength(length) {
  return fixedToken[length] ? 0 : length > 65535 ? 4 : length > 255 ? 2 : 1;
}
