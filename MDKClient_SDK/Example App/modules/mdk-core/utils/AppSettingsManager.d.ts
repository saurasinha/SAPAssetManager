export declare class AppSettingsManager {
    static changeType: {
        BooleanChanged: string;
        KeyRemoved: string;
        StringChanged: string;
    };
    static pendingType: {
        Download: string;
    };
    static instance(): AppSettingsManager;
    private static _instance;
    private static _pendingActionsKey;
    private static _secureDataMovedKey;
    private static _isSecureDataMoved;
    private static _secureAppSettings;
    private _listeners;
    constructor();
    addPendingAction(key: string, page: string, type?: string, data?: string, clear?: boolean): void;
    addPendingDownload(key: string, page: string, value?: string, clear?: boolean): void;
    getPendingDataForPage(page: string): any;
    getPendingDataForKey(key: string): any;
    hasPendingActionForKey(key: string): boolean;
    hasPendingActionForPage(page: string): boolean;
    hasSubscriber(key: string): boolean;
    removePendingAction(removeKey: string): void;
    removePendingActions(): void;
    subscribe(key: string, handler: IAppSettingChangeListener): void;
    unsubscribe(key: string, handler: IAppSettingChangeListener): void;
    moveSecureData(): void;
    remove(key: string): void;
    setString(key: string, value: string): void;
    getString(key: string, defaultValue?: string): string;
    setNumber(key: string, value: number): void;
    getNumber(key: string, defaultValue?: number): number;
    setBoolean(key: string, value: boolean): void;
    getBoolean(key: string, defaultValue?: boolean): boolean;
    private _getPendingData;
    private _getString;
    private _getPendingActions;
    private _hasKey;
    private _publishChange;
    private _remove;
    private _removeAndPublish;
    private _setString;
    private _setStringAndPublish;
    private _updatePendingActions;
    private _isKeySecure;
}
export interface IAppSettingChangeListener {
    onAppSettingChange(key: string, type: string, value?: any): any;
}
