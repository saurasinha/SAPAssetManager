import { device as Device } from 'tns-core-modules/platform';
import * as utils from 'tns-core-modules/utils/utils';
import * as application from 'tns-core-modules/application';
import { DataConverter } from '../Common/DataConverter';
import { CommonUtil } from '../ErrorHandling/CommonUtil';

declare var com;

export class PushNotification {
  public static getInstance(): PushNotification {
    return PushNotification._instance;
  }
  public static onNewIntent(intent: any) {
    const extras = intent.getExtras();
    if (extras) {
      const msgId = extras.get('google.message_id');
      if (msgId) {
        let payload = {
          data: {},
        };
        let it = extras.keySet().iterator();
        while (it.hasNext()) {
            let key = it.next();
            switch (key) {
              case 'google.sent_time':
              case 'google.ttl':
              case 'from':
              case 'google.message_id':
              case 'google.priority':
              case 'collapse_key':
                const val = extras.get(key);
                if (typeof val === 'object') {
                  payload[key] = val.toString();
                } else {
                  payload[key] = val;
                }
                break;
              default:
                payload.data[key] = extras.get(key);
            }
        }
        let eventData = {
          eventName: 'receiveNotificationResponseEvent',
          object: {
            actionIdentifier: 'android.DefaultAction',
            completionHandler: (result) => {
              // To remain compatible with iOS
            },
            payload,
          },
        };
        PushNotification._unifyEventData(eventData);
        application.notify(eventData);
      }
    }
  };
  private static _instance: PushNotification = new PushNotification();
  private static _unifyEventData(eventData: any) {
    let payload = eventData.object.payload;
    // unify badge and data
    if (payload.data && payload.data.badge) {
      let badge: any = payload.data.badge;
      if (!isNaN(badge)) {
        badge = parseInt(badge, 10);
      }
      eventData.object.badge = badge;
    }
    if (payload.data && typeof payload.data.data === 'string') {
      try {
        eventData.object.data = JSON.parse(payload.data.data);
      } catch (e) {
        // conver single quote to double quote, and try again
        let sData = payload.data.data.replace(/'/g, '"');
        try {
          eventData.object.data = JSON.parse(sData);
        } catch (e) {
          eventData.object.data = payload.data.data;
        }
      }
    }
  }
  private _interop = com.sap.mdk.client.foundation.push.PushNotificationBridge.getInstance();
  private _eventCallback = new com.sap.mdk.client.foundation.push.IEventCallback({
    onMessage: (message) => {
      const sentTime = '' + message.getSentTime();  // long to string
      const ttl = '' + message.getTtl();   // int to string
      const from = message.getFrom();
      const messageId = message.getMessageId();
      const priority = this.getPriorityName(message.getPriority());
      const collapseKey = message.getCollapseKey();

      const data = message.getData();
      const notification = message.getNotification();
      if (!notification) {
        let eventData = {
          eventName: 'contentAvailableEvent',
          object: {
            FetchResult: {
              Failed: 2,
              NewData: 0,
              NoData: 1,
            },
            completionHandler: (result) => { 
              // To remain compatible with iOS
            },
            payload: {
              'collapse_key': collapseKey,
              'data': DataConverter.toJavaScriptObject(data),
              'google.from': from,
              'google.message_id': messageId,
              'google.priority': priority,
              'google.sent_time': sentTime,
              'google.ttl': ttl,
            },
          },
        };
        PushNotification._unifyEventData(eventData);
        application.notify(eventData);
      } else {
        const title = notification.getTitle();
        const body = notification.getBody();
        const titleLocKey = notification.getTitleLocalizationKey();
        const titleLocArgs = notification.getTitleLocalizationArgs();
        const bodyLocKey = notification.getBodyLocalizationKey();
        const bodyLocArgs = notification.getBodyLocalizationArgs();
        const icon = notification.getIcon();
        const sound = notification.getSound();
        const activity = application.android.foregroundActivity;
        let eventData = {
          eventName: 'foregroundNotificationEvent',
          object: {
            PresentationOptions: {
              Alert: 4,
              All: 7,
              Badge: 1,
              None: 0,
              Sound: 2,
            },
            body,
            completionHandler: (result) => {
              // purposely do nothing
              // return value of foregroundNotificationEvent
            },
            payload: {
              'collapse_key': collapseKey,
              'data': DataConverter.toJavaScriptObject(data),
              'google.from': from,
              'google.message_id': messageId,
              'google.priority': priority,
              'google.sent_time': sentTime,
              'google.ttl': ttl,
              'notification': {
                body,
                bodyLocArgs,
                bodyLocKey,
                icon,
                sound,
                title,
                titleLocArgs,
                titleLocKey,
              },
            },
            title,
          },
        };
        PushNotification._unifyEventData(eventData);
        application.notify(eventData);
      }
    },
  });
  private constructor() {
    if (PushNotification._instance) {
      throw new Error('Error: Instantiation failed. Use getInstance() instead of new.');
    }
    const context = utils.ad.getApplicationContext();
    this._interop.initialize(context);
    application.on(application.resumeEvent, (args) => {
      PushNotification.onNewIntent(args.android.getIntent());
    });
    PushNotification._instance = this;
  }

  public registerForPushNotification(applicationId: string, baseUrl: string, deviceId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let nativeCallback = new com.sap.mdk.client.foundation.IPromiseCallback ({
        onRejected: (code, message, error) => {
          reject(CommonUtil.toJSError(code, message, error));
        },
        onResolve: (result) => {
          // BCP-1970363329: update eventcallback
          this._interop.updateEventCallback(this._eventCallback);
          resolve(result);
        },
      });
      this._interop.registerForPushNotification(
          applicationId, baseUrl, Device.uuid, Device.deviceType, nativeCallback);
    });
  }

  public unregisterForPushNotification(applicationId: string, baseUrl: string, deviceId: string) {
    return new Promise((resolve, reject) => {
      let nativeCallback = new com.sap.mdk.client.foundation.IPromiseCallback ({
        onRejected: (code, message, error) => {
          reject(CommonUtil.toJSError(code, message, error));
        },
        onResolve: (result) => {
          // Disable eventcallback on unregister
          this._interop.updateEventCallback(null);
          resolve(result);
        },
      });
      this._interop.unregisterForPushNotification(
        applicationId, baseUrl, Device.uuid, Device.deviceType, nativeCallback);
    }); 
  }

  private getPriorityName(p) {
    switch (p) {
      case 1:
        return 'high';
      case 2:
        return 'normal';
      case 0:
      default:
        return 'unknown';
    }
  }
};
