import { FormCellDataBuilder } from './FormCellDataBuilder';
import { BaseControlDefinition } from '../../../definitions/controls/BaseControlDefinition';
import { IContext } from '../../../context/IContext';
export declare class SearchDataBuilder extends FormCellDataBuilder {
    constructor(context: IContext, definition: BaseControlDefinition);
    setBarcodeScanEnabled(isBarcodeScanEnabled: boolean): this;
    setSearchEnabled(isSearchEnabled: boolean): this;
}
