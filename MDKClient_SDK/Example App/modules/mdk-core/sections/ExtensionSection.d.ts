import { BaseSection } from './BaseSection';
import { IMDKViewFacade } from '../IMDKViewFacade';
export declare class ExtensionSection extends BaseSection {
    onPress(cell: any, view: IMDKViewFacade): Promise<any>;
    getView(): any;
    protected _createObservable(): any;
}
