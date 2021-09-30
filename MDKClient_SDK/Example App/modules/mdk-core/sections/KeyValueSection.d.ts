import { BaseSection } from './BaseSection';
import { IMDKViewFacade } from '../IMDKViewFacade';
export declare class KeyValueSection extends BaseSection {
    constructor(props: any);
    onPress(keyValueRow: any, viewFacade: IMDKViewFacade): Promise<any>;
    protected _createObservable(): any;
}
