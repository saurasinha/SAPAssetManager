export declare class PushNotification {
    static getInstance(): PushNotification;
    static onNewIntent(intent: any): void;
    private static _instance;
    private constructor();
    registerForPushNotification(applicationId: string, baseUrlString: string, deviceId: string): Promise<any>;
    didRegisterForRemoteNotifications(deviceToken: any): void;
    didFailToRegisterNotifications(error: any): void;
    unregisterForPushNotification(applicationId: string, baseUrlString: string, deviceId: string): Promise<any>;
}
