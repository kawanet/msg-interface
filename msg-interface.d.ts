/**
 * @see https://github.com/kawanet/msg-interface
 */

export interface MsgInterface {
    /**
     * expected maximum length of msgpack representation in bytes
     */
    msgpackLength: number;

    /**
     * write the msgpack representation to the buffer with an optional offset address
     * @return {number} actual length of written in bytes
     */
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}

/**
 * @return {boolean} true when the argument has the MsgInterface implemented
 */
export declare function isMsg(msg: any): boolean;

/**
 * @return {Buffer} msgpack representation
 */
export declare function msgToBuffer(msg: MsgInterface): Buffer;

export declare abstract class Msg implements MsgInterface {
    /**
     * expected maximum length of msgpack representation in bytes
     */
    msgpackLength: number;

    /**
     * write the msgpack representation to the buffer with an optional offset address
     * @return {number} actual length of msgpack representation written
     */
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
