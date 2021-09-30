import { ODataLinker } from './ODataLinker';
import { ODataCrudOperation } from '../../BaseODataCruder';
import { ChangeSetManager } from '../../ChangeSetManager';
export declare class ODataLinkCreator extends ODataLinker {
    constructor(sourceEntitySetName: string, linkingParams: any, operation?: ODataCrudOperation);
    execute(sourceEntity: any, dataService: any, changeSetManager: ChangeSetManager, canUseCreateRelatedEntity?: boolean): any;
    isTargetCreatedInSameChangeSet(): boolean;
    private performLinking;
}
