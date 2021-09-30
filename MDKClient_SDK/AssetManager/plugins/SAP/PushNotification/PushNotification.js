"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PushNotification = (function () {
    function PushNotification() {
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
        return new Promise(function (resolve) { return resolve('Dummy resolve'); });
    };
    PushNotification.prototype.didRegisterForRemoteNotifications = function (deviceToken) {
    };
    PushNotification.prototype.didFailToRegisterNotifications = function (error) {
    };
    PushNotification.prototype.unregisterForPushNotification = function (applicationId, baseUrlString, deviceId) {
        return new Promise(function (resolve) { return resolve('Dummy resolve'); });
    };
    PushNotification._instance = new PushNotification();
    return PushNotification;
}());
exports.PushNotification = PushNotification;
;
