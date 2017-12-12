/**
 * @see https://github.com/kawanet/msg-interface
 */

export interface MsgInterface {
    _isMsg: boolean;

    toMsgpack(): Buffer;
}

export declare abstract class Msg implements MsgInterface {
    static isMsg(): boolean;

    _isMsg: boolean;

    toMsgpack(): Buffer;
}

export declare class MsgExt extends Msg {
    constructor(type: number, buffer: Buffer);

    type: number;
    buffer: Buffer;
}
