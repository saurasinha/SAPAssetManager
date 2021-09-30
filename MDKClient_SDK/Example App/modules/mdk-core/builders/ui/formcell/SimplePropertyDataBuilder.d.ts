import { FormCellDataBuilder } from './FormCellDataBuilder';
import { BaseControlDefinition } from '../../../definitions/controls/BaseControlDefinition';
import { IContext } from '../../../context/IContext';
export declare class SimplePropertyDataBuilder extends FormCellDataBuilder {
    constructor(context: IContext, definition: BaseControlDefinition);
    setKeyName(keyName: string): this;
}
