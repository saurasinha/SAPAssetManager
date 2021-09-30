import { HeaderSection } from './HeaderSection';
export declare class KPIHeaderSection extends HeaderSection {
    constructor(props: any);
    onItemPress(item: any): Promise<any>;
    onPress(cell: any, viewFacade: any): void;
    protected _createObservable(): any;
}
