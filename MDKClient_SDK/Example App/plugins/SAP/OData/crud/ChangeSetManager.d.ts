export declare class ChangeSetManager {
    static UNPROCESSEDPREFIX: string;
    static isPending(entity: any): boolean;
    private pendingChangeSet;
    private pendingEntityReadLinkOrdinalSuffix;
    private service;
    constructor(dataService: any);
    beginChangeSet(): void;
    cancelChangeSet(): void;
    commitChangeSet(): Promise<void>;
    createEntity(entity: any, headers: any, requestOptions: any): Promise<any>;
    createRelatedEntity(entity: any, parentEntity: any, parentNavProp: any, headers: any, requestOptions: any): Promise<any>;
    updateEntity(entity: any, headers: any, requestOptions: any): Promise<any>;
    deleteEntity(entity: any, headers: any, requestOptions: any): Promise<any>;
    pendingEntityFromPendingChangeSet(readLink: string): any;
    private processBatchWithChangeSet;
}
