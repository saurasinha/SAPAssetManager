import * as frameModule from 'tns-core-modules/ui/frame';
import { IBannerData } from '../BannerMessage/IBannerData';
export declare class Banner {
    static getInstance(): Banner;
    private static _instance;
    private static _phoneMargin;
    private static _tabletMargin;
    private static _minWidth;
    private static _maxWidth;
    private _bannerBridge;
    private constructor();
    dismiss(data?: IBannerData): void;
    prepareToRelocate(): void;
    relocateTo(topFrame: frameModule.Frame, view: any): any;
    display(data: IBannerData, callback: any): void;
    private _getFrame;
    private _displayStandard;
    updateText(message: string, topFrame: frameModule.Frame): void;
    private createCallback;
}
