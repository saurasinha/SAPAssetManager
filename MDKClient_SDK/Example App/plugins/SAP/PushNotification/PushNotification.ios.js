"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonUtil_1 = require("../ErrorHandling/CommonUtil");
var PushNotification = (function () {
    function PushNotification() {
        this.pushNotificationBridge = PushNotificationBridge.new();
        if (PushNotification._instance) {
            throw new Error('Error: Instantiation failed. Use getInstance() instead of new.');
        }
        PushNotification._instance = this;
    }
    PushNotification.getInstance = function () {
        return PushNotification._instance;
    };
    PushNotification.onNewIntent = function (intent) {
    };
    PushNotification.prototype.registerForPushNotification = function (applicationId, baseUrlString, deviceId) {
        var _this = this;
        var baseUrl = NSURL.URLWithString(baseUrlString);
        return new Promise(function (resolve, reject) {
            _this.pushNotificationBridge.registerForPushNotificationResolveReject(applicationId, baseUrl, deviceId, function (id) { resolve(id); }, function (code, message, error) { reject(CommonUtil_1.CommonUtil.toJSError(code, message, error)); });
        });
    };
    PushNotification.prototype.didRegisterForRemoteNotifications = function (deviceToken) {
        this.pushNotificationBridge.didRegisterForRemoteNotifications(deviceToken);
    };
    PushNotification.prototype.didFailToRegisterNotifications = function (error) {
        this.pushNotificationBridge.didFailToRegisterNotifications(error);
    };
    PushNotification.prototype.unregisterForPushNotification = function (applicationId, baseUrlString, deviceId) {
        var _this = this;
        var baseUrl = NSURL.URLWithString(baseUrlString);
        return new Promise(function (resolve, reject) {
            _this.pushNotificationBridge.unregisterForPushNotificationResolveReject(applicationId, baseUrl, deviceId, function (id) { resolve(id); }, function (code, message, error) { reject(error); });
        });
    };
    PushNotification._instance = new PushNotification();
    return PushNotification;
}());
exports.PushNotification = PushNotification;
;
