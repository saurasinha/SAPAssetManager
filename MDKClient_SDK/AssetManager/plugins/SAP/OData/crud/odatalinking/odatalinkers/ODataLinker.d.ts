import { ODataCrudOperation } from '../../BaseODataCruder';
import { ChangeSetManager } from '../../ChangeSetManager';
export declare class ODataLinker {
    private static readonly PROPERTYKEY;
    protected navigationProperty: any;
    protected targetReadParams: any;
    protected targets: any;
    protected operation: ODataCrudOperation;
    private sourceEntitySetName;
    private navigationPropertyName;
    constructor(sourceEntitySetName: string, linkingParams: any, operation: ODataCrudOperation);
    execute(sourceEntity: any, dataService: any, changeSetManager: ChangeSetManager): void;
    private setNavigationPropertyName;
    private setTargetReadParams;
    private setNavigationProperty;
    private acquireTargets;
}
