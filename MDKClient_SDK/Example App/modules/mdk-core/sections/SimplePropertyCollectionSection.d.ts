import { BaseSection } from './BaseSection';
import { SimplePropertyCollectionSectionObservable } from '../observables/sections/SimplePropertyCollectionSectionObservable';
import { IMDKViewFacade } from '../IMDKViewFacade';
export declare class SimplePropertyCollectionSection extends BaseSection {
    constructor(props: any);
    onPress(cell: any, viewFacade: IMDKViewFacade): SimplePropertyCollectionSectionObservable;
    protected _createObservable(): any;
}
