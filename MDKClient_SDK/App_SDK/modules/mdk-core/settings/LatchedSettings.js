"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PersistentSettings_1 = require("./PersistentSettings");
var LatchedSettings = (function (_super) {
    __extends(LatchedSettings, _super);
    function LatchedSettings(name, loggingName) {
        return _super.call(this, name, loggingName) || this;
    }
    LatchedSettings.prototype.hasSetting = function (key) {
        return this.isLatched() ? _super.prototype.hasSetting.call(this, key) : false;
    };
    LatchedSettings.prototype.getSetting = function (key) {
        return this.isLatched() ? _super.prototype.getSetting.call(this, key) : undefined;
    };
    LatchedSettings.prototype.getSettings = function () {
        return this.isLatched() ? _super.prototype.getSettings.call(this) : undefined;
    };
    LatchedSettings.prototype.setSetting = function (key, value) {
        if (!this.isLatched()) {
            _super.prototype.setSetting.call(this, key, value);
        }
    };
    LatchedSettings.prototype.setSettings = function (obj) {
        if (!this.isLatched()) {
            _super.prototype.setSettings.call(this, obj);
        }
    };
    LatchedSettings.prototype.clear = function () {
        _super.prototype.clear.call(this);
    };
    LatchedSettings.prototype.latchSettings = function () {
        this._settings._isLatched = true;
        this.saveSettings();
    };
    LatchedSettings.prototype.unlatchSettings = function () {
        this._settings._isLatched = false;
        this.saveSettings();
    };
    LatchedSettings.prototype.isLatched = function () {
        return !!this._settings._isLatched;
    };
    return LatchedSettings;
}(PersistentSettings_1.PersistentSettings));
exports.LatchedSettings = LatchedSettings;
;
