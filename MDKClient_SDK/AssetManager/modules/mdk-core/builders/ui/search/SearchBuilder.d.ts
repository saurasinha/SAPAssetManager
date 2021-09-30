import { ITargetServiceSpecifier } from '../../../data/ITargetSpecifier';
export interface ISearchBuilderData {
    key: string;
    substrings: string[];
}
export interface ISearchBuilder {
    build(): string;
}
declare abstract class BaseSearchBuilder implements ISearchBuilder {
    private _searchKeys;
    protected _serviceName: string;
    constructor(searchKeys: any, serviceName: string);
    build(): string;
    protected escapeSingleQuoteString(str: string): string;
    protected abstract buildSearchString(searches: string[]): string;
    protected abstract buildSearchSubString(substring: string, searchKey: string): string;
}
export declare class OfflineSearchBuilder extends BaseSearchBuilder {
    constructor(searchKeys: any, serviceName: string);
    protected buildSearchString(searches: string[]): string;
    protected buildSearchSubString(searchString: string, searchKey: string): string;
}
export declare class OnlineSearchBuilder extends BaseSearchBuilder {
    constructor(searchKeys: any, serviceName: string);
    protected buildSearchString(searches: string[]): string;
    protected buildSearchSubString(searchString: string, searchKey: string): string;
}
export declare function builderFactory(service: ITargetServiceSpecifier, searchKeys: ISearchBuilderData, serviceName?: string): ISearchBuilder;
export {};
