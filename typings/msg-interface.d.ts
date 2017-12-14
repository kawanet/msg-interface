/**
 * @see https://github.com/kawanet/msg-interface
 */

export interface MsgInterface {
    _isMsg: boolean;

    byteLength?: number;

    toMsgpack?(): Buffer;

    writeTo?(buffer: Buffer, offset?: number): number;
}

export declare abstract class Msg implements MsgInterface {
    static isMsg(msg: any): boolean;

    _isMsg: boolean;

    byteLength?: number;

    toMsgpack?(): Buffer;

    writeTo?(buffer: Buffer, offset?: number): number;
}

export declare class MsgExt extends Msg {
    constructor(type: number, payload: Buffer);

    buffer: Buffer;
    type: number;
}
