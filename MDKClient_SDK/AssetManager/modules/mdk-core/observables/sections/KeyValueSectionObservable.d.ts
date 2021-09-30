import { BaseCollectionSectionObservable } from './BaseCollectionSectionObservable';
import { BaseSection } from '../../sections/BaseSection';
export declare class KeyValueSectionObservable extends BaseCollectionSectionObservable {
    private _keyValuesParamKey;
    private _keyValueKeyParam;
    private _keyValueValueParam;
    private _keyValueVisibleParam;
    private _keyValueOnPressParam;
    private _keyValueLinkColorParam;
    private _boundItems;
    constructor(section: BaseSection);
    bind(): Promise<Object>;
    getBoundData(row: number): any;
    onPress(row: number): Promise<any>;
    protected isSectionEmpty(): boolean;
    protected _filterCells(items: Array<Object>): Array<Object>;
    protected _definitionUsesStaticCells(): boolean;
    private _bindKeyValues;
}
