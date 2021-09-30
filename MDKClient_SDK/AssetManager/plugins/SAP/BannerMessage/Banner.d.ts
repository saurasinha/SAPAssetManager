import { IBannerData } from './IBannerData';
import * as frameModule from 'tns-core-modules/ui/frame';
export declare class Banner {
    static getInstance(): Banner;
    display(data: IBannerData, callback: any): void;
    dismiss(data?: IBannerData): void;
    prepareToRelocate(): void;
    relocateTo(topFrame: frameModule.Frame, view: any): void;
    updateText(message: string, topFrame: frameModule.Frame): void;
}
