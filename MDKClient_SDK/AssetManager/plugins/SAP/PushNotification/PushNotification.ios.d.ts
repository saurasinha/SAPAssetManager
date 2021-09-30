export declare class PushNotification {
    static getInstance(): PushNotification;
    static onNewIntent(intent: any): void;
    private static _instance;
    private pushNotificationBridge;
    private constructor();
    registerForPushNotification(applicationId: string, baseUrlString: string, deviceId: string): Promise<any>;
    didRegisterForRemoteNotifications(deviceToken: NSData): void;
    didFailToRegisterNotifications(error: NSError): void;
    unregisterForPushNotification(applicationId: string, baseUrlString: string, deviceId: string): Promise<unknown>;
}
