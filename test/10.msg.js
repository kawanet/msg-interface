"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var __1 = require("../");
var TITLE = __filename.split("/").pop();
var atos = function (array) { return [].map.call(array, function (v) { return (v > 15 ? "" : "0") + v.toString(16); }).join("-"); };
describe(TITLE, function () {
    it("Msg", function () {
        var MsgTest = /** @class */ (function (_super) {
            __extends(MsgTest, _super);
            function MsgTest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return MsgTest;
        }(__1.Msg));
        var msg = new MsgTest();
        assert.strictEqual(typeof __1.isMsg, "function");
        assert.strictEqual(typeof msg.writeMsgpackTo, "function");
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
        var MsgTest = /** @class */ (function (_super) {
            __extends(MsgTest, _super);
            function MsgTest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MsgTest.prototype.writeMsgpackTo = function (buffer, offset) {
                offset = 0 | offset;
                return buffer.writeUInt16BE(0x0708, offset);
            };
            return MsgTest;
        }(__1.Msg));
        var msg = new MsgTest();
        // Error: Invalid msgpackLength
        assert.strictEqual(msg.msgpackLength, void 0);
        assert.throws(function () { return __1.msgToBuffer(msg); });
        // msgToBuffer
        msg.msgpackLength = 2;
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
        var MsgString32 = /** @class */ (function (_super) {
            __extends(MsgString32, _super);
            function MsgString32() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MsgString32.from = function (string) {
                var msg = new MsgString32();
                msg.value = string;
                // maximum byte length
                msg.msgpackLength = 5 + string.length * 3;
                return msg;
            };
            MsgString32.prototype.writeMsgpackTo = function (buffer, offset) {
                offset = 0 | offset;
                buffer[offset] = 0xdb;
                // actual byte length
                var length = buffer.write(this.value, offset + 5);
                buffer.writeUInt32BE(length, offset + 1);
                return 5 + length;
            };
            return MsgString32;
        }(__1.Msg));
        var msg = MsgString32.from("ABC");
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "db-00-00-00-03-41-42-43");
    });
});
