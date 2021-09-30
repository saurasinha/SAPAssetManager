export declare class BarcodeScanner {
    static getInstance(): BarcodeScanner;
    private static _instance;
    private _barcodeScannerBridge;
    open(params: any, callback: any): void;
    checkPrerequisite(params: any, callback: any): void;
}
