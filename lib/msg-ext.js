"use strict";

var Msg = require("./msg").Msg;

exports.MsgExt = MsgExt;

var noAssert = true;

/**
 * msgpack ext type container
 */

function MsgExt(type, buffer) {
  if (!(this instanceof MsgExt)) return new MsgExt(type, buffer);
  if (!(-129 < type && type < 256)) throw new RangeError("Invalid ext type: " + type);
  Msg.call(this);
  this.type = type;
  this.buffer = buffer;
}

MsgExt.isMsgExt = isMsgExt;

/**
 * @return {boolean}
 */

function isMsgExt(msg) {
  return !!(msg && msg._isMsgExt && "function" === typeof msg.toMsgpack);
}

(function(P) {
  MsgExt.prototype = P;
  P.type = void 0;
  P.buffer = void 0;
  P._isMsgExt = true;
  P.toMsgpack = toMsgpack;
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

/**
 * @return {Buffer}
 */

function toMsgpack() {
  var body = this.buffer;
  var length = body.length;
  var addr = fixedToken[length] ? 0 : length < 256 ? 1 : length < 65536 ? 2 : 4;
  var buffer = Buffer.alloc(2 + addr + length);

  // token
  buffer[0] = fixedToken[length] || flexToken[addr];

  // body size
  if (addr === 1) {
    buffer.writeUInt8(length, 1, noAssert);
  } else if (addr === 2) {
    buffer.writeUInt16BE(length, 1, noAssert);
  } else if (addr === 4) {
    buffer.writeUInt32BE(length, 1, noAssert);
  }

  // ext type
  buffer[1 + addr] = this.type;

  // body
  body.copy(buffer, 2 + addr, 0, length, noAssert);

  return buffer;
}
