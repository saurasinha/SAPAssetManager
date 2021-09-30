import { ODataCrudOperation } from '../../BaseODataCruder';
export declare class LinkingScenario {
    private navigationProperty;
    private sourceEntity;
    private targetEntity;
    private operation;
    private canUseCreateRelatedEntity;
    private supportsBind;
    private partnerProperty;
    constructor(navigationProperty: any, sourceEntity: any, targetEntity: any, operation: ODataCrudOperation, canUseCreateRelatedEntity: boolean, supportsBind: boolean);
    execute(): any;
    private canCreateRelatedEntity;
    private analyseBindingScenario;
    private analyseReferentialConstraintScenario;
    private canBindFromSourceToTarget;
    private canBindFromTargetToSource;
    private canBindFromNavProp;
    private associationHasReferentialConstraints;
    private isDependant;
    private bothPending;
    private isRelationshipManyToMany;
    private arrange;
}
