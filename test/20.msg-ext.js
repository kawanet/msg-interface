"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var _1 = require("../");
var TITLE = __filename.split("/").pop();
describe(TITLE, function () {
    it("empty", function () {
        var msg = new _1.MsgExt(1, Buffer.from([]));
        assert.equal(typeof _1.MsgExt.isMsgExt, "function");
        assert.equal(typeof msg.toMsgpack, "function");
        assert(_1.Msg.isMsg(msg));
        assert(_1.MsgExt.isMsgExt(msg));
        assert(!_1.MsgExt.isMsgExt(null));
        assert(!_1.MsgExt.isMsgExt(0));
        assert(!_1.MsgExt.isMsgExt(1));
        assert(!_1.MsgExt.isMsgExt({}));
    });
    it("1 byte", function () {
        var msg = new _1.MsgExt(2, Buffer.from([3]));
        assert.equal(atos(msg.toMsgpack()), "d4-02-03");
    });
    it("2 bytes", function () {
        var msg = new _1.MsgExt(3, Buffer.from([4, 5]));
        assert.equal(atos(msg.toMsgpack()), "d5-03-04-05");
    });
    it("3 bytes", function () {
        var msg = new _1.MsgExt(4, Buffer.from([5, 6, 7]));
        assert.equal(atos(msg.toMsgpack()), "c7-03-04-05-06-07");
    });
    it("4 bytes", function () {
        var msg = new _1.MsgExt(5, Buffer.from([6, 7, 8, 9]));
        assert.equal(atos(msg.toMsgpack()), "d6-05-06-07-08-09");
    });
    it("8 bytes", function () {
        var msg = new _1.MsgExt(6, Buffer.from([7, 8, 9, 10, 11, 12, 13, 14]));
        assert.equal(atos(msg.toMsgpack()), "d7-06-07-08-09-0a-0b-0c-0d-0e");
    });
    it("16 bytes", function () {
        var msg = new _1.MsgExt(7, Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));
        assert.equal(atos(msg.toMsgpack()), "d8-07-00-01-02-03-04-05-06-07-08-09-0a-0b-0c-0d-0e-0f");
    });
    it("255 bytes", function () {
        var buffer = Buffer.alloc(255);
        buffer[0] = 8;
        var packed = new _1.MsgExt(7, buffer).toMsgpack();
        assert.equal(packed.length, 3 + 255);
        assert.equal(atos(packed.slice(0, 4)), "c7-ff-07-08");
    });
    it("256 bytes", function () {
        var buffer = Buffer.alloc(256);
        buffer[0] = 10;
        var packed = new _1.MsgExt(9, buffer).toMsgpack();
        assert.equal(packed.length, 4 + 256);
        assert.equal(atos(packed.slice(0, 5)), "c8-01-00-09-0a");
    });
    it("65535 bytes", function () {
        var buffer = Buffer.alloc(65535);
        buffer[0] = 12;
        var packed = new _1.MsgExt(11, buffer).toMsgpack();
        assert.equal(packed.length, 4 + 65535);
        assert.equal(atos(packed.slice(0, 5)), "c8-ff-ff-0b-0c");
    });
    it("65536 bytes", function () {
        var buffer = Buffer.alloc(65536);
        buffer[0] = 14;
        var packed = new _1.MsgExt(13, buffer).toMsgpack();
        assert.equal(packed.length, 6 + 65536);
        assert.equal(atos(packed.slice(0, 7)), "c9-00-01-00-00-0d-0e");
    });
});
function atos(array) {
    return [].map.call(array, function (v) {
        return (v > 15 ? "" : "0") + v.toString(16);
    }).join("-");
}
