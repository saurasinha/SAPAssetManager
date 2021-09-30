export declare class Toaster {
    static getInstance(): Toaster;
    private static _instance;
    private toasterBridge;
    private constructor();
    display(params: any): void;
    relocate(frame: any, bottomOffset: number): void;
}
