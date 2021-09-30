import { BaseNoPagingSectionObservable } from './BaseNoPagingSectionObservable';
import { ImageCollectionSectionDefinition } from '../../definitions/sections/ImageCollectionSectionDefinition';
export declare class ImageCollectionSectionObservable extends BaseNoPagingSectionObservable {
    private _titleParamKey;
    private _subtitleParamKey;
    private _attributeParamKey;
    private _imageParamKey;
    private _imageIsCircularParamKey;
    onPress(cell: any): Promise<any>;
    protected readonly genericCellAggregationPropertyName: string;
    protected readonly genericCellPropertyName: string;
    protected readonly genericSectionDefinitionClass: typeof ImageCollectionSectionDefinition;
    protected _keyToItemKey(key: string): string;
    protected _filterCells(items: Array<Object>): Array<Object>;
}
