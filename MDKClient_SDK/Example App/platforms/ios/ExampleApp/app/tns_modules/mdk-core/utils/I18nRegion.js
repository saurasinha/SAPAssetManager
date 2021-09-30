"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientSettings_1 = require("../storage/ClientSettings");
var Logger_1 = require("../utils/Logger");
var mdk_sap_1 = require("mdk-sap");
var I18nLanguage_1 = require("../utils/I18nLanguage");
var RegionSource;
(function (RegionSource) {
    RegionSource[RegionSource["UserDefined"] = 1] = "UserDefined";
    RegionSource[RegionSource["DeviceSetting"] = 2] = "DeviceSetting";
})(RegionSource = exports.RegionSource || (exports.RegionSource = {}));
var I18nRegion = (function () {
    function I18nRegion() {
    }
    I18nRegion.getRegionLists = function () {
        var codeList = mdk_sap_1.I18n.getDeviceRegionCodeList();
        var result = new Object();
        var mergeResult = new Object();
        var countryName = '';
        var currentAppLocale = ClientSettings_1.ClientSettings.getAppLocale();
        for (var _i = 0, codeList_1 = codeList; _i < codeList_1.length; _i++) {
            var countryCode = codeList_1[_i];
            countryName = mdk_sap_1.I18n.getDeviceRegionName(currentAppLocale, countryCode);
            if (countryName) {
                result[countryCode] = countryName;
            }
            else {
                result[countryCode] = countryCode;
            }
            mergeResult = Object.assign(mergeResult, result);
        }
        return mergeResult;
    };
    I18nRegion.isUsingDeviceRegion = function () {
        var source = ClientSettings_1.ClientSettings.getAppRegionSource();
        return source === RegionSource.DeviceSetting;
    };
    I18nRegion.loadAppRegion = function () {
        var appRegionIsSet = false;
        var appRegionIsUpdated = false;
        var appRegion = ClientSettings_1.ClientSettings.getAppRegion();
        var userDefinedRegion = ClientSettings_1.ClientSettings.getUserDefinedRegion();
        if (userDefinedRegion) {
            var appDiffFromUserDefined = appRegion ? appRegion !== userDefinedRegion : false;
            if (!appRegion || appDiffFromUserDefined) {
                appRegionIsSet = true;
                appRegionIsUpdated = true;
                this.setAppRegion(userDefinedRegion, RegionSource.UserDefined);
                Logger_1.Logger.instance.startup.log("succesfully applied user defined region as app region '" + userDefinedRegion + "'");
            }
            else {
                appRegionIsSet = true;
            }
        }
        if (!appRegionIsSet) {
            var deviceRegion = mdk_sap_1.I18n.getDeviceRegionCode();
            if (deviceRegion) {
                var appDiffFromDevice = appRegion ? appRegion !== deviceRegion : false;
                if (!appRegion || appDiffFromDevice) {
                    appRegionIsSet = true;
                    appRegionIsUpdated = true;
                    this.setAppRegion(deviceRegion, RegionSource.DeviceSetting, false);
                    Logger_1.Logger.instance.startup.log("succesfully applied device region as app region '" + deviceRegion + "'");
                }
                else {
                    appRegionIsSet = true;
                }
            }
        }
    };
    I18nRegion.setAppRegion = function (regionCode, source, isOverride) {
        if (isOverride === void 0) { isOverride = true; }
        if (isOverride) {
        }
        ClientSettings_1.ClientSettings.setAppRegion(regionCode);
        if (!source) {
            if (regionCode === mdk_sap_1.I18n.getDeviceRegionCode()) {
                source = RegionSource.DeviceSetting;
            }
            else {
                source = RegionSource.UserDefined;
            }
        }
        ClientSettings_1.ClientSettings.setAppRegionSource(source);
        var appLanguage = I18nLanguage_1.I18nLanguage.getAppLanguage();
        if (appLanguage !== undefined && appLanguage !== '') {
            ClientSettings_1.ClientSettings.setAppLocale(this.getLocale());
        }
    };
    I18nRegion.setUserDefinedRegion = function (regionCode) {
        if (regionCode) {
            if (regionCode !== mdk_sap_1.I18n.getDeviceRegionCode()) {
                ClientSettings_1.ClientSettings.setUserDefinedRegion(regionCode);
                this.setAppRegion(regionCode, RegionSource.UserDefined);
            }
            else {
                ClientSettings_1.ClientSettings.setUserDefinedRegion('');
                this.setAppRegion(regionCode, RegionSource.DeviceSetting);
            }
        }
        else {
            ClientSettings_1.ClientSettings.setUserDefinedRegion('');
            this.loadAppRegion();
        }
    };
    I18nRegion.getLocale = function () {
        var appLocale = '';
        var i18nAppLanguage = I18nLanguage_1.I18nLanguage.getAppLanguage();
        var appLanguage = i18nAppLanguage !== I18nLanguage_1.I18nLanguage.defaultI18n ?
            i18nAppLanguage : I18nLanguage_1.I18nLanguage.hardcodedLanguageCode;
        appLocale = this._populateLocale(appLanguage, ClientSettings_1.ClientSettings.getAppRegion());
        return appLocale;
    };
    I18nRegion._populateLocale = function (languageCode, regionCode) {
        var result;
        var splittedLanguageCodes = languageCode.split('-');
        if (splittedLanguageCodes.length === 3) {
            result = splittedLanguageCodes[0] + '-' + splittedLanguageCodes[1] + '-' + regionCode;
        }
        else if (splittedLanguageCodes.length === 2) {
            var middlePart = '';
            if (splittedLanguageCodes[1].length > 2) {
                middlePart = splittedLanguageCodes[1] + '-';
            }
            result = splittedLanguageCodes[0] + '-' + middlePart + regionCode;
        }
        else if (splittedLanguageCodes.length === 1) {
            result = splittedLanguageCodes[0] + '-' + regionCode;
        }
        return result;
    };
    return I18nRegion;
}());
exports.I18nRegion = I18nRegion;
;
