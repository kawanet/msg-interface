"use strict";

import assert = require("assert");

import {isMsg, MsgInterface, msgToBuffer} from "../";

const TITLE = __filename.split("/").pop() as string;

const atos = (array: Buffer | number[]) => [].map.call(array, (v: number) => (v > 15 ? "" : "0") + v.toString(16)).join("-");

describe(TITLE, () => {
    it("Msg", () => {
        class MsgTest implements MsgInterface {
            msgpackLength: number;

            writeMsgpackTo: (buffer: Buffer, offset?: number) => number;
        }

        const msg = new MsgTest();

        assert.strictEqual(typeof isMsg, "function");
        assert.strictEqual(typeof msgToBuffer, "function");

        assert(!isMsg(null));
        assert(!isMsg(0));
        assert(!isMsg(1));
        assert(!isMsg({}));

        // Error: Invalid msgpackLength
        assert.throws(() => msgToBuffer(msg));

        // Error: Method not implemented: writeMsgpackTo
        assert.throws(() => msg.writeMsgpackTo(Buffer.alloc(2)));
    });

    it("writeMsgpackTo", () => {
        class MsgTest implements MsgInterface {
            msgpackLength = 2;

            writeMsgpackTo(buffer: Buffer, offset?: number) {
                offset = 0 | offset as number;
                return buffer.writeUInt16BE(0x0708, offset);
            }
        }

        const msg = new MsgTest();

        assert.strictEqual(typeof msg.msgpackLength, "number");
        assert.strictEqual(typeof msg.writeMsgpackTo, "function");

        // msgToBuffer
        assert(isMsg(msg));
        assert.strictEqual(atos(msgToBuffer(msg)), "07-08");

        // writeMsgpackTo with offset
        const buf = Buffer.from([9, 10, 11, 12]);
        msg.writeMsgpackTo(buf, 1);
        assert.strictEqual(atos(buf), "09-07-08-0c");

        // writeMsgpackTo without offset
        msg.writeMsgpackTo(buf);
        assert.strictEqual(atos(buf), "07-08-08-0c");
    });

    it("MsgString", () => {
        class MsgString32 implements MsgInterface {
            msgpackLength: number;
            value: string;

            static from(string: string) {
                const msg = new MsgString32();
                msg.value = string;
                // maximum byte length
                msg.msgpackLength = 5 + string.length * 3;
                return msg;
            }

            writeMsgpackTo(buffer: Buffer, offset: number) {
                buffer[offset] = 0xdb;
                // actual byte length
                const length = buffer.write(this.value, offset + 5);
                buffer.writeUInt32BE(length, offset + 1);

                return 5 + length;
            }
        }

        const msg = MsgString32.from("ABC");
        assert.strictEqual(atos(msgToBuffer(msg)), "db-00-00-00-03-41-42-43");
    });
});
