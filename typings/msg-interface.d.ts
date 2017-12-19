/**
 * @see https://github.com/kawanet/msg-interface
 */

export interface MsgInterface {
    /**
     * expected maximum length of msgpack representation in bytes
     */
    byteLength: number;

    /**
     * @return {Buffer} msgpack representation
     */
    toMsgpack(): Buffer;

    /**
     * write the msgpack representation to the buffer with an optional offset address
     * @return {number} actual length of written in bytes
     */
    writeMsgpackTo(buffer: Buffer, offset?: number): number;
}

/**
 * @return {boolean} true when the argument has the MsgInterface implemented
 */
export declare function isMsg(msg: any): boolean;

export declare abstract class Msg implements MsgInterface {
    /**
     * expected maximum length of msgpack representation in bytes
     */
    byteLength: number;

    /**
     * @return {Buffer} msgpack representation
     */
    toMsgpack(): Buffer;

    /**
     * write the msgpack representation to the buffer with an optional offset address
     * @return {number} actual length of msgpack representation written
     */
    writeMsgpackTo(buffer: Buffer, offset?: number): number;
}

export declare class MsgRaw extends Msg {
    constructor(buffer: Buffer, start?: number, end?: number);

    /**
     * raw msgpack representation
     */
    buffer: Buffer;

    /**
     * offset position
     */
    offset: number;
}

export declare class MsgExt extends Msg {
    constructor(payload: Buffer, type?: number);
    constructor(type: number, payload: Buffer);

    /**
     * payload
     */
    buffer: Buffer;

    /**
     * msgpack extension type number: -128 to +127
     */
    type: number;
}
