import { BaseODataCruder } from './BaseODataCruder';
import { CrudParamsHelper } from './CrudParamsHelper';
import { ODataLinkCreator } from './odatalinking/odatalinkers/ODataLinkCreator';
import { ChangeSetManager } from './ChangeSetManager';
import { ODataHelper } from '../ODataHelper';
import { ErrorMessage } from '../../ErrorHandling/ErrorMessage';

export class ODataCreator extends BaseODataCruder {
  private properties: string[];
  private entitySetName: string;
  private linkCreators: [ODataLinkCreator];

  public constructor(params: any) {
    super(params);
    this.setEntitySetName();
    this.setProperties();
    this.setLinkCreators();
  }

  public execute(dataService: any, changeSetManager: ChangeSetManager): Promise<string> {
    return new Promise((resolve, reject) => {
      this.setChangeSetManager(changeSetManager);
      let options = ODataHelper.getRequestOptions(this.requestOptionsParm, dataService);
      let entityToCreate = this.initNewEntity(dataService);

      ODataHelper.setEntityValueProperties(entityToCreate, dataService, this.properties);

      // MandatoryParentLinker will be returned by a link which does not have its principal's referential constraints 
      // set, but is in a strict relationship this one needs to be used with createRelatedEntity
      let linkToParentEntity = this.executeLinkCreators(dataService, entityToCreate);
      if (linkToParentEntity != null) {
        let relatedParent = linkToParentEntity.getPrincipalEntity();
        let navigationPropertyFromRelatedParent = ODataHelper.partnerPropertyFromEntity(
          linkToParentEntity.getDependantNavigationProperty(), relatedParent);

        this.changeSetManager.createRelatedEntity(entityToCreate, relatedParent,
          navigationPropertyFromRelatedParent, this.headers, options).then(() => {
          resolve(ODataHelper.entityValueToJson(entityToCreate, this.getDataContext(dataService)));
        }).catch((error) => {
          reject(error);
        });
      } else {
        changeSetManager.createEntity(entityToCreate, this.headers, options).then(() => {
          resolve(ODataHelper.entityValueToJson(entityToCreate, this.getDataContext(dataService)));
        }).catch((error) => {
          reject(error);
        });
      }
    });
  }

  private setEntitySetName(): void {
    this.entitySetName = CrudParamsHelper.getEntitySetNameFromService(this.service);
  }

  private setProperties(): void {
    let properties = CrudParamsHelper.getPropertiesFromService(this.service);

    if (properties != null) {
      this.properties = properties;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.ODATA_CREATE_OPERATION_EMPTY_PROPERTY_NOT_ALLOWED,
        CrudParamsHelper.MALFORMEDPARAM));
    }
  }

  private setLinkCreators(): void {
    this.linkCreators = CrudParamsHelper.getLinkCreatorsFromParams(this.params);
  }

  private initNewEntity(dataService: any): any {
    if (dataService != null) {
      let entitySet = dataService.getEntitySet(this.entitySetName);
      let entityValue = ODataHelper.createEntityValue(entitySet.getEntityType());
      entityValue.setEntitySet(entitySet);
      return entityValue;
    }
    throw new Error(ErrorMessage.format(ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE, this.entitySetName));
  }

  private executeLinkCreators(dataService: any, sourceEntity: any): any {
    let linkToParentEntity = null;

    if (this.linkCreators != null) {
      for (let linkCreator of this.linkCreators) {
        // Can only use createRelatedEntity to create the parent once.
        let canUseCreateRelatedEntity = (linkToParentEntity == null);
        let link = linkCreator.execute(sourceEntity, dataService, this.changeSetManager, canUseCreateRelatedEntity);
        if (link != null) {
          // Make sure that no more than one linker returns a link which requires to be a relatedParent
          if (linkToParentEntity != null) {
            throw new Error(ErrorMessage.ODATA_CREATE_RELATED_ENTITY_NOT_ALLOWED);
          } else {
            linkToParentEntity = link;
          }
        }
      }
    }
    return linkToParentEntity;
  }
}
