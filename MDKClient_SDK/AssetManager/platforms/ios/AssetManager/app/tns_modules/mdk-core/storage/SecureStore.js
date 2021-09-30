"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mdk_sap_1 = require("mdk-sap");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var SecureStore = (function () {
    function SecureStore() {
        if (SecureStore._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.INITIALIZE_FAIL_SHOULD_USE_GETINSTANCE);
        }
        SecureStore._instance = this;
        this._manager = mdk_sap_1.SecureStorageManager.getInstance();
    }
    SecureStore.getInstance = function () {
        if (!SecureStore._instance) {
            SecureStore._instance = new SecureStore();
        }
        return SecureStore._instance;
    };
    SecureStore.prototype.setString = function (key, value) {
        this._manager.setString(key, value);
    };
    SecureStore.prototype.getString = function (key) {
        return this._manager.getString(key);
    };
    SecureStore.prototype.remove = function (key) {
        this._manager.remove(key);
    };
    SecureStore.prototype.removeStore = function () {
        this._manager.removeStore();
    };
    return SecureStore;
}());
exports.SecureStore = SecureStore;
