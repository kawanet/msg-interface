"use strict";

// This is written in TypeScript, to run test ES6 synopsis code on README.md

import * as assert from "assert";
import {MsgExt, msgToBuffer} from "../";

const TITLE = __filename.split("/").pop() as string;

const atos = (array: any) => [].map.call(array, (v: number) => (v > 15 ? "" : "0") + v.toString(16)).join("-");

describe(TITLE, function () {

    it("MsgExtDate", function () {

        class MsgExtDate extends MsgExt {
            static from(date: number) {
                const payload = Buffer.alloc(8);
                payload.writeDoubleBE(+date, 0);
                return new MsgExtDate(payload);
            }

            toDate() {
                return new Date(this.buffer.readDoubleBE(0));
            }
        }

        MsgExtDate.prototype.type = 0x0D;

        const now = Date.UTC(2018, 0, 2, 3, 4, 5);
        const msg = MsgExtDate.from(now);

        assert.equal(msg.type, 0x0D);
        assert.equal(msg.buffer.length, 8);
        assert.equal(msg.msgpackLength, 10);

        const buffer = msgToBuffer(msg); // => <Buffer d7 01 42 76 15 28 a3 60 80 00>
        assert.equal(atos(buffer), "d7-0d-42-76-0b-4d-37-48-80-00");

        const dt = msg.toDate(); // => 2018-01-02T03:04:05.000Z
        assert.equal(+dt, +now);
    });
});
