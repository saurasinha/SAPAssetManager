import { BindingLink } from './BindingLink';
import { ReferentialConstraintLink } from './ReferentialConstraintLink';
import { ODataCrudOperation } from '../../BaseODataCruder';
import { ChangeSetManager } from '../../ChangeSetManager';
import { ODataHelper } from '../../../ODataHelper';
import { ErrorMessage } from '../../../../ErrorHandling/ErrorMessage';

export class LinkingScenario {
  private navigationProperty: any;
  private sourceEntity: any;
  private targetEntity: any;
  private operation: ODataCrudOperation;
  private canUseCreateRelatedEntity: boolean;
  private supportsBind: boolean;
  private partnerProperty: any;

  public constructor(navigationProperty: any, sourceEntity: any, targetEntity: any, operation: ODataCrudOperation, 
                     canUseCreateRelatedEntity: boolean, supportsBind: boolean) {
    this.navigationProperty = navigationProperty;
    this.sourceEntity = sourceEntity;
    this.targetEntity = targetEntity;
    this.operation = operation;
    this.canUseCreateRelatedEntity = canUseCreateRelatedEntity;
    this.supportsBind = supportsBind;
    this.partnerProperty = ODataHelper.partnerPropertyFromEntity(navigationProperty, targetEntity);
  }

  public execute(): any {
    let linkToParentEntity = null;
    let shouldDoBinding = true;

    let refConstrs = this.analyseReferentialConstraintScenario();
    if (refConstrs != null) {
      if (refConstrs.forcesCreateRelatedEntity) {
        linkToParentEntity = refConstrs;
        // Do not bind an entity which will be used as a related parent
        shouldDoBinding = false;
      } else {
        refConstrs.execute();
      }
    }

    if (shouldDoBinding) {
      let binding = this.analyseBindingScenario();
      if (binding != null) {
        binding.execute();
      }
    }
    return linkToParentEntity;
  }

  private canCreateRelatedEntity(): boolean {
    if (this.partnerProperty == null) {
      return false;
    }

    // The canUseCreateRelatedEntity flag is true unless createRelatedEntity was already
    // used to link to the entity.
    // TODO-FUTURE: Refactor to make this more clear.
    return this.canUseCreateRelatedEntity
      // It must be a create operation
      && this.operation === ODataCrudOperation.Create
      // SNOWBLIND-4807: The navigation property being posted to must be a collection.
      // Violating this would result in an Invalid Resource Path error.
      // See "How to Create Relationships With Offline OData"
      // in the "POST through a navigation property" section.
      && this.partnerProperty.getType().isList();
  }

  private analyseBindingScenario(): any {
    if (this.operation === ODataCrudOperation.Delete)  {
      // Bind deletion is not supported by the OData SDK. Only referential constraints is currently used for deletion
      return null; 
    }

    if (this.bothPending()) {
      throw new Error(ErrorMessage.ODATA_LINKING_2_PENDING_ENTITIES_NOT_ALLOWED);
    }

    if (this.canBindFromSourceToTarget()) {
      return new BindingLink(this.navigationProperty, this.sourceEntity, this.targetEntity, this.operation);
    } else if (this.canBindFromTargetToSource()) {
      if (this.supportsBind) {
        return new BindingLink(this.navigationProperty, this.sourceEntity, this.targetEntity, this.operation);
      } else {
        return new BindingLink(this.partnerProperty, this.targetEntity, this.sourceEntity, this.operation);
      }
    }
    return null;
  }

  private analyseReferentialConstraintScenario(): any {
      let arranged = this.arrange(this.sourceEntity, this.navigationProperty, this.targetEntity);
      if (arranged == null) {
        return null;
      }

      let dependantNavProp = arranged.dependantNavProp;
      let dependant = arranged.dependant;
      let principal = arranged.principal;

      let refLink = new ReferentialConstraintLink(dependantNavProp, dependant, principal, this.operation);

      if (!this.canCreateRelatedEntity()) {
        return refLink;
      }
      // The only way to link a many-to-many relationship or two
      // entities which are in an un-processed changeSet is to use createRelatedEntity.
      if (this.bothPending() || this.isRelationshipManyToMany()) {
        // Flag this link so its execute() function does not get invoked, but it's returned to the calling class for 
        // createRelatedEntity(), instead
        refLink.forcesCreateRelatedEntity = true;
      }
      return refLink;
  }

  private canBindFromSourceToTarget(): boolean {
    return this.canBindFromNavProp(this.navigationProperty);
  }

  private canBindFromTargetToSource(): boolean {
    if (this.partnerProperty == null) {
      return false;
    }

    return this.canBindFromNavProp(this.partnerProperty);
  }

  private canBindFromNavProp(navProp: any): boolean {
    if (this.associationHasReferentialConstraints()) {
      return this.isDependant(navProp);
    } else {
      return !navProp.getType().isList();
    }
  }

  private associationHasReferentialConstraints(): boolean {
    return this.isDependant(this.navigationProperty) || this.isDependant(this.partnerProperty);
  }

  private isDependant(navProp: any): boolean {
    if (navProp == null) {
      return false;
    }

    return navProp.getReferentialConstraints().size() !== 0;
  }

  private bothPending(): boolean  {
    return ChangeSetManager.isPending(this.targetEntity) && ChangeSetManager.isPending(this.sourceEntity);
  }

  private isRelationshipManyToMany(): boolean {
    if (this.partnerProperty == null) {
      return false;
    }

    return this.navigationProperty.getType().isList()
      && this.partnerProperty.getType().isList();
  }

  private arrange(entity1: any, entity1NavProp: any, entity2: any): any { 
    if (!this.associationHasReferentialConstraints()) {
      return null;
    }

    if (!this.isDependant(entity1NavProp)) {
      if (this.supportsBind) {
        return {
          dependant : entity2, 
          dependantNavProp : entity1NavProp, 
          principal : entity1, 
        };
      } else {
        return {
          dependant : entity2, 
          dependantNavProp : ODataHelper.partnerPropertyFromEntity(entity1NavProp, entity2), 
          principal : entity1, 
        };
      }
    } else {
      return {
        dependant : entity1, 
        dependantNavProp : entity1NavProp, 
        principal : entity2, 
      };
    }
  }
}
