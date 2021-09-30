import { SearchDataBuilder } from './SearchDataBuilder';
import { BaseControlDefinition } from '../../../definitions/controls/BaseControlDefinition';
import { IContext } from '../../../context/IContext';
export declare abstract class FormCellCollectionDataBuilder extends SearchDataBuilder {
    protected abstract _displayItemKey: any;
    constructor(context: IContext, definition: BaseControlDefinition);
    setDisplayedItems(items: any[]): FormCellCollectionDataBuilder;
    setSelectedItems(items: any[]): FormCellCollectionDataBuilder;
}
