"use strict";

import * as assert from "assert";
import {Msg} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {

    it("Msg", () => {
        class MsgTest extends Msg {
            //
        }

        const msg = new MsgTest();

        assert.equal(typeof Msg.isMsg, "function");
        assert.equal(typeof msg.writeMsgpackTo, "function");
        assert.equal(typeof msg.toMsgpack, "function");

        assert(!Msg.isMsg(null));
        assert(!Msg.isMsg(0));
        assert(!Msg.isMsg(1));
        assert(!Msg.isMsg({}));

        // Error: toMsgpack() not implemented
        assert.throws(() => msg.toMsgpack());

        // Error: writeMsgpackTo() not implemented
        assert.throws(() => msg.writeMsgpackTo(Buffer.alloc(2)));
    });

    it("toMsgpack", () => {
        // writeMsgpackTo feature is provided by Msg class in effect
        class MsgTest extends Msg {
            byteLength = 2;

            toMsgpack() {
                return Buffer.from([1, 2]);
            }
        }

        // toMsgpack
        const msg = new MsgTest();
        assert(Msg.isMsg(msg));
        assert.equal(atos(msg.toMsgpack()), "01-02");

        // writeMsgpackTo with offset
        const buf = Buffer.from([3, 4, 5, 6]);
        assert.equal(msg.writeMsgpackTo(buf, 1), 2);
        assert.equal(atos(buf), "03-01-02-06");

        // writeMsgpackTo without offset
        assert.equal(msg.writeMsgpackTo(buf), 2);
        assert.equal(atos(buf), "01-02-02-06");
    });

    it("writeMsgpackTo", () => {
        class MsgTest extends Msg {
            writeMsgpackTo(buffer: Buffer, offset?: number) {
                return buffer.writeUInt16BE(0x0708, offset);
            }
        }

        const msg = new MsgTest();

        // Error: byteLength not given
        assert.equal(msg.byteLength, null);
        assert.throws(() => msg.toMsgpack());

        // toMsgpack
        msg.byteLength = 2;
        assert(Msg.isMsg(msg));
        assert.equal(atos(msg.toMsgpack()), "07-08");

        // writeMsgpackTo with offset
        const buf = Buffer.from([9, 10, 11, 12]);
        msg.writeMsgpackTo(buf, 1);
        assert.equal(atos(buf), "09-07-08-0c");

        // writeMsgpackTo without offset
        msg.writeMsgpackTo(buf);
        assert.equal(atos(buf), "07-08-08-0c");
    });
});

function atos(array) {
    return [].map.call(array, (v) => {
        return (v > 15 ? "" : "0") + v.toString(16);
    }).join("-");
}