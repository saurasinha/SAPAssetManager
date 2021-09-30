import { BaseObservable } from './BaseObservable';
import { IControl } from '../controls/IControl';
import { ToolbarItemDefinition } from '../definitions/controls/ToolbarItemDefinition';
import { Page } from 'tns-core-modules/ui/page';
export declare class ToolbarItemObservable extends BaseObservable {
    constructor(oControl: IControl, oControlDef: ToolbarItemDefinition, oPage: Page);
    getBindingTarget(): string;
}
