/**
 * @see https://github.com/kawanet/msg-interface
 */

export interface MsgInterface {
    /**
     * maximum length of msgpack representation in bytes
     */
    byteLength: number;

    /**
     * write the msgpack representation to the buffer with an optional offset address
     * @return {number} actual length of written in bytes
     */
    writeMsgpackTo?(buffer: Buffer, offset?: number): number;
}

export interface MsgExtInterface extends MsgInterface {
    /**
     * payload
     */
    buffer: Buffer;

    /**
     * msgpack extension type number: -128 to +127
     */
    type: number;
}

export declare abstract class Msg implements MsgInterface {
    /**
     * @return {boolean} true when the argument has the MsgInterface implemented
     */
    static isMsg(msg: any): boolean;

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

export declare class MsgExt extends Msg implements MsgExtInterface {
    constructor(payload: Buffer, type?: number);

    /**
     * payload
     */
    buffer: Buffer;

    /**
     * msgpack extension type number: -128 to +127
     */
    type: number;
}
