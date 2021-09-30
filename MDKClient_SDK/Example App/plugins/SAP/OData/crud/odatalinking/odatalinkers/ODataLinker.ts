
import { ODataCrudOperation } from '../../BaseODataCruder';
import { ReadService } from '../../ReadService';
import { ReadParamsFactory } from '../../ReadParamsFactory';
import { CrudParamsHelper } from '../../CrudParamsHelper';
import { ChangeSetManager } from '../../ChangeSetManager';
import { ErrorMessage } from '../../../../ErrorHandling/ErrorMessage';

export class ODataLinker {
  private static readonly PROPERTYKEY: string = 'property';

  protected navigationProperty: any;
  protected targetReadParams: any;
  protected targets: any;
  protected operation: ODataCrudOperation;

  private sourceEntitySetName: string;
  private navigationPropertyName: string;

  public constructor(sourceEntitySetName: string, linkingParams: any, operation: ODataCrudOperation) {
    this.sourceEntitySetName = sourceEntitySetName;
    this.operation = operation;
    this.setNavigationPropertyName(linkingParams);
    this.setTargetReadParams(linkingParams);
  }

  public execute(sourceEntity: any, dataService: any, changeSetManager: ChangeSetManager) {
    this.setNavigationProperty(dataService);
    this.acquireTargets(dataService, changeSetManager);
  }

  private setNavigationPropertyName(linkingParams: any): void {
    let navigationPropertyName = linkingParams[ODataLinker.PROPERTYKEY];
    if (navigationPropertyName != null && navigationPropertyName.length !== 0) {
      this.navigationPropertyName = navigationPropertyName;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.ODATA_MALFORMED_PARAM_FOUND, CrudParamsHelper.MALFORMEDPARAM,
        ODataLinker.PROPERTYKEY));
    }
  }

  private setTargetReadParams(linkingParams: any): void {
    this.targetReadParams = ReadParamsFactory.createReadParams(linkingParams);
  }

  private setNavigationProperty(dataService: any): void {
    let entitySet = dataService.getEntitySet(this.sourceEntitySetName);
    this.navigationProperty = entitySet.getEntityType().getProperty(this.navigationPropertyName);
  }

  private acquireTargets(dataService: any, changeSetManager: ChangeSetManager): void {
    this.targets = ReadService.entitiesFromParams(this.targetReadParams, dataService, changeSetManager);
    if (this.targets.length === 0) {
      throw new Error(ErrorMessage.ODATA_ZERO_TARGET_RETURNED);
    }
  }
}
