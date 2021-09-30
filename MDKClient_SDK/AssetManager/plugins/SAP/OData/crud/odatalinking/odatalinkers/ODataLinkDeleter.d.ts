import { ODataLinker } from './ODataLinker';
import { ChangeSetManager } from '../../ChangeSetManager';
export declare class ODataLinkDeleter extends ODataLinker {
    constructor(sourceEntitySetName: string, linkingParams: any);
    execute(sourceEntity: any, dataService: any, changeSetManager: ChangeSetManager): any;
    private performLinking;
}
