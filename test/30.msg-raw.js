"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var __1 = require("../");
var TITLE = __filename.split("/").pop();
var atos = function (array) { return [].map.call(array, function (v) { return (v > 15 ? "" : "0") + v.toString(16); }).join("-"); };
describe(TITLE, function () {
    it("MsgRaw(buffer)", function () {
        var buffer = Buffer.from([1, 255]);
        var msg = new __1.MsgRaw(buffer);
        assert(__1.isMsg(msg));
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "01-ff");
        // writeMsgpackTo with offset
        var buf = Buffer.from([9, 10, 11, 12]);
        msg.writeMsgpackTo(buf, 1);
        assert.strictEqual(atos(buf), "09-01-ff-0c");
        // writeMsgpackTo without offset
        msg.writeMsgpackTo(buf);
        assert.strictEqual(atos(buf), "01-ff-ff-0c");
    });
    it("MsgRaw(buffer, start)", function () {
        var buffer = Buffer.from([0, 1, 255]);
        var msg = new __1.MsgRaw(buffer, 1);
        assert(__1.isMsg(msg));
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "01-ff");
        // writeMsgpackTo with offset
        var buf = Buffer.from([9, 10, 11, 12]);
        msg.writeMsgpackTo(buf, 1);
        assert.strictEqual(atos(buf), "09-01-ff-0c");
        // writeMsgpackTo without offset
        msg.writeMsgpackTo(buf);
        assert.strictEqual(atos(buf), "01-ff-ff-0c");
    });
    it("MsgRaw(buffer, start, end)", function () {
        var buffer = Buffer.from([0, 1, 255, 254]);
        var msg = new __1.MsgRaw(buffer, 1, 3);
        assert(__1.isMsg(msg));
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "01-ff");
        // writeMsgpackTo with offset
        var buf = Buffer.from([9, 10, 11, 12]);
        msg.writeMsgpackTo(buf, 1);
        assert.strictEqual(atos(buf), "09-01-ff-0c");
        // writeMsgpackTo without offset
        msg.writeMsgpackTo(buf);
        assert.strictEqual(atos(buf), "01-ff-ff-0c");
    });
});
