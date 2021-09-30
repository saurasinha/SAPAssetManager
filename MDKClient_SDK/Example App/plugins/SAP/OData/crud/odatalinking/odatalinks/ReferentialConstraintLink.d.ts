import { ODataCrudOperation } from '../../BaseODataCruder';
export declare class ReferentialConstraintLink {
    forcesCreateRelatedEntity: boolean;
    private dependantNavigationProperty;
    private dependantEntity;
    private principalEntity;
    private operation;
    constructor(dependantNavigationProperty: any, dependantEntity: any, principalEntity: any, operation: ODataCrudOperation);
    getPrincipalEntity(): any;
    getDependantNavigationProperty(): any;
    execute(): void;
    private createLink;
    private deleteLink;
}
