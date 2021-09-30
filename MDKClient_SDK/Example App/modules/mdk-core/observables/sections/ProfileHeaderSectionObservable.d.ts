import { BaseSectionObservable } from './BaseSectionObservable';
export declare class ProfileHeaderSectionObservable extends BaseSectionObservable {
    private static readonly ITEMS_PARAM_KEY;
    private static _descriptionKey;
    private static _detailImageKey;
    private static _headlineKey;
    private static _subheadlineKey;
    private static _activityItemsKey;
    private static _avKey;
    private static _detailImageIsCircular;
    bind(): Promise<Object>;
    getTargetSpecifier(): any;
    protected _resolveData(definition: any): Promise<Object>;
}
