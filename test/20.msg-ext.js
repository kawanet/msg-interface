"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var __1 = require("../");
var TITLE = __filename.split("/").pop();
var atos = function (array) { return [].map.call(array, function (v) { return (v > 15 ? "" : "0") + v.toString(16); }).join("-"); };
describe(TITLE, function () {
    it("empty", function () {
        var msg = new __1.MsgExt(Buffer.from([]), 1);
        assert.strictEqual(typeof __1.msgToBuffer, "function");
        assert(__1.isMsg(msg));
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "c7-00-01");
        assert.strictEqual(msg.writeMsgpackTo(Buffer.alloc(3)), 3);
    });
    it("1 byte", function () {
        var msg = new __1.MsgExt(Buffer.from([3]), 2);
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "d4-02-03");
    });
    it("2 bytes", function () {
        var msg = new __1.MsgExt(Buffer.from([4, 5]), 3);
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "d5-03-04-05");
    });
    it("3 bytes", function () {
        var msg = new __1.MsgExt(Buffer.from([5, 6, 7]), 4);
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "c7-03-04-05-06-07");
    });
    it("4 bytes", function () {
        var msg = new __1.MsgExt(Buffer.from([6, 7, 8, 9]), 5);
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "d6-05-06-07-08-09");
    });
    it("8 bytes", function () {
        var msg = new __1.MsgExt(Buffer.from([7, 8, 9, 10, 11, 12, 13, 14]), 6);
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "d7-06-07-08-09-0a-0b-0c-0d-0e");
    });
    it("16 bytes", function () {
        var msg = new __1.MsgExt(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]), 7);
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "d8-07-00-01-02-03-04-05-06-07-08-09-0a-0b-0c-0d-0e-0f");
    });
    it("255 bytes", function () {
        var buffer = Buffer.alloc(255);
        buffer[0] = 8;
        var packed = __1.msgToBuffer(new __1.MsgExt(buffer, 7));
        assert.strictEqual(packed.length, 3 + 255);
        assert.strictEqual(atos(packed.slice(0, 4)), "c7-ff-07-08");
    });
    it("256 bytes", function () {
        var buffer = Buffer.alloc(256);
        buffer[0] = 10;
        var packed = __1.msgToBuffer(new __1.MsgExt(buffer, 9));
        assert.strictEqual(packed.length, 4 + 256);
        assert.strictEqual(atos(packed.slice(0, 5)), "c8-01-00-09-0a");
    });
    it("65535 bytes", function () {
        var buffer = Buffer.alloc(65535);
        buffer[0] = 12;
        var packed = __1.msgToBuffer(new __1.MsgExt(buffer, 11));
        assert.strictEqual(packed.length, 4 + 65535);
        assert.strictEqual(atos(packed.slice(0, 5)), "c8-ff-ff-0b-0c");
    });
    it("65536 bytes", function () {
        var buffer = Buffer.alloc(65536);
        buffer[0] = 14;
        var packed = __1.msgToBuffer(new __1.MsgExt(buffer, 13));
        assert.strictEqual(packed.length, 6 + 65536);
        assert.strictEqual(atos(packed.slice(0, 7)), "c9-00-01-00-00-0d-0e");
    });
    it("constructor", function () {
        var payload = Buffer.alloc(1);
        // correct
        assert(__1.isMsg(new __1.MsgExt(payload)));
        assert(__1.isMsg(new __1.MsgExt(payload, 1)));
        assert(__1.isMsg(new __1.MsgExt(1, payload)));
        // invalid payload
        // @ts-ignore
        assert.throws(function () { return new __1.MsgExt(null); });
        // invalid payload
        // @ts-ignore
        assert.throws(function () { return new __1.MsgExt(null, 1); });
        // invalid both
        // @ts-ignore
        assert.throws(function () { return new __1.MsgExt(null, 256); });
        // invalid type
        assert.throws(function () { return new __1.MsgExt(payload, 256); });
        // invalid type
        assert.throws(function () { return new __1.MsgExt(256, payload); });
    });
    it("empty array without new", function () {
        // @ts-ignore
        var msg = __1.MsgExt([], 1);
        assert.strictEqual(typeof __1.msgToBuffer, "function");
        assert(__1.isMsg(msg));
        assert.strictEqual(atos(__1.msgToBuffer(msg)), "c7-00-01");
        assert.strictEqual(msg.writeMsgpackTo(Buffer.alloc(3)), 3);
    });
});
