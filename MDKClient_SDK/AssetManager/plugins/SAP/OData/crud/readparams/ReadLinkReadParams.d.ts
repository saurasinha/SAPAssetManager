import { ReadParams } from './ReadParams';
export declare class ReadLinkReadParams extends ReadParams {
    private readLink;
    constructor(entitySetName: string, readLink: string);
    getReadLink(): string;
    isTargetCreatedInSameChangeSet(): boolean;
}
