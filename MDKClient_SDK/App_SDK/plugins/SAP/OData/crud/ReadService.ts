import { ChangeSetManager } from './ChangeSetManager';
import { ReadParams } from './readparams/ReadParams';
import { QueryOptionsReadParams } from './readparams/QueryOptionsReadParams';
import { ReadLinkReadParams } from './readparams/ReadLinkReadParams';
import { ODataHelper } from '../ODataHelper';
import { ErrorMessage } from '../../ErrorHandling/ErrorMessage';

export class ReadService {
  public static entityFromParams(readParams: ReadParams, dataService: any, changeSetManager: ChangeSetManager): any {
    if (readParams instanceof ReadLinkReadParams) {
      return ReadService.entityFromReadLinkReadParams(readParams, dataService, changeSetManager);
    } else if (readParams instanceof QueryOptionsReadParams) {
      return ReadService.entityFromQueryOptions(dataService, readParams.getEntitySetName(), 
        readParams.getQueryOptions());
    } else {
      return this.entityFromQueryOptions(dataService, readParams.getEntitySetName(), null);
    }
  }

  public static entitiesFromParams(readParams: ReadParams, dataService: any, changeSetManager: ChangeSetManager): any {
    if (readParams instanceof ReadLinkReadParams) {
      return ReadService.entitiesFromReadLinkReadParams(readParams, dataService, changeSetManager);
    } else if (readParams instanceof QueryOptionsReadParams) {
      return ReadService.entitiesFromQueryOptions(dataService, readParams.getEntitySetName(), 
        readParams.getQueryOptions());
    } else {
      return this.entitiesFromQueryOptions(dataService, readParams.getEntitySetName(), null);
    }
  }

  private static entityFromReadLinkReadParams(readLinkReadParams: ReadLinkReadParams, dataService: any, 
                                              changeSetManager: ChangeSetManager): any {
    if (readLinkReadParams.isTargetCreatedInSameChangeSet()) {
      let pendingEntity = changeSetManager.pendingEntityFromPendingChangeSet(readLinkReadParams.getReadLink());
      if (pendingEntity == null)  {
        throw Error(ErrorMessage.format(ErrorMessage.ODATA_ENTITY_READLINK_NOT_FOUND, 
          readLinkReadParams.getReadLink()));
      }
      return pendingEntity;
    } else {
      let entitySet = dataService.getEntitySet(readLinkReadParams.getEntitySetName());
      let entityType = ODataHelper.createEntityValue(entitySet.getEntityType());
      entityType.setEntitySet(entitySet);
      entityType.setReadLink(readLinkReadParams.getReadLink());
      this.loadEntity(dataService, entityType);
      return entityType;
    }
  }

  private static loadEntity(dataService: any, entity: any): void {
    if (dataService != null) {
      if (ODataHelper.isOnlineProvider(dataService)) {
        // workaround for MDK-5070. Once OData SDK fixes the issue, online check will be removed
        let query = ODataHelper.createDataQuery();
        query.setExpectSingle(true);
        dataService.loadEntity(entity, query);
      } else {
        dataService.loadEntity(entity);
      }
    } else {
      throw new Error(ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE);
    }
  }

  // A ReadLink always return one single entity, but in the context of a linking target acquisition, 
  // we only work with arrays
  private static entitiesFromReadLinkReadParams(readLinkReadParams: ReadLinkReadParams, dataService: any, 
                                                changeSetManager: ChangeSetManager): any {
    let entities = new Array(1);
    entities[0] = this.entityFromReadLinkReadParams(readLinkReadParams, dataService, changeSetManager);
    return entities;
  }

  private static entityFromQueryOptions(dataService: any, entitySetName: string, queryOptions: string): void {
    let entities = this.entitiesFromQueryOptions(dataService, entitySetName, queryOptions);

    if (entities.length !== 1) {
      throw new Error(ErrorMessage.format(ErrorMessage.ODATA_MORE_THAN_1_ENTITY_RETURNED, entities.length));
    }
    return entities[0];
  }

  private static entitiesFromQueryOptions(dataService: any, entitySetName: string, queryOptions: string): any {
    let entityList = this.getEntityValueList(dataService, entitySetName, queryOptions);
    let entities = new Array(entityList.length());
    for (let i = 0; i < entityList.length(); i++) {
      entities[i] = entityList.get(i);
    }
    return entities;
  }

  private static getEntityValueList(dataService: any, entityName: string, queryOptions: string): any {
    let query = this.createQuery(dataService, entityName, queryOptions);
    return dataService.executeQuery(query).getEntityList();
  }

  private static createQuery(dataService: any, entitySetName: string, queryOptions: string): void {
    let query = ODataHelper.createDataQuery();
    if (queryOptions != null) {
      query.setUrl(entitySetName + '?' + queryOptions);
    } else {
      query.setUrl(entitySetName);
    }

    let entitySet = dataService.getEntitySet(entitySetName);
    query = query.from(entitySet);
    return query;
  }
}
