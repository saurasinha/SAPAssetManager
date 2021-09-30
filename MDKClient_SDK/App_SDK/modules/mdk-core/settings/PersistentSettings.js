"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppSettingsManager_1 = require("../utils/AppSettingsManager");
var SimpleSettings_1 = require("./SimpleSettings");
var PersistentSettings = (function (_super) {
    __extends(PersistentSettings, _super);
    function PersistentSettings(name, loggingName) {
        var _this = _super.call(this, loggingName) || this;
        _this._keyStoreName = name;
        _this.retrieveSettingsFromStorage();
        return _this;
    }
    PersistentSettings.prototype.setSettings = function (obj) {
        _super.prototype.setSettings.call(this, obj);
        this.saveSettings();
    };
    PersistentSettings.prototype.setSetting = function (key, value) {
        _super.prototype.setSetting.call(this, key, value);
        this.saveSettings();
    };
    PersistentSettings.prototype.clear = function () {
        _super.prototype.clear.call(this);
        AppSettingsManager_1.AppSettingsManager.instance().remove(this.getStoreName());
    };
    PersistentSettings.prototype.saveSettings = function () {
        var settingsJSON = JSON.stringify(this._settings);
        AppSettingsManager_1.AppSettingsManager.instance().setString(this.getStoreName(), settingsJSON);
    };
    PersistentSettings.prototype.retrieveSettingsFromStorage = function () {
        this._settings = JSON.parse(AppSettingsManager_1.AppSettingsManager.instance().getString(this.getStoreName(), '{}')) || {};
    };
    PersistentSettings.prototype.getStoreName = function () {
        return '_internal_' + this._keyStoreName + '_store';
    };
    return PersistentSettings;
}(SimpleSettings_1.SimpleSettings));
exports.PersistentSettings = PersistentSettings;
