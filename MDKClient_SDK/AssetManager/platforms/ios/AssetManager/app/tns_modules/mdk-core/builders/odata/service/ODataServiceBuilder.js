"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../../BaseDataBuilder");
var ODataServiceBuilder = (function (_super) {
    __extends(ODataServiceBuilder, _super);
    function ODataServiceBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {};
        return _this;
    }
    ODataServiceBuilder.prototype.build = function () {
        return _super.prototype.build.call(this).then(function (data) {
            return data;
        });
    };
    ODataServiceBuilder.prototype.setCsdlOptions = function (csdlOptions) {
        this.data.csdlOptions = csdlOptions;
        return this;
    };
    ODataServiceBuilder.prototype.setServiceOptions = function (serviceOptions) {
        this.data.serviceOptions = Object.assign({}, serviceOptions || {});
        return this;
    };
    ODataServiceBuilder.prototype.setOfflineCsdlOptions = function (offlineCsdlOptions) {
        this.data.offlineCsdlOptions = offlineCsdlOptions;
        return this;
    };
    ODataServiceBuilder.prototype.setOfflineServiceOptions = function (offlineServiceOptions) {
        this.data.offlineServiceOptions = Object.assign({}, offlineServiceOptions || {});
        return this;
    };
    ODataServiceBuilder.prototype.setOfflineStoreParameters = function (offlineStoreParameters) {
        this.data.offlineStoreParameters = Object.assign({}, offlineStoreParameters || {});
        return this;
    };
    ODataServiceBuilder.prototype.setHeaders = function (headers) {
        this.data.headers = Object.assign({}, headers || {});
        return this;
    };
    ODataServiceBuilder.prototype.setOfflineEnabled = function (offlineEnabled) {
        this.data.offlineEnabled = offlineEnabled;
        return this;
    };
    ODataServiceBuilder.prototype.setLanguageUrlParam = function (languageUrlParam) {
        this.data.languageUrlParam = languageUrlParam;
        return this;
    };
    return ODataServiceBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.ODataServiceBuilder = ODataServiceBuilder;
