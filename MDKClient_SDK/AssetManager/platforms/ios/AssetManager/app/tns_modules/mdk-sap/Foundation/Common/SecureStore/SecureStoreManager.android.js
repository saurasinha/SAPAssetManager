"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var application = require("tns-core-modules/application");
var SecureStorageManager = (function () {
    function SecureStorageManager() {
        this._bridge = com.sap.mdk.client.foundation.SecureStoreHandler.getInstance(application.android.context);
    }
    SecureStorageManager.getInstance = function () {
        if (!SecureStorageManager._instance) {
            SecureStorageManager._instance = new SecureStorageManager();
        }
        return SecureStorageManager._instance;
    };
    SecureStorageManager.prototype.getString = function (key) {
        return this._bridge.getString(key);
    };
    SecureStorageManager.prototype.setString = function (key, value) {
        this._bridge.putString(key, value);
    };
    SecureStorageManager.prototype.remove = function (key) {
        this._bridge.remove(key);
    };
    SecureStorageManager.prototype.removeStore = function () {
        this._bridge.removeStore();
    };
    return SecureStorageManager;
}());
exports.SecureStorageManager = SecureStorageManager;
;
