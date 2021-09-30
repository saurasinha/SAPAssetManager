import { IContext } from './IContext';
export interface IIndexable {
    length: number;
    getItem(index: number): any;
}
export declare function ContextToIndexable(context: IContext): IIndexable;
