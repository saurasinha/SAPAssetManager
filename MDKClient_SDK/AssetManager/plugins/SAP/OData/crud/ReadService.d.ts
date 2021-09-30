import { ChangeSetManager } from './ChangeSetManager';
import { ReadParams } from './readparams/ReadParams';
export declare class ReadService {
    static entityFromParams(readParams: ReadParams, dataService: any, changeSetManager: ChangeSetManager): any;
    static entitiesFromParams(readParams: ReadParams, dataService: any, changeSetManager: ChangeSetManager): any;
    private static entityFromReadLinkReadParams;
    private static loadEntity;
    private static entitiesFromReadLinkReadParams;
    private static entityFromQueryOptions;
    private static entitiesFromQueryOptions;
    private static getEntityValueList;
    private static createQuery;
}
