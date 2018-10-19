"use strict";
// msg-interface
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @return {boolean} true when the argument has the MsgInterface implemented
 */
function isMsg(msg) {
    return !!(msg && msg.msgpackLength >= 0 && msg.writeMsgpackTo);
}
exports.isMsg = isMsg;
/**
 * @return {Buffer} msgpack representation
 */
function msgToBuffer(msg) {
    var expected = +msg.msgpackLength;
    if (isNaN(expected)) {
        throw new Error("Invalid msgpackLength");
    }
    var buffer = Buffer.alloc(expected);
    var actual = +msg.writeMsgpackTo(buffer, 0);
    // trim
    if (expected > actual) {
        buffer = buffer.slice(0, actual);
    }
    return buffer;
}
exports.msgToBuffer = msgToBuffer;
