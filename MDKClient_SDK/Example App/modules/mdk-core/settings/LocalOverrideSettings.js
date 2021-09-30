"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsFromJsonFile_1 = require("./SettingsFromJsonFile");
var BrandedSettings_1 = require("./BrandedSettings");
var fs = require("tns-core-modules/file-system");
var Logger_1 = require("../utils/Logger");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var Paths_1 = require("../storage/Paths");
var app = require("tns-core-modules/application");
var LocalOverrideSettings = (function (_super) {
    __extends(LocalOverrideSettings, _super);
    function LocalOverrideSettings() {
        var _this = this;
        if (LocalOverrideSettings._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.INITIALIZE_FAIL_SHOULD_USE_GETINSTANCE);
        }
        if (app.ios) {
            var overrideFile = fs.path.join(Paths_1.Paths.getOverridePath(), 'Overrides.json');
            Logger_1.Logger.instance.clientSettings.info(Logger_1.Logger.CLIENTSETTINGS_PATH_TO_OVERRIDES, overrideFile);
            _this = _super.call(this, overrideFile, 'Local Overrides') || this;
        }
        _this._settings = _this.getJSONData();
        return _this;
    }
    LocalOverrideSettings.getInstance = function () {
        if (!LocalOverrideSettings._instance) {
            LocalOverrideSettings._instance = new LocalOverrideSettings();
        }
        return LocalOverrideSettings._instance;
    };
    LocalOverrideSettings.prototype.hasSetting = function (key) {
        this._settings = this.getJSONData();
        return this.canOverride(key) ? _super.prototype.hasSetting.call(this, key) : false;
    };
    LocalOverrideSettings.prototype.getSetting = function (key) {
        this._settings = this.getJSONData();
        return this.canOverride(key) ? _super.prototype.getSetting.call(this, key) : undefined;
    };
    LocalOverrideSettings.prototype.getSettings = function () {
        return undefined;
    };
    LocalOverrideSettings.prototype.loadJSONData = function () {
        var jsonData = null;
        if (this._filePath === undefined) {
            return jsonData;
        }
        try {
            var error = void 0;
            if (fs.File.exists(this._filePath)) {
                var file = fs.File.fromPath(this._filePath);
                var fileData = file.readTextSync(function (e) {
                    throw (e);
                });
                jsonData = JSON.parse(fileData);
                this.checkBackwardCompatibility(jsonData);
            }
        }
        catch (error) {
            Logger_1.Logger.instance.branding.error(Logger_1.Logger.ERROR, error, error.stack);
        }
        return jsonData;
    };
    LocalOverrideSettings.prototype.canOverride = function (key) {
        var enableKey = 'EnableOverrides';
        var properties = key.split('.');
        var o = BrandedSettings_1.BrandedSettings.getInstance();
        if (o.hasSetting(enableKey) && o.getSetting(enableKey)) {
            return true;
        }
        var settingStr = '';
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            settingStr += property + ".";
            if (o.hasSetting("" + settingStr + enableKey) && o.getSetting("" + settingStr + enableKey)) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    };
    LocalOverrideSettings.prototype.getJSONData = function () {
        var jsonData = null;
        if (this._filePath === undefined) {
            return jsonData;
        }
        try {
            if (fs.File.exists(this._filePath)) {
                jsonData = this.loadJSONData();
            }
        }
        catch (error) {
            Logger_1.Logger.instance.branding.error(Logger_1.Logger.ERROR, error, error.stack);
        }
        return jsonData;
    };
    return LocalOverrideSettings;
}(SettingsFromJsonFile_1.SettingsFromJsonFile));
exports.LocalOverrideSettings = LocalOverrideSettings;
;
