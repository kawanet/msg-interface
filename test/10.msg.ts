"use strict";

import * as assert from "assert";
import {Msg, isMsg} from "../";

const TITLE = __filename.split("/").pop() as string;

describe(TITLE, () => {

    it("Msg", () => {
        class MsgTest extends Msg {
            //
        }

        const msg = new MsgTest();

        assert.equal(typeof isMsg, "function");
        assert.equal(typeof msg.writeMsgpackTo, "function");
        assert.equal(typeof msg.toMsgpack, "function");

        assert(!isMsg(null));
        assert(!isMsg(0));
        assert(!isMsg(1));
        assert(!isMsg({}));

        // Error: Invalid msgpackLength
        assert.throws(() => msg.toMsgpack());

        // Error: Method not implemented: writeMsgpackTo
        assert.throws(() => msg.writeMsgpackTo(Buffer.alloc(2)));
    });

    it("toMsgpack", () => {
        // writeMsgpackTo feature is provided by Msg class in effect
        class MsgTest extends Msg {
            msgpackLength = 2;

            toMsgpack() {
                return Buffer.from([1, 2]);
            }
        }

        // toMsgpack
        const msg = new MsgTest();
        assert(isMsg(msg));
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
                offset = 0 | offset as number;
                return buffer.writeUInt16BE(0x0708, offset);
            }
        }

        const msg = new MsgTest();

        // Error: Invalid msgpackLength
        assert.equal(msg.msgpackLength, null);
        assert.throws(() => msg.toMsgpack());

        // toMsgpack
        msg.msgpackLength = 2;
        assert(isMsg(msg));
        assert.equal(atos(msg.toMsgpack()), "07-08");

        // writeMsgpackTo with offset
        const buf = Buffer.from([9, 10, 11, 12]);
        msg.writeMsgpackTo(buf, 1);
        assert.equal(atos(buf), "09-07-08-0c");

        // writeMsgpackTo without offset
        msg.writeMsgpackTo(buf);
        assert.equal(atos(buf), "07-08-08-0c");
    });

    it("MsgString", () => {
        class MsgString32 extends Msg {
            static from(string: string) {
                const msg = new MsgString32();
                msg.value = string;
                // maximum byte length
                msg.msgpackLength = 5 + string.length * 3;
                return msg;
            }

            writeMsgpackTo(buffer: Buffer, offset?: number) {
                offset = 0 | offset as number;
                buffer[offset] = 0xdb;
                // actual byte length
                const length = buffer.write(this.value, offset + 5);
                buffer.writeUInt32BE(length, offset + 1);
                return 5 + length;
            }

            value: string;
        }

        const msg = MsgString32.from("ABC");
        assert.equal(atos(msg.toMsgpack()), "db-00-00-00-03-41-42-43");
    });
});

function atos(array: number[] | Buffer) {
    return [].map.call(array, function (v: number) {
        return (v > 15 ? "" : "0") + v.toString(16);
    }).join("-");
}