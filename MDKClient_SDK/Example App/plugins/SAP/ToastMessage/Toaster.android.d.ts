import { IBannerData } from '../BannerMessage/IBannerData';
export declare class Toaster {
    static getInstance(): Toaster;
    private static _instance;
    private static _phoneMargin;
    private static _tabletMargin;
    private static _minWidth;
    private static _maxWidth;
    private _isShowing;
    private _data;
    private _timeAtShowing;
    private _toastBridge;
    private constructor();
    dismiss(data?: IBannerData): void;
    display(data: any): any;
    relocate(frame: any, bottomOffset: number): void;
}
