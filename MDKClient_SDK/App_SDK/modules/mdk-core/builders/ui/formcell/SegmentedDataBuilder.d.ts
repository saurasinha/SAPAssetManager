import { FormCellCollectionDataBuilder } from './FormCellCollectionDataBuilder';
import { BaseControlDefinition } from '../../../definitions/controls/BaseControlDefinition';
import { IContext } from '../../../context/IContext';
export declare class SegmentedDataBuilder extends FormCellCollectionDataBuilder {
    protected _displayItemKey: string;
    constructor(context: IContext, definition: BaseControlDefinition);
}
