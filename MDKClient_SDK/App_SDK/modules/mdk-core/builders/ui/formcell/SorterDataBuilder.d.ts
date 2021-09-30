import { FilterDataBuilder } from './FilterDataBuilder';
import { BaseControlDefinition } from '../../../definitions/controls/BaseControlDefinition';
import { IContext } from '../../../context/IContext';
export declare class SorterDataBuilder extends FilterDataBuilder {
    protected _displayItemKey: string;
    constructor(context: IContext, definition: BaseControlDefinition);
}
