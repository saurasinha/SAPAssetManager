import { BaseSectionObservable } from './BaseSectionObservable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
export declare class ChartContentSectionObservable extends BaseSectionObservable {
    private static readonly ITEMS_PARAM_KEY;
    private _data;
    bind(): Promise<Object>;
    getTargetSpecifier(): any;
    protected _resolveData(definition: any): Promise<ObservableArray<any>>;
}
