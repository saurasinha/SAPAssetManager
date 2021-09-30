import { BaseODataCruder } from './BaseODataCruder';
import { ChangeSetManager } from './ChangeSetManager';
export declare class ODataCreator extends BaseODataCruder {
    private properties;
    private entitySetName;
    private linkCreators;
    constructor(params: any);
    execute(dataService: any, changeSetManager: ChangeSetManager): Promise<string>;
    private setEntitySetName;
    private setProperties;
    private setLinkCreators;
    private initNewEntity;
    private executeLinkCreators;
}
