import { BaseObservable } from './BaseObservable';
import { Context } from '../context/Context';
export declare class ObjectCellObservable extends BaseObservable {
    bind(fromValue: any, context: Context, bTwoWay: any): Promise<void>;
    protected formatValueInParams(): any;
}
