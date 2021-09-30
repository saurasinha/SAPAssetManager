import { BaseAction } from './BaseAction';
import { IActionResult } from '../context/IClientAPI';
export declare class VerifyPasscodeAction extends BaseAction {
    static resolvePromise: any;
    static rejectPromise: any;
    static postExecute(execStatus: string, errMsg?: string): void;
    constructor(definition: any);
    execute(): Promise<IActionResult>;
}
