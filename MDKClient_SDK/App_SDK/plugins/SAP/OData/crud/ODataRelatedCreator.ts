import { BaseODataCruder } from './BaseODataCruder';
import { CrudParamsHelper } from './CrudParamsHelper';
import { ChangeSetManager } from './ChangeSetManager';
import { ReadService } from './ReadService';
import { ReadParamsFactory } from './ReadParamsFactory';
import { ODataHelper } from '../ODataHelper';
import { ErrorMessage } from '../../ErrorHandling/ErrorMessage';

export class ODataRelatedCreator extends BaseODataCruder {
  private properties: string[];
  private entitySetName: string;
  private parent: string[];
  private parentNavigationPropertyName: String;
  private targetReadParams: any;

  public constructor(params: any) {
    super(params);
    this.setEntitySetName();
    this.setProperties();

    this.setParent();
    this.setTargetReadParams(this.parent);
    this.setParentNavigationPropertyName();
  }

  public execute(dataService: any, changeSetManager: ChangeSetManager): Promise<string> {
    return new Promise((resolve, reject) => {
      this.setChangeSetManager(changeSetManager);
      let entityToCreate = this.initNewEntity(dataService);

      ODataHelper.setEntityValueProperties(entityToCreate, dataService, this.properties);

      let parentEntityValue = ReadService.entityFromParams(this.targetReadParams, dataService, changeSetManager);
      let options = ODataHelper.getRequestOptions(this.requestOptionsParm, dataService);
      
      this.changeSetManager.createRelatedEntity(entityToCreate, parentEntityValue,
        parentEntityValue.getEntityType().getProperty(this.parentNavigationPropertyName), this.headers, options)
        .then(() => {
        resolve(ODataHelper.entityValueToJson(entityToCreate, this.getDataContext(dataService)));
      }).catch((error) => {
        reject(error);
      });
    });
  }

  private setEntitySetName(): void {
    this.entitySetName = CrudParamsHelper.getEntitySetNameFromService(this.service);
  }

  private setProperties(): void {
    let properties = CrudParamsHelper.getPropertiesFromService(this.service);
    if (properties != null) {
      this.properties = properties;
    } 
  }

  private setParent(): void {
    this.parent = CrudParamsHelper.getParentFromParams(this.params);
  }
  
  private setParentNavigationPropertyName(): void {
    this.parentNavigationPropertyName = CrudParamsHelper.getPropertyFromParent(this.parent);
  }

  private setTargetReadParams(linkingParams): void {
    this.targetReadParams = ReadParamsFactory.createReadParams(linkingParams);
  }

  private initNewEntity(dataService: any): any {
    if (dataService != null) {
      let entitySet = dataService.getEntitySet(this.entitySetName);
      return ODataHelper.createEntityValue(entitySet.getEntityType());
    }
    throw new Error(ErrorMessage.format(ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE, this.entitySetName));
  }
}
