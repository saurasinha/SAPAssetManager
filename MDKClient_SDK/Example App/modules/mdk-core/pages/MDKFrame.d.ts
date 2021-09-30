import { Frame } from 'tns-core-modules/ui/frame';
import { ExecuteSource } from '../common/ExecuteSource';
export declare class MDKFrame extends Frame {
    private static _rootFrameId;
    static WELCOME_FRAME_ID: string;
    static PASSCODE_FRAME_ID: string;
    static STARTUPPAGE_FRAME_ID: string;
    constructor(id?: string);
    static getRootFrameId(): string;
    static setRootFrameId(id: string): void;
    static getRootFrame(): MDKFrame;
    static createRootFrame(id: string): MDKFrame;
    static getCorrectTopmostFrame(source?: ExecuteSource, alwaysParentIfChildIsTabs?: boolean, frameId?: string, findTopmostOfFrameId?: boolean): any;
}
