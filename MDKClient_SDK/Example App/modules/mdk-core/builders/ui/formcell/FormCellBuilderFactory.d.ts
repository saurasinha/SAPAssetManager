import { BaseControlDefinition } from '../../../definitions/controls/BaseControlDefinition';
import { FormCellDataBuilder } from './FormCellDataBuilder';
import { IContext } from '../../../context/IContext';
export declare class FormCellBuilderFactory {
    static Create(context: IContext, definition: BaseControlDefinition): FormCellDataBuilder;
}
