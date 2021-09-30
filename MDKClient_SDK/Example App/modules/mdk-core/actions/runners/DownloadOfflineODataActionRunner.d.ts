import { IActionRunner } from './IActionRunner';
import { IAction } from '../IAction';
import { IActionResult } from '../../context/IClientAPI';
export declare class DownloadOfflineODataActionRunner implements IActionRunner {
    static getInstance(): DownloadOfflineODataActionRunner;
    private static _instance;
    private _downloadResults;
    private _pendingDownloads;
    private _processingDownloads;
    private constructor();
    run(action: IAction): Promise<IActionResult>;
    private _processDownloads;
    private _runAction;
}
