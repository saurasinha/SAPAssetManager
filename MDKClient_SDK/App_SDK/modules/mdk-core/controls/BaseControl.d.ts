import { IControl } from './IControl';
import { IControlData } from './IControlData';
import { BaseObservable } from '../observables/BaseObservable';
export declare class BaseControl extends IControl {
    protected _parent: IControl;
    private _observable;
    private _view;
    readonly isBindable: boolean;
    parent: IControl;
    bind(): Promise<any>;
    initialize(controlData: IControlData): void;
    setContainer(container: IControl): void;
    getContainer(): IControl;
    setView(view: any): void;
    view(): any;
    observable(): BaseObservable;
    setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any>;
    onPageUnloaded(pageExists: boolean): void;
    readonly binding: any;
    protected createObservable(): BaseObservable;
}
