import { ODataCrudOperation } from '../../BaseODataCruder';
import { ODataServiceUtils } from '../../../ODataServiceUtils';
import { ErrorMessage } from '../../../../ErrorHandling/ErrorMessage';

export class ReferentialConstraintLink {
  public forcesCreateRelatedEntity: boolean = false;
  private dependantNavigationProperty: any;
  private dependantEntity: any;
  private principalEntity: any;
  private operation: ODataCrudOperation;

  public constructor(dependantNavigationProperty: any, dependantEntity: any, principalEntity: any, 
                     operation: ODataCrudOperation) {
    this.dependantNavigationProperty = dependantNavigationProperty;
    this.dependantEntity = dependantEntity;
    this.principalEntity = principalEntity;
    this.operation = operation;
  }

  public getPrincipalEntity(): any {
    return this.principalEntity;
  }

  public getDependantNavigationProperty(): any {
    return this.dependantNavigationProperty;
  }

  public execute(): void {
    switch (this.operation) {
      case ODataCrudOperation.Create:
      case ODataCrudOperation.Update:
        this.createLink();
        break;
      case ODataCrudOperation.Delete:
        this.deleteLink();
        break;
      case ODataCrudOperation.Read:
      default:
        break;
    }
  }

  private createLink(): void {
    let principalPropertyNamesByDependantPropertyNames = this.dependantNavigationProperty.getReferentialConstraints();

    let iterator = principalPropertyNamesByDependantPropertyNames.keys().iterator();
    while (iterator.hasNext()) {
      let dependantPropertyName = iterator.next();
      let principalPropertyName = principalPropertyNamesByDependantPropertyNames.get(dependantPropertyName);
      let principalProp = this.principalEntity.getEntityType().getProperty(principalPropertyName);
      // If the referential constraint property exists on
      // the principal, copy it to the dependant. We allow constraints
      // to be missing on locals, although they shouldn't be missing on
      // entities from the backend.
      let principalPropValue = principalProp.getOptionalValue(this.principalEntity);
      if (principalPropValue != null) {
        let dependantProp = this.dependantEntity.getEntityType().getProperty(dependantPropertyName);
        dependantProp.setValue(this.dependantEntity, ODataServiceUtils.convert(dependantPropertyName, principalPropValue, 
          dependantProp.getDataType().getCode()));
      }
    }
  }

  private deleteLink(): void {
    let principalPropertyNamesByDependantPropertyNames = this.dependantNavigationProperty.getReferentialConstraints();

    let iterator = principalPropertyNamesByDependantPropertyNames.keys().iterator();
    while (iterator.hasNext()) {
      let dependantPropertyName = iterator.next();
      let dependantProp = this.dependantEntity.getEntityType().getProperty(dependantPropertyName);
      // if dependantEntity.entityType.keyProperties.contains(where: { $0.name == dependantProp.name })
      if (this.dependantEntity.getEntityType().getKeyProperties().indexOf(dependantProp) >= 0) {
        throw new Error(ErrorMessage.ODATA_DELETE_REQUIRED_PROPERTY_NOT_ALLOWED);
      }
      dependantProp.setValue(this.dependantEntity, null);
    }
  }
}
