export declare class MessageDialog {
    static getInstance(): MessageDialog;
    private static _instance;
    private constructor();
    alert(arg: any): Promise<void>;
    confirm(arg: any): Promise<boolean>;
    closeAll(): void;
}
