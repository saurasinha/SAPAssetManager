import { BaseControlDefinition } from '../definitions/controls/BaseControlDefinition';
import { IContext } from '../context/IContext';
import { IControl } from '../controls/IControl';
import { Observable } from 'tns-core-modules/data/observable';
import { IObservable } from '../observables/IObservable';
import { Page } from 'tns-core-modules/ui/page';
import { ODataAction } from '../actions/ODataAction';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { ITargetServiceSpecifier } from '../data/ITargetSpecifier';
export declare class BaseObservable extends Observable implements IObservable {
    protected _target: any;
    protected _control: IControl;
    protected _page: Page;
    protected _onValChangedEvent: any;
    protected _dataSubscriptions: any[];
    protected _valueBeforeRuleOrAction: any;
    protected _valueChangedByRuleOrAction: boolean;
    protected _valueChanged: boolean;
    constructor(oControl: IControl, oControlDef: BaseControlDefinition, oPage: Page);
    readonly control: IControl;
    readonly context: IContext;
    readonly isPageVisible: boolean;
    onDataChanged(action: ODataAction, result: any): void;
    redraw(): void;
    unregisterDataListeners(): void;
    bindValue(data: any): Promise<any>;
    getBindingTarget(): string;
    formatValue(value: any): any;
    setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any>;
    getValue(): any;
    readonly debugString: string;
    readonly parent: IControl;
    readonly valueChanged: boolean;
    protected onValueChange(notify: boolean): Promise<any>;
    protected registerDataListeners(oControlDef: any): Promise<any>;
    protected _updateTarget(value: any): Promise<any>;
    protected _resolveRule(value: any): Promise<any>;
    protected _readFromService(service: ITargetServiceSpecifier): Promise<ObservableArray<any>>;
}
export declare abstract class BindingTarget {
    static TEXT: string;
}
