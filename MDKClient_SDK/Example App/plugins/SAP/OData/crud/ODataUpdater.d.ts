import { BaseODataCruder } from './BaseODataCruder';
import { ChangeSetManager } from './ChangeSetManager';
export declare class ODataUpdater extends BaseODataCruder {
    private targetReadParams;
    private properties;
    private linkCreators;
    private linkUpdaters;
    private linkDeleters;
    constructor(params: any);
    execute(dataService: any, changeSetManager: ChangeSetManager): Promise<string>;
    private setTargetReadParams;
    private setProperties;
    private setLinkCreators;
    private setLinkUpdaters;
    private setLinkDeleters;
    private executeLinkers;
    private executeLinkCreators;
    private executeLinkUpdaters;
    private executeLinkDeleters;
}
