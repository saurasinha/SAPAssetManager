"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataAction_1 = require("./DataAction");
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var ClientSettings_1 = require("../storage/ClientSettings");
var I18nLanguage_1 = require("../utils/I18nLanguage");
var ODataAction = (function (_super) {
    __extends(ODataAction, _super);
    function ODataAction(definition) {
        var _this = _super.call(this, definition) || this;
        _this._sapLanguageParamIdentifier = 'sap-language';
        return _this;
    }
    ODataAction.prototype.getEntitySet = function () {
        var definition = this.definition;
        return definition.getEntitySet();
    };
    ODataAction.prototype.getResolvedEntitySet = function () {
        return this._resolvedEntitySet;
    };
    ODataAction.prototype.getLanguageUrlParam = function () {
        var definition = this.definition;
        var serviceName = definition.getService();
        var serviceDefinition = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(serviceName);
        return serviceDefinition.languageUrlParam;
    };
    ODataAction.prototype.getServiceUrlSuffix = function (serviceUrl) {
        var serviceUrlSuffix = '';
        var languageUrlSuffixIndicator = this.getLanguageUrlParam();
        var languageCode;
        var updateServiceLanguagesMap = false;
        var serviceLanguagesMap = ClientSettings_1.ClientSettings.getODataServiceLanguageMap();
        if (serviceLanguagesMap) {
            if (serviceLanguagesMap.hasOwnProperty(serviceUrl)) {
                languageCode = serviceLanguagesMap[serviceUrl];
            }
        }
        else {
            serviceLanguagesMap = {};
        }
        if (!languageCode) {
            languageCode = this._getLanguageForServiceURLSuffix();
            updateServiceLanguagesMap = true;
        }
        if (languageUrlSuffixIndicator && languageCode) {
            serviceUrlSuffix = '?' + languageUrlSuffixIndicator + '=' + languageCode;
            if (updateServiceLanguagesMap) {
                serviceLanguagesMap[serviceUrl] = languageCode;
                ClientSettings_1.ClientSettings.setODataServiceLanguageMap(serviceLanguagesMap);
            }
        }
        return serviceUrlSuffix;
    };
    ODataAction.prototype.addServiceLanguageParam = function (serviceUrl, languageParam) {
        if (languageParam && languageParam !== '') {
            var serviceLanguageParamMap = ClientSettings_1.ClientSettings.getODataServiceLanguageParamMap();
            if (!serviceLanguageParamMap) {
                serviceLanguageParamMap = {};
            }
            serviceLanguageParamMap[serviceUrl] = languageParam;
            ClientSettings_1.ClientSettings.setODataServiceLanguageParamMap(serviceLanguageParamMap);
        }
    };
    ODataAction.prototype.setEmptyProperties = function (service) {
        if (service.properties && Array.isArray(service.properties) && service.properties.length === 0) {
            service.properties = {};
        }
    };
    ODataAction.prototype._getLanguageForServiceURLSuffix = function () {
        var languageCode = '';
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            languageCode = ClientSettings_1.ClientSettings.getDemoAppLanguage();
        }
        else {
            languageCode = ClientSettings_1.ClientSettings.getAppLanguage();
            if (languageCode) {
                if (languageCode === I18nLanguage_1.I18nLanguage.defaultI18n) {
                    languageCode = I18nLanguage_1.I18nLanguage.hardcodedLanguageCode;
                }
                var languageUrlParam = this.getLanguageUrlParam();
                if (languageUrlParam && languageUrlParam.endsWith(this._sapLanguageParamIdentifier)) {
                    languageCode = I18nLanguage_1.I18nLanguage.convertSAPSpecificLanguageCode(languageCode);
                }
                languageCode = languageCode.length >= 2 ? languageCode.substr(0, 2) : '';
            }
        }
        return languageCode;
    };
    return ODataAction;
}(DataAction_1.DataAction));
exports.ODataAction = ODataAction;
;
