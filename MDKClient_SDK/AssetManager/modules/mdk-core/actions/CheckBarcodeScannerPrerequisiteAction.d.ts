import { BaseAction } from './BaseAction';
import { IActionResult } from '../context/IClientAPI';
export declare class CheckBarcodeScannerPrerequisiteAction extends BaseAction {
    private params;
    private resolvePromise;
    constructor(actionDefinition: any);
    execute(): Promise<IActionResult>;
    finishedCheckingWithResults(result: any): void;
    failedCheckingWithErrors(result: any): void;
    finishedCheckingWithErrors(newValue: any): void;
    finishedScanningWithResults(): void;
    finishedScanningWithErrors(): void;
}
