"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var __1 = require("../");
var TITLE = __filename.split("/").pop();
var atos = function (array) { return [].map.call(array, function (v) { return (v > 15 ? "" : "0") + v.toString(16); }).join("-"); };
describe(TITLE, function () {
    it("Msg", function () {
        var MsgTest = /** @class */ (function () {
            function MsgTest() {
            }
            return MsgTest;
        }());
        var msg = new MsgTest();
        assert.strictEqual(typeof __1.isMsg, "function");
        assert.strictEqual(typeof __1.msgToBuffer, "function");
        assert(!__1.isMsg(null));
        assert(!__1.isMsg(0));
        assert(!__1.isMsg(1));
        assert(!__1.isMsg({}));
        // Error: Invalid msgpackLength
        assert.throws(function () { return __1.msgToBuffer(msg); });
        // Error: Method not implemented: writeMsgpackTo
        assert.throws(function () { return msg.writeMsgpackTo(Buffer.alloc(2)); });
    });
    it("writeMsgpackTo", function () {
        var MsgTest = /** @class */ (function () {
            function MsgTest() {
                this.msgpackLength = 2;
            }
            MsgTest.prototype.writeMsgpackTo = function (buffer, offset) {
                offset = 0 | offset;
                return buffer.writeUInt16BE(0x0708, offset);
            };
            return MsgTest;
        }());
        var msg = new MsgTest();
        assert.strictEqual(typeof msg.msgpackLength, "number");
        assert.strictEqual(typeof msg.writeMsgpackTo, "function");
        // msgToBuffer
        assert(__1.isMsg(msg));
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "07-08");
        // writeMsgpackTo with offset
        var buf = Buffer.from([9, 10, 11, 12]);
        msg.writeMsgpackTo(buf, 1);
        assert.strictEqual(atos(buf), "09-07-08-0c");
        // writeMsgpackTo without offset
        msg.writeMsgpackTo(buf);
        assert.strictEqual(atos(buf), "07-08-08-0c");
    });
    it("MsgString", function () {
        var MsgString32 = /** @class */ (function () {
            function MsgString32() {
            }
            MsgString32.from = function (string) {
                var msg = new MsgString32();
                msg.value = string;
                // maximum byte length
                msg.msgpackLength = 5 + string.length * 3;
                return msg;
            };
            MsgString32.prototype.writeMsgpackTo = function (buffer, offset) {
                buffer[offset] = 0xdb;
                // actual byte length
                var length = buffer.write(this.value, offset + 5);
                buffer.writeUInt32BE(length, offset + 1);
                return 5 + length;
            };
            return MsgString32;
        }());
        var msg = MsgString32.from("ABC");
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "db-00-00-00-03-41-42-43");
    });
});
