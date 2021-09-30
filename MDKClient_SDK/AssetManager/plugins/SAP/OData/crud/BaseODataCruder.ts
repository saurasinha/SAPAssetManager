import { CrudParamsHelper } from './CrudParamsHelper';
import { ChangeSetManager } from './ChangeSetManager';
import { ODataHelper } from '../ODataHelper';
import { ErrorMessage } from '../../ErrorHandling/ErrorMessage';

export enum ODataCrudOperation {
  Create,
  Update,
  Delete,
  Read,
};

export class BaseODataCruder {
  protected service: string[];
  protected params: string[];
  protected headers: any;
  protected serviceUrl: string;
  protected changeSetManager: ChangeSetManager;
  protected requestOptionsParm: any;

  public constructor(params: any) {
    this.params = params;

    this.setService();
    this.setServiceUrl();
    this.setHeaders();
    this.setRequestOptions();
  }

  public getServiceUrl(): string {
    return this.serviceUrl;
  }

  public setChangeSetManager(changeSetManager: any): void {
    if (changeSetManager == null) {
      throw new Error(ErrorMessage.ODATA_CRUD_INIT_CHANGESETMANAGER_NOT_FOUND);
    }
    this.changeSetManager = changeSetManager;
  }

  public getDataContext(dataService: any): any {
    if (dataService != null) {
      return ODataHelper.createDataContext(dataService.getMetadata());
    }

    throw new Error(ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE);
  }

  private setService(): void {
    this.service = CrudParamsHelper.getServiceFromParams(this.params);
  }

  private setServiceUrl(): void {
    this.serviceUrl = CrudParamsHelper.getServiceUrlFromService(this.service);
  }

  private setHeaders(): void {
    let headersParm = CrudParamsHelper.getHeadersFromParams(this.params);
    if (!headersParm) {
      headersParm = CrudParamsHelper.getHeadersFromParams(this.service);
    }
    this.headers = ODataHelper.getHttpHeaders(headersParm);
  }

  private setRequestOptions(): void {
    this.requestOptionsParm = CrudParamsHelper.getRequestOptionsFromService(this.service);
  }
}
