import { BaseDataBuilder } from '../../BaseDataBuilder';
import { BaseControlDefinition } from '../../../definitions/controls/BaseControlDefinition';
import { IContext } from '../../../context/IContext';
export declare class BaseFormCellDataBuilder extends BaseDataBuilder {
    private _defintion;
    constructor(context: IContext, definition: BaseControlDefinition);
    readonly definition: BaseControlDefinition;
}
