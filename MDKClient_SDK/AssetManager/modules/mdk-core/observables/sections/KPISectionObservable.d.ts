import { KPIHeaderSectionObservable } from './KPIHeaderSectionObservable';
export declare class KPISectionObservable extends KPIHeaderSectionObservable {
    bind(): Promise<Object>;
    onItemPress(item: any): Promise<any>;
}
