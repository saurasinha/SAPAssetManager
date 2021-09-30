export declare class BarcodeScanner {
    static getInstance(): BarcodeScanner;
    private static _instance;
    private _bridge;
    createCallback(callback: any): any;
    open(params: any, callback: any): void;
    checkPrerequisite(params: any, callback: any): void;
}
