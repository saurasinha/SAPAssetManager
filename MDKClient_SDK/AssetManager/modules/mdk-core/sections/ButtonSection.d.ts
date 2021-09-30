import { BaseSection } from './BaseSection';
import { ButtonSectionObservable } from '../observables/sections/ButtonSectionObservable';
import { IMDKViewFacade } from '../IMDKViewFacade';
export declare class ButtonSection extends BaseSection {
    onPress(cell: any, viewFacade: IMDKViewFacade): ButtonSectionObservable;
    protected _createObservable(): any;
}
