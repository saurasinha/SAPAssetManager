import { FormCellDataBuilder } from './FormCellDataBuilder';
import { BaseControlDefinition } from '../../../definitions/controls/BaseControlDefinition';
import { IContext } from '../../../context/IContext';
export declare class TitleDataBuilder extends FormCellDataBuilder {
    constructor(context: IContext, definition: BaseControlDefinition);
    setPlaceHolder(placeHolder: string): this;
}
