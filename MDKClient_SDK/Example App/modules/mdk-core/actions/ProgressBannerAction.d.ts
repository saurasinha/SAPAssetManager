import { BaseAction } from './BaseAction';
import * as frameModule from 'tns-core-modules/ui/frame';
import { IActionResult } from '../context/IClientAPI';
import { ProgressBannerActionDefinition } from '../definitions/actions/ProgressBannerActionDefinition';
export declare class ProgressBannerAction extends BaseAction {
    static activeProgressBannerAction(): ProgressBannerAction;
    private static _activeInstance;
    private anchoredFrame;
    constructor(definition: ProgressBannerActionDefinition);
    execute(): Promise<IActionResult>;
    onCompletion(result: IActionResult): Promise<IActionResult>;
    updateProgressBanner(message: string): void;
    static updateAnchoredFrame(frame: frameModule.Frame): void;
    private _displayProgressBanner;
    private _updateProgressBar;
    onActionLabelPress(): Promise<any>;
    onCompletionActionLabelPress(): Promise<any>;
}
