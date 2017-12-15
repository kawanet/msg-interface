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
        assert.equal(typeof _1.Msg.isMsg, "function");
        assert.equal(typeof msg.toMsgpack, "function");
        assert(_1.Msg.isMsg(msg));
        assert(!_1.Msg.isMsg(null));
        assert(!_1.Msg.isMsg(0));
        assert(!_1.Msg.isMsg(1));
        assert(!_1.Msg.isMsg({}));
        // Error: toMsgpack() not implemented
        assert.throws(function () { return msg.toMsgpack(); });
        // Error: writeTo() not implemented
        assert.throws(function () { return msg.writeTo(null); });
    });
    it("toMsgpack", function () {
        var MsgTest = /** @class */ (function (_super) {
            __extends(MsgTest, _super);
            function MsgTest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MsgTest.prototype.toMsgpack = function () {
                return Buffer.from([1, 2]);
            };
            return MsgTest;
        }(_1.Msg));
        // toMsgpack
        var msg = new MsgTest();
        assert(_1.Msg.isMsg(msg));
        assert.equal(atos(msg.toMsgpack()), "01-02");
        // writeTo with offset
        var buf = Buffer.from([3, 4, 5, 6]);
        assert.equal(msg.writeTo(buf, 1), 2);
        assert.equal(atos(buf), "03-01-02-06");
        // writeTo without offset
        assert.equal(msg.writeTo(buf), 2);
        assert.equal(atos(buf), "01-02-02-06");
    });
    it("writeTo", function () {
        var MsgTest = /** @class */ (function (_super) {
            __extends(MsgTest, _super);
            function MsgTest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MsgTest.prototype.writeTo = function (buffer, offset) {
                return buffer.writeUInt16BE(0x0708, offset);
            };
            return MsgTest;
        }(_1.Msg));
        var msg = new MsgTest();
        assert(_1.Msg.isMsg(msg));
        // Error: byteLength not given
        assert.equal(msg.byteLength, null);
        assert.throws(function () { return msg.toMsgpack(); });
        // toMsgpack
        msg.byteLength = 2;
        assert.equal(atos(msg.toMsgpack()), "07-08");
        // writeTo with offset
        var buf = Buffer.from([9, 10, 11, 12]);
        msg.writeTo(buf, 1);
        assert.equal(atos(buf), "09-07-08-0c");
        // writeTo without offset
        msg.writeTo(buf);
        assert.equal(atos(buf), "07-08-08-0c");
    });
});
function atos(array) {
    return [].map.call(array, function (v) {
        return (v > 15 ? "" : "0") + v.toString(16);
    }).join("-");
}
