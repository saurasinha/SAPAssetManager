import { BaseODataCruder } from './BaseODataCruder';
import { ChangeSetManager } from './ChangeSetManager';
export declare class ODataDeleter extends BaseODataCruder {
    private targetReadParams;
    constructor(params: any);
    execute(dataService: any, changeSetManager: ChangeSetManager): Promise<string>;
    private setTargetReadParams;
}
