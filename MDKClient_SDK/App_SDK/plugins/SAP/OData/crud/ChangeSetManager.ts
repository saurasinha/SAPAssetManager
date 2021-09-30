import { ErrorMessage } from '../../ErrorHandling/ErrorMessage';
import { ODataHelper } from '../ODataHelper';

export class ChangeSetManager {
  public static UNPROCESSEDPREFIX: string = 'pending_';  

  public static isPending(entity: any): boolean {
    let readLink = entity.getReadLink();
    return readLink == null || readLink.startsWith(ChangeSetManager.UNPROCESSEDPREFIX);
  }

  private pendingChangeSet: any;
  private pendingEntityReadLinkOrdinalSuffix: number;
  private service: any;

  constructor(dataService: any) {
    this.service = dataService;
    this.pendingEntityReadLinkOrdinalSuffix = 0;
    this.pendingChangeSet = null;
  }

  public beginChangeSet(): void {
    if (this.pendingChangeSet != null)  {
      throw new Error(ErrorMessage.ODATA_CHANGESET_ALREADY_EXISTS);
    }
    this.pendingChangeSet = ODataHelper.createChangeSet();
    this.pendingEntityReadLinkOrdinalSuffix = 0;
  }

  public cancelChangeSet(): void {
    this.pendingChangeSet = null;
    this.pendingEntityReadLinkOrdinalSuffix = 0;
  }

  public commitChangeSet(): Promise<void> {
    let changeSet = this.pendingChangeSet;
    if (changeSet == null) {
      throw new Error(ErrorMessage.ODATA_COMMIT_EMPTY_CHANGESET_NOT_ALLOWED);
    }

    this.pendingChangeSet = null;
    this.pendingEntityReadLinkOrdinalSuffix = 0;
    return this.processBatchWithChangeSet(changeSet).then(() => {
      let error = changeSet.getError();
      if (error !== null) {
        throw error;
      }
    });
  }

  public createEntity(entity: any, headers: any, requestOptions: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let changeSet = this.pendingChangeSet;
      if (changeSet != null) {
        this.pendingEntityReadLinkOrdinalSuffix += 1;
        entity.setReadLink(ChangeSetManager.UNPROCESSEDPREFIX + this.pendingEntityReadLinkOrdinalSuffix);
        changeSet.createEntity(entity, headers, requestOptions);
        return resolve();
      } else {
        this.service.createEntityAsync(entity, ODataHelper.createAction0({
          call: () => resolve(),
        }), ODataHelper.createAction1({
          call: (error) => reject(error),
        }), headers, requestOptions);
      }
    });
  }

  public createRelatedEntity(
      entity: any, parentEntity: any, parentNavProp: any, headers: any, requestOptions: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let changeSet = this.pendingChangeSet;
      if (changeSet != null) {
        this.pendingEntityReadLinkOrdinalSuffix += 1;
        entity.setReadLink(ChangeSetManager.UNPROCESSEDPREFIX + this.pendingEntityReadLinkOrdinalSuffix);
        changeSet.createRelatedEntity(entity, parentEntity, parentNavProp, headers, requestOptions);
        return resolve();
      } else {
        return this.service.createRelatedEntityAsync(entity, parentEntity, parentNavProp, ODataHelper.createAction0({
          call: () => resolve(),
        }), ODataHelper.createAction1({
          call: (error) => reject(error),
        }), headers, requestOptions);
      }
    });
  }

  public updateEntity(entity: any, headers: any, requestOptions: any): Promise<any>  {
    return new Promise((resolve, reject) => {
      let changeSet = this.pendingChangeSet;
      if (changeSet != null) {
        changeSet.updateEntity(entity, headers, requestOptions);
        return resolve();
      } else {
        return this.service.updateEntityAsync(entity, ODataHelper.createAction0({
          call: () => resolve(),
        }), ODataHelper.createAction1({
          call: (error) => reject(error),
        }), headers, requestOptions);
      }
    });
  }

  public deleteEntity(entity: any, headers: any, requestOptions: any): Promise<any>  {
    return new Promise((resolve, reject) => {
      let changeSet = this.pendingChangeSet;
      if (changeSet != null) {
        changeSet.deleteEntity(entity, headers, requestOptions);
        return resolve();
      } else {
        return this.service.deleteEntityAsync(entity, ODataHelper.createAction0({
          call: () => resolve(),
        }), ODataHelper.createAction1({
          call: (error) => reject(error),
        }), headers, requestOptions);
      }
    });
  }

  public pendingEntityFromPendingChangeSet(readLink: string): any {
    if (!readLink.startsWith(ChangeSetManager.UNPROCESSEDPREFIX)) {
      return null;
    }
    return ODataHelper.entityWithReadLink(this.pendingChangeSet, readLink);
  }

  private processBatchWithChangeSet(changeSet: any): Promise<void> {
    return new Promise((resolve, reject) => {
      let requestBatch = ODataHelper.createRequestBatch();
      requestBatch.addChanges(changeSet);

      return this.service.processBatchAsync(requestBatch, ODataHelper.createAction0({
        call: () => {
          resolve();
        },
      }), ODataHelper.createAction1({
        call: (error) => reject(error),
      }));
    });
  }
}
