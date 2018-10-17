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
// This is written in TypeScript, to run test ES6 synopsis code on README.md
var assert = require("assert");
var __1 = require("../");
var TITLE = __filename.split("/").pop();
var atos = function (array) { return [].map.call(array, function (v) { return (v > 15 ? "" : "0") + v.toString(16); }).join("-"); };
describe(TITLE, function () {
    it("MsgExtDate", function () {
        var MsgExtDate = /** @class */ (function (_super) {
            __extends(MsgExtDate, _super);
            function MsgExtDate() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MsgExtDate.from = function (date) {
                var payload = Buffer.alloc(8);
                payload.writeDoubleBE(+date, 0);
                return new MsgExtDate(payload);
            };
            MsgExtDate.prototype.toDate = function () {
                return new Date(this.buffer.readDoubleBE(0));
            };
            return MsgExtDate;
        }(__1.MsgExt));
        MsgExtDate.prototype.type = 0x0D;
        var now = Date.UTC(2018, 0, 2, 3, 4, 5);
        var msg = MsgExtDate.from(now);
        assert.strictEqual(msg.type, 0x0D);
        assert.strictEqual(msg.buffer.length, 8);
        assert.strictEqual(msg.msgpackLength, 10);
        var buffer = __1.msgToBuffer(msg); // => <Buffer d7 01 42 76 15 28 a3 60 80 00>
        assert.strictEqual(atos(buffer), "d7-0d-42-76-0b-4d-37-48-80-00");
        var dt = msg.toDate(); // => 2018-01-02T03:04:05.000Z
        assert.strictEqual(+dt, +now);
    });
});
