"use strict";
exports.__esModule = true;
var assert = require("assert");
var _1 = require("../");
var TITLE = __filename.split("/").pop();
describe(TITLE, function () {
    it("Msg", function () {
        var msg = new _1.Msg();
        assert.equal(typeof _1.Msg.isMsg, "function");
        assert.equal(typeof msg.toMsgpack, "function");
        assert(_1.Msg.isMsg(msg));
        assert(!_1.Msg.isMsg(null));
        assert(!_1.Msg.isMsg(0));
        assert(!_1.Msg.isMsg(1));
        assert(!_1.Msg.isMsg({}));
        assert.throws(function () {
            msg.toMsgpack();
        });
    });
});
