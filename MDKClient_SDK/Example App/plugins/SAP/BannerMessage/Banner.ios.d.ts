import * as frameModule from 'tns-core-modules/ui/frame';
import { IBannerData } from './IBannerData';
export declare class Banner {
    static getInstance(): Banner;
    private static _instance;
    private bridge;
    private myCallback;
    private constructor();
    display(data: IBannerData, callback: any): void;
    dismiss(data?: IBannerData): void;
    prepareToRelocate(): void;
    updateText(message: string, topFrame: frameModule.Frame): void;
    relocateTo(topFrame: frameModule.Frame, view: any): void;
}
