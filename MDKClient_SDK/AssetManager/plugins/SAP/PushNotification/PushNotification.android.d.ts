export declare class PushNotification {
    static getInstance(): PushNotification;
    static onNewIntent(intent: any): void;
    private static _instance;
    private static _unifyEventData;
    private _interop;
    private _eventCallback;
    private constructor();
    registerForPushNotification(applicationId: string, baseUrl: string, deviceId: string): Promise<any>;
    unregisterForPushNotification(applicationId: string, baseUrl: string, deviceId: string): Promise<unknown>;
    private getPriorityName;
}
