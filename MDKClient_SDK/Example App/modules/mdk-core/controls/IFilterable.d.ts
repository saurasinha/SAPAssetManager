export interface IFilterable {
    getSorterCriteria(name: string): FilterCriteria;
    getFilterCriteria(name: string, values: Array<object>, isArrayFilterProperty?: boolean): FilterCriteria;
    setFilterResult(result: Array<FilterCriteria>): any;
    getSelectedValues(): Array<FilterCriteria>;
}
export declare enum FilterType {
    Filter = 1,
    Sorter = 2
}
export declare class FilterActionResult {
    private _filter;
    private _sorter;
    constructor(filter: string, sorter: string);
    readonly filter: string;
    readonly sorter: string;
}
export declare class FilterCriteria {
    private _type;
    private _name;
    private _filterItems;
    private _caption;
    private _isArrayFilterProperty;
    constructor(type: FilterType, name: string, caption: string, filterItems: Array<object>, isArrayFilterProperty?: boolean);
    isFilter(): boolean;
    isSorter(): boolean;
    readonly name: string;
    readonly caption: string;
    readonly filterItems: Array<object>;
    readonly isArrayFilterProperty: boolean;
}
