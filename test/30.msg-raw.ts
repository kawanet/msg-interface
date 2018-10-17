"use strict";

import * as assert from "assert";
import {isMsg, MsgRaw, msgToBuffer} from "../";

const TITLE = __filename.split("/").pop() as string;

describe(TITLE, () => {

    it("MsgRaw(buffer)", () => {
        const buffer = Buffer.from([1, 255]);
        const msg = new MsgRaw(buffer);

        assert(isMsg(msg));
        assert.equal(atos(msgToBuffer(msg)), "01-ff");

        // writeMsgpackTo with offset
        const buf = Buffer.from([9, 10, 11, 12]);
        msg.writeMsgpackTo(buf, 1);
        assert.equal(atos(buf), "09-01-ff-0c");

        // writeMsgpackTo without offset
        msg.writeMsgpackTo(buf);
        assert.equal(atos(buf), "01-ff-ff-0c");
    });

    it("MsgRaw(buffer, start)", () => {
        const buffer = Buffer.from([0, 1, 255]);
        const msg = new MsgRaw(buffer, 1);

        assert(isMsg(msg));
        assert.equal(atos(msgToBuffer(msg)), "01-ff");

        // writeMsgpackTo with offset
        const buf = Buffer.from([9, 10, 11, 12]);
        msg.writeMsgpackTo(buf, 1);
        assert.equal(atos(buf), "09-01-ff-0c");

        // writeMsgpackTo without offset
        msg.writeMsgpackTo(buf);
        assert.equal(atos(buf), "01-ff-ff-0c");
    });

    it("MsgRaw(buffer, start, end)", () => {
        const buffer = Buffer.from([0, 1, 255, 254]);
        const msg = new MsgRaw(buffer, 1, 3);

        assert(isMsg(msg));
        assert.equal(atos(msgToBuffer(msg)), "01-ff");

        // writeMsgpackTo with offset
        const buf = Buffer.from([9, 10, 11, 12]);
        msg.writeMsgpackTo(buf, 1);
        assert.equal(atos(buf), "09-01-ff-0c");

        // writeMsgpackTo without offset
        msg.writeMsgpackTo(buf);
        assert.equal(atos(buf), "01-ff-ff-0c");
    });
});

function atos(array: number[] | Buffer) {
    return [].map.call(array, function (v: number) {
        return (v > 15 ? "" : "0") + v.toString(16);
    }).join("-");
}