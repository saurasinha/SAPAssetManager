import { BaseObservable } from './BaseObservable';
import { IControl } from '../controls/IControl';
import { TabItemDefinition } from '../definitions/controls/TabItemDefinition';
import { Page } from 'tns-core-modules/ui/page';
export declare class TabItemObservable extends BaseObservable {
    constructor(oControl: IControl, oControlDef: TabItemDefinition, oPage: Page);
    getBindingTarget(): string;
}
