"use strict";

// This is not written in TypeScript but in JavaScript (ES5), to run test ES5 synopsis code on README.md

var assert = require("assert");
var MsgExt = require("../").MsgExt;

var TITLE = __filename.split("/").pop();

describe(TITLE, function() {

  it("MsgExtDate", function() {
    function MsgExtDate(payload) {
      MsgExt.call(this, payload);
    }

    MsgExtDate.from = function(date) {
      var payload = Buffer.alloc(8);
      payload.writeDoubleBE(+date, 0);
      return new MsgExtDate(payload);
    };

    MsgExtDate.prototype = Object.create(MsgExt.prototype);
    MsgExtDate.prototype.type = 0x0D;
    MsgExtDate.prototype.toDate = function() {
      return new Date(this.buffer.readDoubleBE(0));
    };

    var now = Date.UTC(2018, 0, 2, 3, 4, 5);
    var msg = MsgExtDate.from(now);

    assert.equal(msg.type, 0x0D);
    assert.equal(msg.buffer.length, 8);
    assert.equal(msg.msgpackLength, 10);

    var buffer = msg.toMsgpack(); // => <Buffer d7 01 42 76 15 28 a3 60 80 00>
    assert.equal(atos(buffer), "d7-0d-42-76-0b-4d-37-48-80-00");

    var dt = msg.toDate(); // => 2018-01-02T03:04:05.000Z
    assert.equal(+dt, +now);
  });
});

function atos(array) {
  return [].map.call(array, function(v) {
    return (v > 15 ? "" : "0") + v.toString(16);
  }).join("-");
}