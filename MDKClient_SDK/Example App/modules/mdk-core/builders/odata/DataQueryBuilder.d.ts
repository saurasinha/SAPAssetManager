import { BaseDataBuilder } from '../BaseDataBuilder';
import { IContext } from '../../context/IContext';
import { IDebuggable } from '../../utils/IDebuggable';
export declare enum SortOrder {
    Ascending = "asc",
    Descending = "desc"
}
declare type FilterTerm = (FilterBuilder | string);
interface IFilterTerm {
    group: FilterTerm[];
    op: string;
    property: string;
    rhs: string;
}
export declare class FilterBuilder extends BaseDataBuilder implements IDebuggable {
    private static _filterTerm;
    private _terms;
    constructor(context: IContext, ...terms: FilterTerm[]);
    readonly terms: IFilterTerm[];
    readonly debugString: string;
    and(...terms: FilterTerm[]): this;
    equal(property: string, rhs: any): this;
    greaterThan(property: string, rhs: any): this;
    lessThan(property: string, rhs: any): this;
    lessThanOrEqual(property: string, rhs: any): this;
    not(...terms: FilterTerm[]): this;
    notEqual(property: string, rhs: any): this;
    or(...terms: FilterTerm[]): this;
    build(): Promise<any>;
    protected createFilterTerm(term: any): string;
    private beginGroupTerm;
    private endGroupTerm;
    private addTerm;
    private createTerm;
    private ensureTerms;
    private composeFilterString;
}
export declare class MDKSearchBuilder extends FilterBuilder {
    private _searchString;
    private _searchKeys;
    private _subStrings;
    constructor(context: IContext, terms: FilterTerm[], searchString: string);
    readonly debugString: string;
    build(): Promise<any>;
    private readonly searchContext;
}
export declare class DataQueryBuilder extends BaseDataBuilder implements IDebuggable {
    static systemQueryOptions: {
        Expand: string;
        Filter: string;
        OrderBy: string;
        Select: string;
        Skip: string;
        Top: string;
    };
    private _expandOption;
    private _filterOption;
    private _mdkSearch;
    private _orderByOption;
    private _originalQueryOptions;
    private _selectOption;
    private _skipOption;
    private _topOption;
    private _skipTokenOption;
    constructor(context: IContext, queryOptions?: string);
    readonly expandOption: string[];
    readonly filterOption: FilterBuilder;
    readonly orderByOption: string[];
    readonly originalQueryOptions: Object;
    readonly selectOption: string[];
    readonly skipOption: (number | string);
    readonly skipTokenOption: string;
    readonly topOption: (number | string);
    readonly userFilter: string;
    readonly userOrderBy: string;
    readonly hasExpand: boolean;
    readonly hasFilter: boolean;
    readonly hasMDKSearch: boolean;
    readonly hasOrderBy: boolean;
    readonly hasSelect: boolean;
    readonly hasSkip: boolean;
    readonly hasSkipToken: boolean;
    readonly hasTop: boolean;
    readonly debugString: string;
    build(): Promise<any>;
    expand(...expandOptions: string[]): this;
    filter(...terms: FilterTerm[]): FilterBuilder;
    filterTerm(...terms: FilterTerm[]): FilterBuilder;
    mdkSearch(searchString: string): MDKSearchBuilder;
    orderBy(...orderByOptions: string[]): this;
    select(...selectOptions: string[]): this;
    skip(skip: number | string): this;
    skipToken(skipToken: string): this;
    top(top: number | string): this;
    updateQueryOptionsForUniqueRecord(): this;
    private encodeQueryString;
    private readonly searchContext;
    private _parseQueryOptions;
}
export {};
