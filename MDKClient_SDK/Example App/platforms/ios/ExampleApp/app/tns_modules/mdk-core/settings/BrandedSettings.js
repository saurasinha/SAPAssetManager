"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsFromJsonFile_1 = require("./SettingsFromJsonFile");
var Logger_1 = require("../utils/Logger");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var fs = require("tns-core-modules/file-system");
var BrandedSettings = (function (_super) {
    __extends(BrandedSettings, _super);
    function BrandedSettings() {
        var _this = this;
        if (BrandedSettings._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.INITIALIZE_FAIL_SHOULD_USE_GETINSTANCE);
        }
        var filePath = fs.path.join(fs.knownFolders.currentApp().path, 'branding', 'BrandedSettings.json');
        _this = _super.call(this, filePath, 'Branded Settings') || this;
        BrandedSettings._instance = _this;
        _this._settings = _this.getJSONData();
        return _this;
    }
    BrandedSettings.getInstance = function () {
        return BrandedSettings._instance;
    };
    BrandedSettings.prototype.hasDemoSetting = function (param) {
        var demoParam = 'Demo.' + param;
        return this.hasValue(this.getJSONData(), demoParam);
    };
    BrandedSettings.prototype.getJSONData = function () {
        var jsonData;
        try {
            jsonData = this.loadJSONData();
        }
        catch (error) {
            Logger_1.Logger.instance.branding.error(Logger_1.Logger.ERROR, error, error.stack);
        }
        return jsonData;
    };
    BrandedSettings._instance = new BrandedSettings();
    return BrandedSettings;
}(SettingsFromJsonFile_1.SettingsFromJsonFile));
exports.BrandedSettings = BrandedSettings;
;
