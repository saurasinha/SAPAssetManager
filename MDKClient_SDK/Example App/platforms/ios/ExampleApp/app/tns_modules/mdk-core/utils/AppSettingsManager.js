"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appSettings = require("tns-core-modules/application-settings");
var SecureStore_1 = require("../storage/SecureStore");
var application = require("tns-core-modules/application");
var ClientSettings_1 = require("../storage/ClientSettings");
var Logger_1 = require("../utils/Logger");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var AppSettingsManager = (function () {
    function AppSettingsManager() {
        this._listeners = {};
    }
    AppSettingsManager.instance = function () {
        if (!AppSettingsManager._instance) {
            AppSettingsManager._instance = new AppSettingsManager();
        }
        if (!AppSettingsManager._isSecureDataMoved) {
            if (application.ios || (application.android && application.android.context)) {
                AppSettingsManager._instance.moveSecureData();
                ClientSettings_1.ClientSettings.initializePersistentSettings();
            }
        }
        return AppSettingsManager._instance;
    };
    AppSettingsManager.prototype.addPendingAction = function (key, page, type, data, clear) {
        if (type === void 0) { type = ''; }
        if (data === void 0) { data = ''; }
        if (clear === void 0) { clear = true; }
        if (!key || key.length === 0 || !page || page.length === 0) {
            return;
        }
        var pendingAction = {
            clear: clear,
            data: data,
            page: page,
            type: type,
        };
        this._setStringAndPublish(key, JSON.stringify(pendingAction));
        var pendingActions = this._getPendingActions();
        pendingActions.push(key);
        this._updatePendingActions(pendingActions);
    };
    AppSettingsManager.prototype.addPendingDownload = function (key, page, value, clear) {
        if (value === void 0) { value = ''; }
        if (clear === void 0) { clear = true; }
        this.addPendingAction(key, page, AppSettingsManager.pendingType.Download, value, clear);
    };
    AppSettingsManager.prototype.getPendingDataForPage = function (page) {
        var _this = this;
        var pendingActions = this._getPendingActions();
        var actionKey = pendingActions.find(function (key) {
            var pendingData = _this._getPendingData(key);
            return pendingData && pendingData.page === page;
        });
        if (actionKey) {
            return this._getPendingData(actionKey);
        }
    };
    AppSettingsManager.prototype.getPendingDataForKey = function (key) {
        return this._getPendingData(key);
    };
    AppSettingsManager.prototype.hasPendingActionForKey = function (key) {
        var pendingActions = this._getPendingActions();
        if (pendingActions.length === 0) {
            return false;
        }
        if (this._hasKey(key)) {
            return true;
        }
        return false;
    };
    AppSettingsManager.prototype.hasPendingActionForPage = function (page) {
        var pendingActions = this._getPendingActions();
        if (pendingActions.length === 0) {
            return false;
        }
        return !!this.getPendingDataForPage(page);
    };
    AppSettingsManager.prototype.hasSubscriber = function (key) {
        return this._listeners[key] !== undefined;
    };
    AppSettingsManager.prototype.removePendingAction = function (removeKey) {
        var _this = this;
        var pendingActions = this._getPendingActions();
        pendingActions = pendingActions.filter(function (key) {
            var pendingAction = _this._getPendingData(key);
            if (removeKey === key && pendingAction && pendingAction.clear) {
                _this._removeAndPublish(key);
                return false;
            }
            return true;
        });
        this._updatePendingActions(pendingActions);
    };
    AppSettingsManager.prototype.removePendingActions = function () {
        var _this = this;
        var pendingActions = this._getPendingActions();
        pendingActions = pendingActions.filter(function (key) {
            var pendingAction = _this._getPendingData(key);
            if (pendingAction && pendingAction.clear) {
                _this._removeAndPublish(key);
                return false;
            }
            return true;
        });
        this._updatePendingActions(pendingActions);
    };
    AppSettingsManager.prototype.subscribe = function (key, handler) {
        if (this._listeners[key]) {
            this._listeners[key].push(handler);
        }
        else {
            this._listeners[key] = [handler];
        }
    };
    AppSettingsManager.prototype.unsubscribe = function (key, handler) {
        if (this._listeners[key]) {
            var index_1 = this._listeners[key].indexOf(handler);
            if (index_1 > -1) {
                this._listeners[key].splice(index_1, 1);
            }
            if (this._listeners[key].length === 0) {
                delete this._listeners[key];
            }
        }
    };
    AppSettingsManager.prototype.moveSecureData = function () {
        var bMoved = SecureStore_1.SecureStore.getInstance().getString(AppSettingsManager._secureDataMovedKey);
        Logger_1.Logger.instance.clientSettings.info('***** MDK secure storage is ready *****');
        if (bMoved === 'true') {
            AppSettingsManager._isSecureDataMoved = true;
            Logger_1.Logger.instance.clientSettings.info("***** Get Key: '" + AppSettingsManager._secureDataMovedKey + "' value is true *****");
        }
        else {
            Logger_1.Logger.instance.clientSettings.info('***** Secure keys is moving *****');
            for (var _i = 0, _a = AppSettingsManager._secureAppSettings; _i < _a.length; _i++) {
                var sKey = _a[_i];
                if (this._hasKey(sKey)) {
                    Logger_1.Logger.instance.clientSettings.info("***** Secure key '" + sKey + "' is moving *****");
                    var sValue = void 0;
                    if (sKey === 'passcodeSource') {
                        sValue = String(appSettings.getNumber(sKey));
                    }
                    else {
                        sValue = appSettings.getString(sKey);
                    }
                    if (sValue) {
                        SecureStore_1.SecureStore.getInstance().setString(sKey, sValue);
                    }
                    appSettings.remove(sKey);
                }
            }
            SecureStore_1.SecureStore.getInstance().setString(AppSettingsManager._secureDataMovedKey, 'true');
            Logger_1.Logger.instance.clientSettings.info("***** Set Key: '" + AppSettingsManager._secureDataMovedKey + "' value to 'true' *****");
            AppSettingsManager._isSecureDataMoved = true;
        }
    };
    AppSettingsManager.prototype.remove = function (key) {
        if (this._isKeySecure(key)) {
            SecureStore_1.SecureStore.getInstance().remove(key);
        }
        else {
            appSettings.remove(key);
        }
    };
    AppSettingsManager.prototype.setString = function (key, value) {
        if (this._isKeySecure(key)) {
            SecureStore_1.SecureStore.getInstance().setString(key, value);
        }
        else {
            appSettings.setString(key, value);
        }
    };
    AppSettingsManager.prototype.getString = function (key, defaultValue) {
        var value;
        if (this._isKeySecure(key)) {
            value = SecureStore_1.SecureStore.getInstance().getString(key);
            if (value === undefined || value === null) {
                value = defaultValue;
            }
        }
        else {
            value = appSettings.getString(key, defaultValue);
        }
        return value;
    };
    AppSettingsManager.prototype.setNumber = function (key, value) {
        if (this._isKeySecure(key)) {
            SecureStore_1.SecureStore.getInstance().setString(key, String(value));
        }
        else {
            appSettings.setNumber(key, value);
        }
    };
    AppSettingsManager.prototype.getNumber = function (key, defaultValue) {
        var value;
        if (this._isKeySecure(key)) {
            var strData = SecureStore_1.SecureStore.getInstance().getString(key);
            if (strData && strData.length > 0) {
                value = Number(strData);
            }
            else if (strData === undefined || strData === null) {
                value = defaultValue;
            }
        }
        else {
            value = appSettings.getNumber(key, defaultValue);
        }
        return value;
    };
    AppSettingsManager.prototype.setBoolean = function (key, value) {
        if (this._isKeySecure(key)) {
            SecureStore_1.SecureStore.getInstance().setString(key, String(value));
        }
        else {
            appSettings.setBoolean(key, value);
        }
    };
    AppSettingsManager.prototype.getBoolean = function (key, defaultValue) {
        var value;
        if (this._isKeySecure(key)) {
            var strData = SecureStore_1.SecureStore.getInstance().getString(key);
            if (strData && strData.length > 0) {
                value = Boolean(strData);
            }
            else if (strData === undefined || strData === null) {
                value = defaultValue;
            }
        }
        else {
            value = appSettings.getBoolean(key, defaultValue);
        }
        return value;
    };
    AppSettingsManager.prototype._getPendingData = function (key) {
        if (this._hasKey(key)) {
            return JSON.parse(this._getString(key));
        }
        return undefined;
    };
    AppSettingsManager.prototype._getString = function (key) {
        return appSettings.getString(key, '');
    };
    AppSettingsManager.prototype._getPendingActions = function () {
        if (this._hasKey(AppSettingsManager._pendingActionsKey)) {
            var pendingActionsString = this._getString(AppSettingsManager._pendingActionsKey);
            if (pendingActionsString.length) {
                return pendingActionsString.split(';');
            }
        }
        return [];
    };
    AppSettingsManager.prototype._hasKey = function (key) {
        return appSettings.hasKey(key);
    };
    AppSettingsManager.prototype._publishChange = function (key, type, value) {
        if (this._listeners[key]) {
            for (var _i = 0, _a = this._listeners[key]; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener.onAppSettingChange(key, type, value);
            }
        }
    };
    AppSettingsManager.prototype._remove = function (key) {
        appSettings.remove(key);
    };
    AppSettingsManager.prototype._removeAndPublish = function (key) {
        this._remove(key);
        this._publishChange(key, AppSettingsManager.changeType.KeyRemoved);
    };
    AppSettingsManager.prototype._setString = function (key, value) {
        appSettings.setString(key, value);
    };
    AppSettingsManager.prototype._setStringAndPublish = function (key, value, publish) {
        if (publish === void 0) { publish = true; }
        this._setString(key, value);
        if (publish) {
            this._publishChange(key, AppSettingsManager.changeType.StringChanged);
        }
    };
    AppSettingsManager.prototype._updatePendingActions = function (pendingActions) {
        var pendingActionsString = '';
        if (pendingActions.length > 0) {
            pendingActionsString = pendingActions.join(';');
        }
        this._setString(AppSettingsManager._pendingActionsKey, pendingActionsString);
    };
    AppSettingsManager.prototype._isKeySecure = function (key) {
        var bSensitive = false;
        if (AppSettingsManager._secureAppSettings.indexOf(key) > -1) {
            bSensitive = true;
            if (application.android && !application.android.context) {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.SECURE_STORE_IS_UNAVAILABLE, key));
            }
        }
        return bSensitive;
    };
    AppSettingsManager.changeType = {
        BooleanChanged: 'AppSettingsManager.Type.BooleanChanged',
        KeyRemoved: 'AppSettingsManager.Type.Removed',
        StringChanged: 'AppSettingsManager.Type.StringChanged',
    };
    AppSettingsManager.pendingType = {
        Download: 'AppSettingsManager.PendingType.Download',
    };
    AppSettingsManager._pendingActionsKey = 'SEAM-PENDING-ACTIONS';
    AppSettingsManager._secureDataMovedKey = 'SECURE-DATA-MOVED';
    AppSettingsManager._isSecureDataMoved = false;
    AppSettingsManager._secureAppSettings = ['deviceID', 'ExtensionControlSourceMap',
        'HistoricalODataServicePath', 'OfflineODataServicePaths', 'passcodeSource', 'userId',
        '_internal_LatchedSettings_store', '_internal_SavedAppLaunchSettings_store'];
    return AppSettingsManager;
}());
exports.AppSettingsManager = AppSettingsManager;
;
;
