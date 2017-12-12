"use strict";

import * as assert from "assert";
import {Msg} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {

    it("Msg", () => {
        const msg = new Msg();

        assert.equal(typeof Msg.isMsg, "function");
        assert.equal(typeof msg.toMsgpack, "function");

        assert(Msg.isMsg(msg));
        assert(!Msg.isMsg(null));
        assert(!Msg.isMsg(0));
        assert(!Msg.isMsg(1));
        assert(!Msg.isMsg({}));

        assert.throws(()=>{
           msg.toMsgpack();
        });
    });
});