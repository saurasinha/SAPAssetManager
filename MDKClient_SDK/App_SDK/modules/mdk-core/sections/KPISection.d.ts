import { BaseSection } from './BaseSection';
export declare class KPISection extends BaseSection {
    constructor(props: any);
    onItemPress(item: any): Promise<any>;
    onPress(cell: any, viewFacade: any): void;
    protected _createObservable(): any;
}
