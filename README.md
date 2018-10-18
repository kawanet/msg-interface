# Msgpack Container Interface

[![Build Status](https://travis-ci.org/kawanet/msg-interface.svg?branch=master)](https://travis-ci.org/kawanet/msg-interface) [![Coverage Status](https://coveralls.io/repos/github/kawanet/msg-interface/badge.svg)](https://coveralls.io/github/kawanet/msg-interface)

### `MsgInterface` interface

- `MsgInterface` is the interface for classes which support [msgpack](https://msgpack.org/) representation.

```typescript
interface MsgInterface {
    msgpackLength: number;
    writeMsgpackTo(buffer: Buffer, offset?: number): number;
}
```

### `msgpackLength` property

- `msgpackLength` is maximum byte length possible for msgpack representation. It must be equal to or greater than the actual length.

### `writeMsgpackTo()` method

- `writeMsgpackTo()` writes msgpack representation to the BYO Buffer and returns the actual byte length written.

### `isMsg()` static method

- `isMsg()` returns true if the specified object implements the valid `MsgInterface`, otherwise false.

```typescript
declare function isMsg(msg: any): boolean;
```

### `msgToBuffer()` static method

- `msgToBuffer()` returns a Buffer which contains msgpack representation.

```typescript
declare function msgToBuffer(msg: MsgInterface): Buffer;
```

### `Msg` abstract class

- `Msg` is the abstract class for msgpack container classes.

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
