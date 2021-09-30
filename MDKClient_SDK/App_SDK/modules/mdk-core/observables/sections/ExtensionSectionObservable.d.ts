import { BaseSectionObservable } from './BaseSectionObservable';
export declare class ExtensionSectionObservable extends BaseSectionObservable {
    private _heightParamKey;
    bind(): Promise<Object>;
    protected _resolveData(definition: any): Promise<Object>;
}
