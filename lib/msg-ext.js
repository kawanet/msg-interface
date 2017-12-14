"use strict";

var Msg = require("./msg").Msg;

exports.MsgExt = MsgExt;

var noAssert = true;

/**
 * msgpack ext type container
 */

function MsgExt(type, payload) {
  Msg.call(this);

  // ext type: -128 - +127
  if (!(-129 < type && type < 256)) {
    throw new RangeError("Invalid ext type: " + type);
  }
  this.type = type;

  // payload
  if (payload) {
    this.buffer = payload;
    this.byteLength = getByteLength(payload);
  }
}

(function(P) {
  MsgExt.prototype = P;
  P.type = void 0;
  P.buffer = void 0;
  P.toMsgpack = toMsgpack;
  P.writeTo = writeTo;
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

function writeTo(buffer, offset) {
  var payload = this.buffer;
  var length = payload.length;

  offset |= 0;

  // token
  buffer[offset++] = getToken(length);

  // length for body length
  var addr = getAddressLength(length);
  if (addr === 1) {
    buffer.writeUInt8(length, offset, noAssert);
  } else if (addr === 2) {
    buffer.writeUInt16BE(length, offset, noAssert);
  } else if (addr === 4) {
    buffer.writeUInt32BE(length, offset, noAssert);
  }
  offset += addr;

  // ext type
  buffer[offset++] = this.type & 255;

  // body
  payload.copy(buffer, offset, 0, length, noAssert);

  return offset + length;
}

function toMsgpack() {
  var length = this.byteLength || getByteLength(this.buffer);
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