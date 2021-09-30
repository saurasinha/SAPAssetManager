import { BaseAction } from './BaseAction';
import { IActionResult } from '../context/IClientAPI';
export declare class OpenBarcodeScannerAction extends BaseAction {
    private params;
    private resolveScanning;
    constructor(actionDefinition: any);
    execute(): Promise<IActionResult>;
    finishedScanningWithResults: (results: any) => void;
    failedScanningWithMessage: (message: any) => void;
    errorScanningWithMessage: (message: any) => void;
}
