import { ReadParams } from './ReadParams';
export declare class QueryOptionsReadParams extends ReadParams {
    private queryOptions;
    constructor(entitySetName: string, queryOptions: string);
    getQueryOptions(): string;
}
