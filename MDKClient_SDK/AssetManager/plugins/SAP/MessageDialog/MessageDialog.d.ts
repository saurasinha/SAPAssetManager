export declare class MessageDialog {
    static getInstance(): MessageDialog;
    private static _instance;
    alert(arg: any): Promise<void>;
    confirm(arg: any): Promise<boolean>;
    setScreenSharing(screenSharing: boolean): void;
    closeAll(): void;
}
