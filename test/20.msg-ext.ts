"use strict";

import * as assert from "assert";
import {Msg, MsgExt} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {

    it("empty", () => {
        const msg = new MsgExt(Buffer.from([]), 1);

        assert.equal(typeof msg.toMsgpack, "function");

        assert(Msg.isMsg(msg));

        assert.equal(atos(msg.toMsgpack()), "c7-00-01");

        assert.equal(msg.writeMsgpackTo(Buffer.alloc(3)), 3);
    });

    it("1 byte", () => {
        const msg = new MsgExt(Buffer.from([3]), 2);
        assert.equal(atos(msg.toMsgpack()), "d4-02-03");
    });

    it("2 bytes", () => {
        const msg = new MsgExt(Buffer.from([4, 5]), 3);
        assert.equal(atos(msg.toMsgpack()), "d5-03-04-05");
    });

    it("3 bytes", () => {
        const msg = new MsgExt(Buffer.from([5, 6, 7]), 4);
        assert.equal(atos(msg.toMsgpack()), "c7-03-04-05-06-07");
    });

    it("4 bytes", () => {
        const msg = new MsgExt(Buffer.from([6, 7, 8, 9]), 5);
        assert.equal(atos(msg.toMsgpack()), "d6-05-06-07-08-09");
    });

    it("8 bytes", () => {
        const msg = new MsgExt(Buffer.from([7, 8, 9, 10, 11, 12, 13, 14]), 6);
        assert.equal(atos(msg.toMsgpack()), "d7-06-07-08-09-0a-0b-0c-0d-0e");
    });

    it("16 bytes", () => {
        const msg = new MsgExt(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]), 7);
        assert.equal(atos(msg.toMsgpack()), "d8-07-00-01-02-03-04-05-06-07-08-09-0a-0b-0c-0d-0e-0f");
    });

    it("255 bytes", () => {
        const buffer = Buffer.alloc(255);
        buffer[0] = 8;
        const packed = new MsgExt(buffer, 7).toMsgpack();
        assert.equal(packed.length, 3 + 255);
        assert.equal(atos(packed.slice(0, 4)), "c7-ff-07-08");
    });

    it("256 bytes", () => {
        const buffer = Buffer.alloc(256);
        buffer[0] = 10;
        const packed = new MsgExt(buffer, 9).toMsgpack();
        assert.equal(packed.length, 4 + 256);
        assert.equal(atos(packed.slice(0, 5)), "c8-01-00-09-0a");
    });

    it("65535 bytes", () => {
        const buffer = Buffer.alloc(65535);
        buffer[0] = 12;
        const packed = new MsgExt(buffer, 11).toMsgpack();
        assert.equal(packed.length, 4 + 65535);
        assert.equal(atos(packed.slice(0, 5)), "c8-ff-ff-0b-0c");
    });

    it("65536 bytes", () => {
        const buffer = Buffer.alloc(65536);
        buffer[0] = 14;
        const packed = new MsgExt(buffer, 13).toMsgpack();
        assert.equal(packed.length, 6 + 65536);
        assert.equal(atos(packed.slice(0, 7)), "c9-00-01-00-00-0d-0e");
    });

    it("constructor", () => {
        const payload = Buffer.alloc(1);

        // correct
        assert(Msg.isMsg(new MsgExt(payload)));
        assert(Msg.isMsg(new MsgExt(payload, 1)));
        assert(Msg.isMsg(new MsgExt(1, payload)));

        // invalid payload
        assert.throws(() => new MsgExt(null));

        // invalid payload
        assert.throws(() => new MsgExt(null, 1));

        // invalid both
        assert.throws(() => new MsgExt(null, 256));

        // invalid type
        assert.throws(() => new MsgExt(payload, 256));

        // invalid type
        assert.throws(() => new MsgExt(256, payload));
    });
});

function atos(array) {
    return [].map.call(array, (v) => {
        return (v > 15 ? "" : "0") + v.toString(16);
    }).join("-");
}