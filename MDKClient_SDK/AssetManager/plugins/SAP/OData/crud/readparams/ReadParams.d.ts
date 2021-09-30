export declare class ReadParams {
    private entitySetName;
    constructor(entitySetName: string);
    getEntitySetName(): string;
    isTargetCreatedInSameChangeSet(): boolean;
}
