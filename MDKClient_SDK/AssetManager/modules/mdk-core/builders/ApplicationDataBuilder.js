"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("./BaseDataBuilder");
var ApplicationDataBuilder = (function (_super) {
    __extends(ApplicationDataBuilder, _super);
    function ApplicationDataBuilder(context) {
        return _super.call(this, context) || this;
    }
    ApplicationDataBuilder.prototype.setMainPage = function (mainPage) {
        this.data.mainPage = mainPage;
        return this;
    };
    ApplicationDataBuilder.prototype.setStylePath = function (stylePath) {
        this.data.stylePath = stylePath;
        return this;
    };
    ApplicationDataBuilder.prototype.setSDKStylesPath = function (SDKStylePath) {
        this.data.sdkStylePath = SDKStylePath;
        return this;
    };
    ApplicationDataBuilder.prototype.setVersion = function (version) {
        this.data.version = version;
        return this;
    };
    ApplicationDataBuilder.prototype.setLocalization = function (localization) {
        this.data.localization = localization;
        return this;
    };
    return ApplicationDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.ApplicationDataBuilder = ApplicationDataBuilder;
