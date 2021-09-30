import { CommonUtil } from '../ErrorHandling/CommonUtil';

declare var PushNotificationBridge: any;

export class PushNotification {
  public static getInstance(): PushNotification {
    return PushNotification._instance;
  }
  public static onNewIntent(intent: any) {
    // do nothing
  }

  private static _instance: PushNotification = new PushNotification();
  private pushNotificationBridge = PushNotificationBridge.new();

  private constructor() {
    if (PushNotification._instance) {
      throw new Error('Error: Instantiation failed. Use getInstance() instead of new.');
    }
    PushNotification._instance = this;
  }

  public registerForPushNotification(applicationId: string, baseUrlString: string, deviceId: string): Promise<any> {
    let baseUrl = NSURL.URLWithString(baseUrlString);
    return new Promise((resolve, reject) => {
      this.pushNotificationBridge.registerForPushNotificationResolveReject(applicationId, baseUrl, deviceId, 
        (id) => { resolve(id); },
        (code, message, error) => { reject(CommonUtil.toJSError(code, message, error)); });
    });    
  }

  public didRegisterForRemoteNotifications(deviceToken: NSData) {
    this.pushNotificationBridge.didRegisterForRemoteNotifications(deviceToken);
  }

  public didFailToRegisterNotifications(error: NSError) {
    this.pushNotificationBridge.didFailToRegisterNotifications(error);
  }

  public unregisterForPushNotification(applicationId: string, baseUrlString: string, deviceId: string) {
    let baseUrl = NSURL.URLWithString(baseUrlString);    
    return new Promise((resolve, reject) => {
      this.pushNotificationBridge.unregisterForPushNotificationResolveReject(applicationId, baseUrl, deviceId, 
        (id) => { resolve(id); },
        (code, message, error) => { reject(error); });
    }); 
  }
};
