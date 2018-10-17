# Msgpack Container Interface

[![Build Status](https://travis-ci.org/kawanet/msg-interface.svg?branch=master)](https://travis-ci.org/kawanet/msg-interface) [![Coverage Status](https://coveralls.io/repos/github/kawanet/msg-interface/badge.svg)](https://coveralls.io/github/kawanet/msg-interface)

### ES6

```js
import {MsgExt, msgToBuffer} from "msg-interface";

class MsgExtDate extends MsgExt {
  static from(date) {
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
const buffer = msgToBuffer(msg); // => <Buffer d7 01 42 76 15 28 a3 60 80 00>
const dt = msg.toDate(); // => 2018-01-02T03:04:05.000Z
```

### ES5

```js
var MsgInterface = require("msg-interface");
var MsgExt = MsgInterface.MsgExt;
var msgToBuffer = MsgInterface.msgToBuffer;

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
var buffer = msgToBuffer(msg); // => <Buffer d7 01 42 76 15 28 a3 60 80 00>
var dt = msg.toDate(); // => 2018-01-02T03:04:05.000Z
```

### GitHub

- [https://github.com/kawanet/msg-interface](https://github.com/kawanet/msg-interface)

### The MIT License (MIT)

Copyright (c) 2017-2018 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
