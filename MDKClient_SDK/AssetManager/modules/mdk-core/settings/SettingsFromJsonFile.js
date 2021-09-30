"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleSettings_1 = require("./SimpleSettings");
var SettingsFromJsonFile = (function (_super) {
    __extends(SettingsFromJsonFile, _super);
    function SettingsFromJsonFile(filePath, loggingName) {
        var _this = _super.call(this, loggingName) || this;
        _this._filePath = filePath;
        return _this;
    }
    SettingsFromJsonFile.prototype.setSettings = function (obj) {
    };
    SettingsFromJsonFile.prototype.setSetting = function (key, value) {
    };
    SettingsFromJsonFile.prototype.clear = function () {
    };
    SettingsFromJsonFile.prototype.setValue = function (obj, key, value) {
    };
    SettingsFromJsonFile.prototype.loadJSONData = function () {
        var result = global.require(this._filePath);
        this.checkBackwardCompatibility(result);
        return result;
    };
    SettingsFromJsonFile.prototype.checkBackwardCompatibility = function (result) {
        if (result) {
            if (result.URLWhitelist) {
                if (!result.AllowedDomains) {
                    result.AllowedDomains = result.URLWhitelist;
                }
                delete result.URLWhitelist;
            }
            if (result.ConnectionSettings && result.ConnectionSettings.SapCloudPlatformEndpoint) {
                if (!result.ConnectionSettings.ServerUrl) {
                    result.ConnectionSettings.ServerUrl = result.ConnectionSettings.SapCloudPlatformEndpoint;
                }
                delete result.ConnectionSettings.SapCloudPlatformEndpoint;
            }
            if (result.Demo && result.Demo.ConnectionSettings && result.Demo.ConnectionSettings.SapCloudPlatformEndpoint) {
                if (!result.Demo.ConnectionSettings.ServerUrl) {
                    result.Demo.ConnectionSettings.ServerUrl = result.Demo.ConnectionSettings.SapCloudPlatformEndpoint;
                }
                delete result.Demo.ConnectionSettings.SapCloudPlatformEndpoint;
            }
        }
    };
    return SettingsFromJsonFile;
}(SimpleSettings_1.SimpleSettings));
exports.SettingsFromJsonFile = SettingsFromJsonFile;
