"use strict";

var Msg = require("./msg").Msg;

exports.MsgExt = MsgExt;

var noAssert = true;

/**
 * msgpack ext type container
 */

function MsgExt(type, buffer) {
  if (!(this instanceof MsgExt)) {
    return new MsgExt(type, buffer);
  }

  Msg.call(this);

  // ext type: -128 - +127
  if (!(-129 < type && type < 256)) {
    throw new RangeError("Invalid ext type: " + type);
  }
  this.type = type;

  // payload
  if (buffer) {
    this.buffer = buffer;
    this.byteLength = getByteLength(buffer.length);
  }
}

(function(P) {
  MsgExt.prototype = P;
  P.type = void 0;
  P.buffer = void 0;
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
  var payloadLength = payload.length;

  offset |= 0;

  // token
  buffer[offset++] = getToken(payloadLength);

  // body size
  var addressLength = getAddressLength(payloadLength);
  if (addressLength === 1) {
    buffer.writeUInt8(payloadLength, offset, noAssert);
  } else if (addressLength === 2) {
    buffer.writeUInt16BE(payloadLength, offset, noAssert);
  } else if (addressLength === 4) {
    buffer.writeUInt32BE(payloadLength, offset, noAssert);
  }
  offset += addressLength;

  // ext type
  buffer[offset++] = this.type & 255;

  // body
  payload.copy(buffer, offset, 0, payloadLength, noAssert);

  return offset + payloadLength;
}

/**
 * @private
 */

function getToken(length) {
  return fixedToken[length] || flexToken[getAddressLength(length)];
}

function getByteLength(length) {
  return 2 + getAddressLength(length) + length;
}

function getAddressLength(length) {
  return fixedToken[length] ? 0 : length < 256 ? 1 : length < 65536 ? 2 : 4;
}
