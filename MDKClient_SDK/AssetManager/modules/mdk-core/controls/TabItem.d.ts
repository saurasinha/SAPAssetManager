import { BaseControl } from './BaseControl';
import { IControlData } from './IControlData';
import { TabStripItem } from 'tns-core-modules/ui/tab-navigation-base/tab-strip-item';
import { TabItemDefinition } from '../definitions/controls/TabItemDefinition';
import { TabItemObservable } from '../observables/TabItemObservable';
export declare class TabItem extends BaseControl {
    private tabItemView;
    private _name;
    private _index;
    private _imageHeight;
    private _imageWidth;
    private _imageFontIconClassName;
    constructor();
    readonly isBindable: boolean;
    initialize(controlData: IControlData): void;
    view(): TabStripItem;
    readonly name: string;
    readonly index: number;
    readonly enabled: boolean;
    readonly caption: string;
    readonly visibility: any;
    createTabItem(itemDef: TabItemDefinition, itemIndex: number): Promise<any>;
    protected createObservable(): TabItemObservable;
}
