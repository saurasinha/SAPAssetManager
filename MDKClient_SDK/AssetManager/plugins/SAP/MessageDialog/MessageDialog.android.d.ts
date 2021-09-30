export * from 'tns-core-modules/ui/dialogs/dialogs-common';
export declare class MessageDialog {
    static getInstance(): MessageDialog;
    private static _instance;
    private _dialogs;
    private _screenSharing;
    private _titleText;
    private _messageText;
    private _buttonStyle;
    private constructor();
    alert(arg: any): Promise<void>;
    confirm(arg: any): Promise<boolean>;
    setScreenSharing(screenSharing: boolean): void;
    closeAll(): void;
    private isString;
    private cleanUpDialogs;
    private createAlertDialog;
    private showDialog;
    private addButtons;
}
