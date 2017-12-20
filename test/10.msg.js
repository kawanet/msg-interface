"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var _1 = require("../");
var TITLE = __filename.split("/").pop();
describe(TITLE, function () {
    it("Msg", function () {
        var MsgTest = /** @class */ (function (_super) {
            __extends(MsgTest, _super);
            function MsgTest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return MsgTest;
        }(_1.Msg));
        var msg = new MsgTest();
        assert.equal(typeof _1.isMsg, "function");
        assert.equal(typeof msg.writeMsgpackTo, "function");
        assert.equal(typeof msg.toMsgpack, "function");
        assert(!_1.isMsg(null));
        assert(!_1.isMsg(0));
        assert(!_1.isMsg(1));
        assert(!_1.isMsg({}));
        // Error: Invalid msgpackLength
        assert.throws(function () { return msg.toMsgpack(); });
        // Error: Method not implemented: writeMsgpackTo
        assert.throws(function () { return msg.writeMsgpackTo(Buffer.alloc(2)); });
    });
    it("toMsgpack", function () {
        // writeMsgpackTo feature is provided by Msg class in effect
        var MsgTest = /** @class */ (function (_super) {
            __extends(MsgTest, _super);
            function MsgTest() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.msgpackLength = 2;
                return _this;
            }
            MsgTest.prototype.toMsgpack = function () {
                return Buffer.from([1, 2]);
            };
            return MsgTest;
        }(_1.Msg));
        // toMsgpack
        var msg = new MsgTest();
        assert(_1.isMsg(msg));
        assert.equal(atos(msg.toMsgpack()), "01-02");
        // writeMsgpackTo with offset
        var buf = Buffer.from([3, 4, 5, 6]);
        assert.equal(msg.writeMsgpackTo(buf, 1), 2);
        assert.equal(atos(buf), "03-01-02-06");
        // writeMsgpackTo without offset
        assert.equal(msg.writeMsgpackTo(buf), 2);
        assert.equal(atos(buf), "01-02-02-06");
    });
    it("writeMsgpackTo", function () {
        var MsgTest = /** @class */ (function (_super) {
            __extends(MsgTest, _super);
            function MsgTest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MsgTest.prototype.writeMsgpackTo = function (buffer, offset) {
                return buffer.writeUInt16BE(0x0708, offset);
            };
            return MsgTest;
        }(_1.Msg));
        var msg = new MsgTest();
        // Error: Invalid msgpackLength
        assert.equal(msg.msgpackLength, null);
        assert.throws(function () { return msg.toMsgpack(); });
        // toMsgpack
        msg.msgpackLength = 2;
        assert(_1.isMsg(msg));
        assert.equal(atos(msg.toMsgpack()), "07-08");
        // writeMsgpackTo with offset
        var buf = Buffer.from([9, 10, 11, 12]);
        msg.writeMsgpackTo(buf, 1);
        assert.equal(atos(buf), "09-07-08-0c");
        // writeMsgpackTo without offset
        msg.writeMsgpackTo(buf);
        assert.equal(atos(buf), "07-08-08-0c");
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
                buffer[offset] = 0xdb;
                // actual byte length
                var length = buffer.write(this.value, offset + 5);
                buffer.writeUInt32BE(length, offset + 1);
                return 5 + length;
            };
            return MsgString32;
        }(_1.Msg));
        var msg = MsgString32.from("ABC");
        assert.equal(atos(msg.toMsgpack()), "db-00-00-00-03-41-42-43");
    });
});
function atos(array) {
    return [].map.call(array, function (v) {
        return (v > 15 ? "" : "0") + v.toString(16);
    }).join("-");
}
