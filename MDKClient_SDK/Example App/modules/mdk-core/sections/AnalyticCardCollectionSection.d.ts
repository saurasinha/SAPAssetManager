import { BaseSection } from './BaseSection';
export declare class AnalyticCardCollectionSection extends BaseSection {
    getBoundData(row: any): any;
    loadMoreItems(): void;
    onPress(analyticCard: any): Promise<any>;
    protected _createObservable(): any;
}
