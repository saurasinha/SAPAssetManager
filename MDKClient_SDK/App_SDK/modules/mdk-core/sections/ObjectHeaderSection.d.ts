import { IView } from '../IView';
import { HeaderSection } from './HeaderSection';
export declare class ObjectHeaderSection extends HeaderSection {
    getView(row: any): IView;
    updateProgressBar(visible: boolean): void;
    onAnalyticViewPress(): Promise<any>;
    protected _createObservable(): any;
}
