"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISettings_1 = require("./ISettings");
var SimpleSettings = (function (_super) {
    __extends(SimpleSettings, _super);
    function SimpleSettings(loggingName, initialSettings) {
        var _this = _super.call(this) || this;
        _this._settings = {};
        _this._loggingName = loggingName;
        if (initialSettings) {
            _this._settings = initialSettings;
        }
        return _this;
    }
    SimpleSettings.prototype.getLogName = function () {
        return this._loggingName;
    };
    SimpleSettings.prototype.hasSetting = function (key) {
        return this.hasValue(this._settings, key);
    };
    SimpleSettings.prototype.getSetting = function (key) {
        return this.hasValue(this._settings, key) ? this.makeCopy(this.getValue(this._settings, key)) : undefined;
    };
    SimpleSettings.prototype.setSetting = function (key, value) {
        this.setValue(this._settings, key, value);
    };
    SimpleSettings.prototype.setSettings = function (obj) {
        this._settings = this.makeCopy(obj);
    };
    SimpleSettings.prototype.getSettings = function () {
        return this.makeCopy(this._settings);
    };
    SimpleSettings.prototype.clear = function () {
        this._settings = {};
    };
    SimpleSettings.prototype.hasValue = function (obj, key) {
        if (!obj) {
            return false;
        }
        var properties = key.split('.');
        var o = obj;
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            if (o.hasOwnProperty(property)) {
                o = o[property];
            }
            else {
                return false;
            }
        }
        return true;
    };
    SimpleSettings.prototype.getValue = function (obj, key) {
        if (!obj) {
            return undefined;
        }
        var properties = key.split('.');
        var o = obj;
        for (var _i = 0, properties_2 = properties; _i < properties_2.length; _i++) {
            var property = properties_2[_i];
            if (o.hasOwnProperty(property)) {
                o = o[property];
            }
            else {
                return undefined;
            }
        }
        return o;
    };
    SimpleSettings.prototype.setValue = function (obj, key, value) {
        if (!obj) {
            return;
        }
        var properties = key.split('.');
        var o = obj;
        for (var index_1 = 0; index_1 < properties.length; index_1++) {
            var property = properties[index_1];
            if (index_1 === (properties.length - 1)) {
                o[property] = value;
            }
            else if (o.hasOwnProperty(property)) {
                o = o[property];
            }
            else {
                o[property] = {};
                o = o[property];
            }
        }
    };
    SimpleSettings.prototype.makeCopy = function (input) {
        return input !== undefined ? JSON.parse(JSON.stringify(input)) : undefined;
    };
    return SimpleSettings;
}(ISettings_1.ISettings));
exports.SimpleSettings = SimpleSettings;
;
