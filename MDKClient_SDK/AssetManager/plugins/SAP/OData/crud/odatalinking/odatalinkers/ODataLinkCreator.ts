import { ODataLinker } from './ODataLinker';
import { LinkingScenario } from '../odatalinks/LinkingScenario';
import { ODataCrudOperation } from '../../BaseODataCruder';
import { ChangeSetManager } from '../../ChangeSetManager';
import { ErrorMessage } from '../../../../ErrorHandling/ErrorMessage';

export class ODataLinkCreator extends ODataLinker {
  public constructor(sourceEntitySetName: string, linkingParams: any, operation = ODataCrudOperation.Create) {
    super(sourceEntitySetName, linkingParams, operation);
  }

  public execute(sourceEntity: any, dataService: any, changeSetManager: ChangeSetManager, 
                 canUseCreateRelatedEntity = false) {
    if (dataService != null) {
      super.execute(sourceEntity, dataService, changeSetManager);
      return this.performLinking(sourceEntity, canUseCreateRelatedEntity, 
        dataService.getProvider().getServiceOptions().getSupportsBind());
    }
    throw new Error(ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE);
  }

  public isTargetCreatedInSameChangeSet(): boolean {
    return this.targetReadParams.isTargetCreatedInSameChangeSet();
  }

  private performLinking(sourceEntity: any, canUseCreateRelatedEntity: boolean, supportsBind: boolean) {
    let linkToParentEntity = null;
    for (let target of this.targets) {
      if (target.getReadLink() == null) {
        target.setReadLink(target.getCanonicalURL());
      }
      let scenario = new LinkingScenario(this.navigationProperty, sourceEntity, target, this.operation, 
        canUseCreateRelatedEntity, supportsBind);
      let link = scenario.execute();
      if (link != null) {
        // Make sure that the linker does not have more than one link which requires to be a relatedParent
        if (linkToParentEntity != null) {
          throw new Error(ErrorMessage.ODATA_CREATE_RELATED_ENTITY_NOT_ALLOWED);
        } else {
          linkToParentEntity = link;
        }
      }
    }
    return linkToParentEntity;
  }
}
