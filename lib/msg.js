"use strict";

exports.Msg = Msg;

/**
 * a msgpack representation container
 */

function Msg() {
  // do nothing
}

(function(P) {

  P.msgpackLength = void 0;

  P.writeMsgpackTo = writeMsgpackTo;

})(Msg.prototype);

function writeMsgpackTo(buffer, offset) {
  /*jshint unused:false*/
  throw new Error("Method not implemented: writeMsgpackTo");
}
