"use strict";

// This is not written in TypeScript but in JavaScript (ES5), to full fill test code coverage.

var assert = require("assert");
var MsgInterface = require("../");

var TITLE = __filename.split("/").pop();

describe(TITLE, function() {

  it("MsgRaw", function() {
    var buffer = Buffer.from([1]);
    var msg = MsgInterface.MsgRaw(buffer);
    assert(MsgInterface.isMsg(msg));
    assert.equal(atos(MsgInterface.msgToBuffer(msg)), "01");
  });

  it("MsgRaw", function() {
    var msg = MsgInterface.MsgRaw([2]);
    assert(MsgInterface.isMsg(msg));
    assert.equal(atos(MsgInterface.msgToBuffer(msg)), "02");
  });

  it("MsgExt", function() {
    var buffer = Buffer.from([3]);
    var msg = MsgInterface.MsgExt(buffer, 4);
    assert(MsgInterface.isMsg(msg));
    assert.equal(atos(MsgInterface.msgToBuffer(msg)), "d4-04-03");
  });

  it("MsgExt", function() {
    var msg = MsgInterface.MsgExt([5], 6);
    assert(MsgInterface.isMsg(msg));
    assert.equal(atos(MsgInterface.msgToBuffer(msg)), "d4-06-05");
  });
});

function atos(array) {
  return [].map.call(array, function(v) {
    return (v > 15 ? "" : "0") + v.toString(16);
  }).join("-");
}
