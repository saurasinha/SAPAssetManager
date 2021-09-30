import { BaseODataCruder } from './BaseODataCruder';
import { ChangeSetManager } from './ChangeSetManager';
export declare class ODataRelatedCreator extends BaseODataCruder {
    private properties;
    private entitySetName;
    private parent;
    private parentNavigationPropertyName;
    private targetReadParams;
    constructor(params: any);
    execute(dataService: any, changeSetManager: ChangeSetManager): Promise<string>;
    private setEntitySetName;
    private setProperties;
    private setParent;
    private setParentNavigationPropertyName;
    private setTargetReadParams;
    private initNewEntity;
}
