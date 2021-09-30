import { IView } from '../IView';
import { IObservable } from '../observables/IObservable';
import { ContainerDefinition } from '../definitions/ContainerDefinition';
import { IControlProxy } from '../context/IClientAPI';
import { IBuilder } from '../builders/IBuilder';
export declare abstract class IControl extends IView {
    readonly builder: IBuilder;
    abstract observable(): IObservable;
    formatRule(): any;
    container(): ContainerDefinition;
    page(): any;
    getValue(): any;
    abstract setContainer(container: IControl): any;
    abstract setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any>;
    setStyle(cssClassName?: string): void;
    viewIsNative(): boolean;
    setValidationProperty(key: string, value: any): void;
    redraw(): void;
    onDataChanged(action: any, result: any): void;
    readonly controlProxy: IControlProxy;
    readonly isControl: boolean;
    readonly isFormCell: boolean;
    readonly type: string;
}
export declare function isControl(element: IControl): boolean;
