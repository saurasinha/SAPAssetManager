import { ODataLinker } from './ODataLinker';
import { LinkingScenario } from '../odatalinks/LinkingScenario';
import { ODataCrudOperation } from '../../BaseODataCruder';
import { ChangeSetManager } from '../../ChangeSetManager';
import { ErrorMessage } from '../../../../ErrorHandling/ErrorMessage';

export class ODataLinkDeleter extends ODataLinker {
  public constructor(sourceEntitySetName: string, linkingParams: any) {
    super(sourceEntitySetName, linkingParams, ODataCrudOperation.Delete);
  }

  public execute(sourceEntity: any, dataService: any, changeSetManager: ChangeSetManager): any {
    if (dataService != null) {
      super.execute(sourceEntity, dataService, changeSetManager);
      this.performLinking(sourceEntity, dataService.getProvider().getServiceOptions().getSupportsBind());
    } else {
      throw new Error(ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE);
    }
  }

  private performLinking(sourceEntity: any, supportsBind: boolean): void {
    for (let target of this.targets) {
      let scenario = new LinkingScenario(this.navigationProperty, sourceEntity, target, this.operation, 
        false, supportsBind);
      scenario.execute();
    }
  }
}
