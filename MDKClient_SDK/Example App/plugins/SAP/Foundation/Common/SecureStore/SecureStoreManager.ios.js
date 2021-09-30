"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../../../ErrorHandling/ErrorMessage");
var SecureStorageManager = (function () {
    function SecureStorageManager() {
        if (SecureStorageManager._instance) {
            throw new Error('Error: Instantiation failed. Use getInstance() instead of new.');
        }
        SecureStorageManager._instance = this;
    }
    SecureStorageManager.getInstance = function () {
        return SecureStorageManager._instance;
    };
    SecureStorageManager.prototype.setString = function (key, value) {
        var errorRef = new interop.Reference();
        SecureStoreManager.sharedInstance.putStringWithValueKeyError(value, key, errorRef);
        this._throwIfError(errorRef);
    };
    SecureStorageManager.prototype.getString = function (key) {
        var errorRef = new interop.Reference();
        var value = SecureStoreManager.sharedInstance.getStringWithKeyError(key, errorRef);
        this._throwIfError(errorRef);
        return value;
    };
    SecureStorageManager.prototype.remove = function (key) {
        var errorRef = new interop.Reference();
        SecureStoreManager.sharedInstance.removeWithKeyError(key, errorRef);
        this._throwIfError(errorRef);
    };
    SecureStorageManager.prototype.removeStore = function () {
        SecureStoreManager.sharedInstance.removeStore();
    };
    SecureStorageManager.prototype._throwIfError = function (errorRef) {
        if (!errorRef.value || errorRef.value.code === 0) {
            return;
        }
        var errorCode = errorRef.value.localizedDescription;
        throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ERROR_ACCESSING_SECURE_STOIRE, errorCode));
    };
    SecureStorageManager._instance = new SecureStorageManager();
    return SecureStorageManager;
}());
exports.SecureStorageManager = SecureStorageManager;
;
