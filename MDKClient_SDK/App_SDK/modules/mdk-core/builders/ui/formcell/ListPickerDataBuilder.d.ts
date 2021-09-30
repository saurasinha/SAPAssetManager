import { FormCellCollectionDataBuilder } from './FormCellCollectionDataBuilder';
import { BaseControlDefinition } from '../../../definitions/controls/BaseControlDefinition';
import { IContext } from '../../../context/IContext';
export declare class ListPickerDataBuilder extends FormCellCollectionDataBuilder {
    protected _displayItemKey: string;
    constructor(context: IContext, definition: BaseControlDefinition);
    readonly staticCollection: boolean;
    readonly requiresUniqueIdentifiers: boolean;
    setStaticCollection(state: boolean): this;
    setUniqueIdentifiers(state: boolean): this;
    setUsesObjectCells(state: boolean): this;
    readonly pickerItems: any[];
    readonly isLazyLoadingIndicatorEnabled: boolean;
    readonly pageSize: number;
    readonly allowDefaultValueIfOneItem: boolean;
}
