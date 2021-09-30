import { ODataCrudOperation } from '../../BaseODataCruder';
export declare class BindingLink {
    private sourceNavigationProperty;
    private sourceEntity;
    private targetEntity;
    private operation;
    constructor(sourceNavigationProperty: any, sourceEntity: any, targetEntity: any, operation: ODataCrudOperation);
    execute(): void;
}
