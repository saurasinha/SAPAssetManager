import { FormCellDataBuilder } from './FormCellDataBuilder';
import { IContext } from '../../../context/IContext';
import { BaseControlDefinition } from '../../../definitions/controls/BaseControlDefinition';
export declare class DurationDataBuilder extends FormCellDataBuilder {
    constructor(context: IContext, definition: BaseControlDefinition);
    readonly originalUnit: any;
    setOriginalUnit(defUnit: any): this;
    setUnit(unit: string): this;
}
