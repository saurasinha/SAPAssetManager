import { IDebuggable } from '../utils/IDebuggable';
import { ODataAction } from '../actions/ODataAction';
export declare class DataEventHandler {
    static getInstance(): DataEventHandler;
    private static instance;
    private _listeners;
    private _changeSetActive;
    private _resultQueue;
    constructor();
    publish(action: ODataAction, result: any, notificationRegistry?: Set<IDataEventListener>): void;
    subscribe(key: string, listener: IDataEventListener): void;
    unsubscribe(key: string, listener: IDataEventListener): void;
    activateChangesetQueue(): void;
    resetChangesetQueue(): void;
    publishChangesetResults(): void;
    private notifyListenerHelper;
    private publishListenerForReadLink;
    private _debugDump;
}
export interface IDataEventListener extends IDebuggable {
    onDataChanged(action: ODataAction, result: any): any;
    redraw(): void;
}
