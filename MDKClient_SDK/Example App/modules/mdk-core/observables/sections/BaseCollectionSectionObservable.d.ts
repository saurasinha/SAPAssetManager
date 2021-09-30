import { BaseSectionObservable } from './BaseSectionObservable';
export declare abstract class BaseCollectionSectionObservable extends BaseSectionObservable {
    protected _bindValues(bindingObject: any, definition: any): Promise<any>;
    protected _resolveLayout(sectionParameters: any): Promise<any>;
}
