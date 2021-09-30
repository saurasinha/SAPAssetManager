import { IBuilder } from '../builders/IBuilder';
import { IFormCellCallback } from '../controls/formCell/IFormCellCallback';
import { BaseObservable } from './BaseObservable';
import { IControl } from '../controls/IControl';
import { BaseControlDefinition } from '../definitions/controls/BaseControlDefinition';
import { Page } from 'tns-core-modules/ui/page';
export declare class BaseFormCellObservable extends BaseObservable implements IFormCellCallback {
    readonly builder: IBuilder;
    readonly searchString: string;
    constructor(oControl: IControl, oControlDef: BaseControlDefinition, oPage: Page);
    bindValue(data: any): Promise<any>;
    cellValueChange(newValue: Map<String, any>): Promise<any>;
    loadMoreItems(): void;
    searchUpdated(searchText: string): void;
    setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any>;
    getTargetSpecifier(): any;
    setTargetSpecifier(specifier: any): Promise<any>;
    setEditable(isEditable: boolean): void;
    setStyle(style: string, target: string): void;
    setValidationProperties(validationProperties: any): void;
}
