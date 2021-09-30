import { ITargetServiceSpecifier } from './ITargetSpecifier';
export declare class QueryOptions {
    private static FILTER_OPTION_NAME;
    private static ORDERBY_OPTION_NAME;
    private static SKIP_OPTION_NAME;
    private static TOP_OPTION_NAME;
    private _queryOptions;
    private _searchKeys;
    constructor(queryString?: string);
    addFilter(filter: string): void;
    addOrderBy(orderBy: string): void;
    setOrderBy(orderBy: string): void;
    addSearchQuery(searchKey: string, searchString: string): void;
    getQueryString(service: ITargetServiceSpecifier): string;
    getFilter(): string;
    getOrderBy(): string;
    getTop(): number;
    getSkip(): number;
    setFilter(filter: string): void;
    setSkip(skip: number): void;
    setTop(top: number): void;
    usesFilter(): boolean;
    usesOrderBy(): boolean;
    usesTop(): boolean;
    usesSkip(): boolean;
    private _createFilterOption;
    private _usesSearch;
    private _encodeQueryString;
}
