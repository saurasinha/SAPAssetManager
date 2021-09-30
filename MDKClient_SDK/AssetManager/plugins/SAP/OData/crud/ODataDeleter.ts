import { BaseODataCruder } from './BaseODataCruder';
import { ReadService } from './ReadService';
import { ReadParamsFactory } from './ReadParamsFactory';
import { ODataHelper } from '../ODataHelper';
import { ChangeSetManager } from './ChangeSetManager';

export class ODataDeleter extends BaseODataCruder {
  private targetReadParams: any;

  public constructor(params: any) {
    super(params);
    this.setTargetReadParams();
  }

  public execute(dataService: any, changeSetManager: ChangeSetManager): Promise<string> {
    return new Promise((resolve, reject) => {
      this.setChangeSetManager(changeSetManager);
      let entityToDelete = ReadService.entityFromParams(this.targetReadParams, dataService, this.changeSetManager);
      let options = ODataHelper.getRequestOptions(this.requestOptionsParm, dataService);
      this.changeSetManager.deleteEntity(entityToDelete, this.headers, options).then(() => {
        resolve(ODataHelper.entityValueToJson(entityToDelete, this.getDataContext(dataService)));
      }).catch((error) => {
        reject(error);
      });
    });
  }
  
  private setTargetReadParams(): void {
    this.targetReadParams = ReadParamsFactory.createReadParams(this.service);
  }
}
