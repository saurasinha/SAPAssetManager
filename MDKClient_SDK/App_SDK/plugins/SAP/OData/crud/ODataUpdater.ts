import { BaseODataCruder } from './BaseODataCruder';
import { ReadParamsFactory } from './ReadParamsFactory';
import { CrudParamsHelper } from './CrudParamsHelper';
import { ReadService } from './ReadService';
import { ODataLinkCreator } from './odatalinking/odatalinkers/ODataLinkCreator';
import { ODataLinkUpdater } from './odatalinking/odatalinkers/ODataLinkUpdater';
import { ODataLinkDeleter } from './odatalinking/odatalinkers/ODataLinkDeleter';
import { ReadParams } from './readparams/ReadParams';
import { ChangeSetManager } from './ChangeSetManager';
import { ODataHelper } from '../ODataHelper';
import { ErrorMessage } from '../../ErrorHandling/ErrorMessage';

export class ODataUpdater extends BaseODataCruder {
  private targetReadParams: ReadParams;
  private properties: any;
  private linkCreators: ODataLinkCreator [];
  private linkUpdaters: ODataLinkUpdater [];
  private linkDeleters: ODataLinkDeleter [];

  public constructor(params: any) {
    super(params);
    this.setTargetReadParams();
    this.setProperties();
    this.setLinkCreators();
    this.setLinkUpdaters();
    this.setLinkDeleters();
  }

  public execute(dataService: any, changeSetManager: ChangeSetManager): Promise<string> {
    return new Promise((resolve, reject) => {
      this.setChangeSetManager(changeSetManager);

      let entityToUpdate = ReadService.entityFromParams(this.targetReadParams, dataService, this.changeSetManager);
      ODataHelper.setEntityValueProperties(entityToUpdate, dataService, this.properties);

      this.executeLinkers(dataService, entityToUpdate);
      let options = ODataHelper.getRequestOptions(this.requestOptionsParm, dataService);

      this.changeSetManager.updateEntity(entityToUpdate, this.headers, options).then(() => {
        resolve(ODataHelper.entityValueToJson(entityToUpdate, this.getDataContext(dataService)));
      }).catch((error) => {
        reject(error);
      });
    });
  }

  private setTargetReadParams(): any {
    this.targetReadParams = ReadParamsFactory.createReadParams(this.service);
  }

  private setProperties(): any {
    this.properties = CrudParamsHelper.getPropertiesFromService(this.service);
  }

  private setLinkCreators(): void {
    this.linkCreators = CrudParamsHelper.getLinkCreatorsFromParams(this.params);
  }

  private setLinkUpdaters(): void {
    this.linkUpdaters = CrudParamsHelper.getLinkUpdatersFromParams(this.params);
  }

  private setLinkDeleters(): void {
    this.linkDeleters = CrudParamsHelper.getLinkDeletersFromParams(this.params);
  }

  private executeLinkers(dataService: any, sourceEntity: any): void {
    this.executeLinkCreators(dataService, sourceEntity);
    this.executeLinkUpdaters(dataService, sourceEntity);
    this.executeLinkDeleters(dataService, sourceEntity);
  }

  private executeLinkCreators(dataService: any, sourceEntity: any): void {
    if (this.linkCreators != null) {
      for (let linkCreator of this.linkCreators) {
        if (linkCreator.execute(sourceEntity, dataService, this.changeSetManager) != null) {
          throw new Error(ErrorMessage.ODATA_UPDATE_MANDATORY_PARENT_NOT_ALLOWED);
        }
      }
    }
  }

  private executeLinkUpdaters(dataService: any, sourceEntity: any): void {
    if (this.linkUpdaters != null) {
      for (let linkUpdater of this.linkUpdaters) {
        if (linkUpdater.execute(sourceEntity, dataService, this.changeSetManager) != null) {
          throw new Error(ErrorMessage.ODATA_UPDATE_MANDATORY_PARENT_NOT_ALLOWED);
        }
      }
    }
  }

  private executeLinkDeleters(dataService: any, sourceEntity: any): void {
    if (this.linkDeleters != null) {
      for (let linkDeleter of this.linkDeleters) {
        linkDeleter.execute(sourceEntity, dataService, this.changeSetManager);
      }
    }
  }
}
