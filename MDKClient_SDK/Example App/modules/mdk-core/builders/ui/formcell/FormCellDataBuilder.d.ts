import { BaseDataBuilder } from '../../BaseDataBuilder';
import { BaseFormCellDataBuilder } from './BaseFormCellDataBuilder';
import { BaseControlDefinition } from '../../../definitions/controls/BaseControlDefinition';
import { IContext } from '../../../context/IContext';
export declare class ValidationPropertiesBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    setMessage(message: string): this;
    setMessageColor(color: string): this;
    setSeparatorBackgroundColor(color: string): this;
    setSeparatorIsHidden(state: boolean): this;
    setValidationViewBackgroundColor(color: string): this;
    setValidationViewIsHidden(state: boolean): this;
}
export declare class FormCellDataBuilder extends BaseFormCellDataBuilder {
    protected _builtData: any;
    protected _checksum: any;
    constructor(context: IContext, definition: BaseControlDefinition);
    build(): Promise<any>;
    fromJSON(definition: BaseControlDefinition): this;
    setCaption(caption: string): this;
    setEditable(state: boolean): this;
    setOnValueChange(handler: string): this;
    setName(name: string): this;
    setStyle(style: string, target: string): this;
    setValue(value: any): this;
    setBuildDataPropertyValue(prop: string, value: any): this;
    setValidationProperties(validationProperties: any): this;
    setVisible(state: boolean): this;
    readonly builtData: any;
    readonly validationProperties: ValidationPropertiesBuilder;
}
