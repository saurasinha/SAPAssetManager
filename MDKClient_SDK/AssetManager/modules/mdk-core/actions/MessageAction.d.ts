import { BaseAction } from './BaseAction';
import { IActionResult } from '../context/IClientAPI';
export declare class MessageAction extends BaseAction {
    private _dialogButtonStyle;
    constructor(definition: any);
    execute(): Promise<IActionResult>;
}
