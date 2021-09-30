"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = require("tns-core-modules/platform");
var utils = require("tns-core-modules/utils/utils");
var application = require("tns-core-modules/application");
var DataConverter_1 = require("../Common/DataConverter");
var CommonUtil_1 = require("../ErrorHandling/CommonUtil");
var PushNotification = (function () {
    function PushNotification() {
        var _this = this;
        this._interop = com.sap.mdk.client.foundation.push.PushNotificationBridge.getInstance();
        this._eventCallback = new com.sap.mdk.client.foundation.push.IEventCallback({
            onMessage: function (message) {
                var sentTime = '' + message.getSentTime();
                var ttl = '' + message.getTtl();
                var from = message.getFrom();
                var messageId = message.getMessageId();
                var priority = _this.getPriorityName(message.getPriority());
                var collapseKey = message.getCollapseKey();
                var data = message.getData();
                var notification = message.getNotification();
                if (!notification) {
                    var eventData = {
                        eventName: 'contentAvailableEvent',
                        object: {
                            FetchResult: {
                                Failed: 2,
                                NewData: 0,
                                NoData: 1,
                            },
                            completionHandler: function (result) {
                            },
                            payload: {
                                'collapse_key': collapseKey,
                                'data': DataConverter_1.DataConverter.toJavaScriptObject(data),
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
                }
                else {
                    var title = notification.getTitle();
                    var body = notification.getBody();
                    var titleLocKey = notification.getTitleLocalizationKey();
                    var titleLocArgs = notification.getTitleLocalizationArgs();
                    var bodyLocKey = notification.getBodyLocalizationKey();
                    var bodyLocArgs = notification.getBodyLocalizationArgs();
                    var icon = notification.getIcon();
                    var sound = notification.getSound();
                    var activity = application.android.foregroundActivity;
                    var eventData = {
                        eventName: 'foregroundNotificationEvent',
                        object: {
                            PresentationOptions: {
                                Alert: 4,
                                All: 7,
                                Badge: 1,
                                None: 0,
                                Sound: 2,
                            },
                            body: body,
                            completionHandler: function (result) {
                            },
                            payload: {
                                'collapse_key': collapseKey,
                                'data': DataConverter_1.DataConverter.toJavaScriptObject(data),
                                'google.from': from,
                                'google.message_id': messageId,
                                'google.priority': priority,
                                'google.sent_time': sentTime,
                                'google.ttl': ttl,
                                'notification': {
                                    body: body,
                                    bodyLocArgs: bodyLocArgs,
                                    bodyLocKey: bodyLocKey,
                                    icon: icon,
                                    sound: sound,
                                    title: title,
                                    titleLocArgs: titleLocArgs,
                                    titleLocKey: titleLocKey,
                                },
                            },
                            title: title,
                        },
                    };
                    PushNotification._unifyEventData(eventData);
                    application.notify(eventData);
                }
            },
        });
        if (PushNotification._instance) {
            throw new Error('Error: Instantiation failed. Use getInstance() instead of new.');
        }
        var context = utils.ad.getApplicationContext();
        this._interop.initialize(context);
        application.on(application.resumeEvent, function (args) {
            PushNotification.onNewIntent(args.android.getIntent());
        });
        PushNotification._instance = this;
    }
    PushNotification.getInstance = function () {
        return PushNotification._instance;
    };
    PushNotification.onNewIntent = function (intent) {
        var extras = intent.getExtras();
        if (extras) {
            var msgId = extras.get('google.message_id');
            if (msgId) {
                var payload = {
                    data: {},
                };
                var it = extras.keySet().iterator();
                while (it.hasNext()) {
                    var key = it.next();
                    switch (key) {
                        case 'google.sent_time':
                        case 'google.ttl':
                        case 'from':
                        case 'google.message_id':
                        case 'google.priority':
                        case 'collapse_key':
                            var val = extras.get(key);
                            if (typeof val === 'object') {
                                payload[key] = val.toString();
                            }
                            else {
                                payload[key] = val;
                            }
                            break;
                        default:
                            payload.data[key] = extras.get(key);
                    }
                }
                var eventData = {
                    eventName: 'receiveNotificationResponseEvent',
                    object: {
                        actionIdentifier: 'android.DefaultAction',
                        completionHandler: function (result) {
                        },
                        payload: payload,
                    },
                };
                PushNotification._unifyEventData(eventData);
                application.notify(eventData);
            }
        }
    };
    ;
    PushNotification._unifyEventData = function (eventData) {
        var payload = eventData.object.payload;
        if (payload.data && payload.data.badge) {
            var badge = payload.data.badge;
            if (!isNaN(badge)) {
                badge = parseInt(badge, 10);
            }
            eventData.object.badge = badge;
        }
        if (payload.data && typeof payload.data.data === 'string') {
            try {
                eventData.object.data = JSON.parse(payload.data.data);
            }
            catch (e) {
                var sData = payload.data.data.replace(/'/g, '"');
                try {
                    eventData.object.data = JSON.parse(sData);
                }
                catch (e) {
                    eventData.object.data = payload.data.data;
                }
            }
        }
    };
    PushNotification.prototype.registerForPushNotification = function (applicationId, baseUrl, deviceId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var nativeCallback = new com.sap.mdk.client.foundation.IPromiseCallback({
                onRejected: function (code, message, error) {
                    reject(CommonUtil_1.CommonUtil.toJSError(code, message, error));
                },
                onResolve: function (result) {
                    _this._interop.updateEventCallback(_this._eventCallback);
                    resolve(result);
                },
            });
            _this._interop.registerForPushNotification(applicationId, baseUrl, platform_1.device.uuid, platform_1.device.deviceType, nativeCallback);
        });
    };
    PushNotification.prototype.unregisterForPushNotification = function (applicationId, baseUrl, deviceId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var nativeCallback = new com.sap.mdk.client.foundation.IPromiseCallback({
                onRejected: function (code, message, error) {
                    reject(CommonUtil_1.CommonUtil.toJSError(code, message, error));
                },
                onResolve: function (result) {
                    _this._interop.updateEventCallback(null);
                    resolve(result);
                },
            });
            _this._interop.unregisterForPushNotification(applicationId, baseUrl, platform_1.device.uuid, platform_1.device.deviceType, nativeCallback);
        });
    };
    PushNotification.prototype.getPriorityName = function (p) {
        switch (p) {
            case 1:
                return 'high';
            case 2:
                return 'normal';
            case 0:
            default:
                return 'unknown';
        }
    };
    PushNotification._instance = new PushNotification();
    return PushNotification;
}());
exports.PushNotification = PushNotification;
;
