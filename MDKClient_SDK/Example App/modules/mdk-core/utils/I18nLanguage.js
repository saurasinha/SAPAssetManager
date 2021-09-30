"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientSettings_1 = require("../storage/ClientSettings");
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var Logger_1 = require("../utils/Logger");
var mdk_sap_1 = require("mdk-sap");
var I18nHelper_1 = require("../utils/I18nHelper");
var I18nRegion_1 = require("../utils/I18nRegion");
var application = require("tns-core-modules/application");
var Application_1 = require("../Application");
var LanguageSource;
(function (LanguageSource) {
    LanguageSource[LanguageSource["UserDefined"] = 1] = "UserDefined";
    LanguageSource[LanguageSource["DeviceSetting"] = 2] = "DeviceSetting";
    LanguageSource[LanguageSource["DefaultApp"] = 3] = "DefaultApp";
    LanguageSource[LanguageSource["Hardcoded"] = 4] = "Hardcoded";
})(LanguageSource = exports.LanguageSource || (exports.LanguageSource = {}));
var I18nLanguage = (function () {
    function I18nLanguage() {
    }
    I18nLanguage.getPossibleCombinationFromLanguageCode = function (languageCode, addDefault) {
        if (addDefault === void 0) { addDefault = false; }
        var result = [];
        var splittedLanguageCodes = languageCode.split('-');
        splittedLanguageCodes = I18nLanguage._addPossibleScriptFromLanguageCode(splittedLanguageCodes);
        if (splittedLanguageCodes.length === 3) {
            result.push(splittedLanguageCodes[0] + '-' + splittedLanguageCodes[1] + '-' + splittedLanguageCodes[2]);
            result.push(splittedLanguageCodes[0] + '-' + splittedLanguageCodes[1]);
            result.push(splittedLanguageCodes[0]);
            result.push(splittedLanguageCodes[0] + '-' + splittedLanguageCodes[2]);
        }
        else if (splittedLanguageCodes.length === 2) {
            result.push(splittedLanguageCodes[0] + '-' + splittedLanguageCodes[1]);
            result.push(splittedLanguageCodes[0]);
        }
        if (addDefault) {
            result.push(I18nLanguage.defaultI18n);
        }
        var idx = result.indexOf(languageCode);
        if (idx !== 0) {
            if (idx > 0) {
                result.splice(idx, 1);
            }
            result.splice(0, 0, languageCode);
        }
        return result;
    };
    I18nLanguage.getAppLanguage = function () {
        var appLanguage = ClientSettings_1.ClientSettings.getAppLanguage();
        if (!appLanguage) {
            this.loadAppLanguage();
            appLanguage = ClientSettings_1.ClientSettings.getAppLanguage();
        }
        return appLanguage;
    };
    I18nLanguage.getSupportedLanguages = function () {
        var _this = this;
        var result = new Object();
        var mergeResult = new Object();
        var localizedString = '';
        var languages = ClientSettings_1.ClientSettings.getSupportedLanguages();
        if (languages) {
            languages.forEach(function (lang) {
                localizedString = mdk_sap_1.I18n.getLocalizedLanguageName(lang, lang);
                result = new Object();
                if (localizedString) {
                    result[lang] = _this.toTitleCase(localizedString);
                }
                else {
                    result[lang] = lang;
                }
                mergeResult = Object.assign(mergeResult, result);
            });
            return mergeResult;
        }
        return null;
    };
    I18nLanguage.isUsingDeviceLanguage = function () {
        var source = ClientSettings_1.ClientSettings.getAppLanguageSource();
        return source === LanguageSource.DeviceSetting;
    };
    I18nLanguage.loadAppLanguage = function () {
        var appLanguageIsSet = false;
        var appLanguage = ClientSettings_1.ClientSettings.getAppLanguage();
        if (appLanguage) {
            ClientSettings_1.ClientSettings.setAppLanguageIsRTL(appLanguage);
        }
        var userDefinedLanguage = ClientSettings_1.ClientSettings.getUserDefinedLanguage();
        if (userDefinedLanguage) {
            var appDiffFromUserDefined = appLanguage ? appLanguage !== userDefinedLanguage : false;
            if (!appLanguage || appDiffFromUserDefined) {
                if (I18nHelper_1.I18nHelper.getDefinition(userDefinedLanguage)) {
                    appLanguageIsSet = true;
                    this.setAppLanguage(userDefinedLanguage, LanguageSource.UserDefined);
                    Logger_1.Logger.instance.startup.log("succesfully applied user defined language as app language '" + userDefinedLanguage + "'");
                }
            }
            else {
                if (I18nHelper_1.I18nHelper.getDefinition(appLanguage)) {
                    appLanguageIsSet = true;
                    if (application.android) {
                        mdk_sap_1.I18n.applyLanguage(appLanguage);
                    }
                }
            }
        }
        if (!appLanguageIsSet) {
            var deviceLanguage = mdk_sap_1.I18n.getDeviceLanguageCode();
            if (deviceLanguage) {
                var appDiffFromDevice = appLanguage ? appLanguage !== deviceLanguage : false;
                if (!appLanguage || appDiffFromDevice) {
                    var possibleDeviceLanguages = this.getPossibleCombinationFromLanguageCode(deviceLanguage);
                    for (var _i = 0, possibleDeviceLanguages_1 = possibleDeviceLanguages; _i < possibleDeviceLanguages_1.length; _i++) {
                        var deviceLanguageEach = possibleDeviceLanguages_1[_i];
                        if (I18nHelper_1.I18nHelper.getDefinition(deviceLanguageEach)) {
                            appLanguageIsSet = true;
                            mdk_sap_1.I18n.applyLanguage('');
                            this.setAppLanguage(deviceLanguageEach, LanguageSource.DeviceSetting, false);
                            Logger_1.Logger.instance.startup.log("succesfully applied device language as app language '" + deviceLanguageEach + "'");
                            break;
                        }
                    }
                }
                else {
                    if (I18nHelper_1.I18nHelper.getDefinition(appLanguage)) {
                        appLanguageIsSet = true;
                    }
                }
            }
        }
        if (!appLanguageIsSet) {
            var defaultAppLanguage = ClientSettings_1.ClientSettings.getDefaultAppLanguage();
            if (defaultAppLanguage) {
                var appDiffFromDefault = appLanguage ? appLanguage !== defaultAppLanguage : false;
                if (!appLanguage || appDiffFromDefault) {
                    if (I18nHelper_1.I18nHelper.getDefinition(defaultAppLanguage)) {
                        appLanguageIsSet = true;
                        this.setAppLanguage(defaultAppLanguage, LanguageSource.DefaultApp);
                        Logger_1.Logger.instance.startup.log("succesfully applied default app language as app language '" + defaultAppLanguage + "'");
                    }
                }
                else {
                    if (I18nHelper_1.I18nHelper.getDefinition(appLanguage)) {
                        appLanguageIsSet = true;
                    }
                }
            }
        }
        if (!appLanguageIsSet) {
            var appDiffFromDefault = appLanguage ? appLanguage !== this.defaultI18n : false;
            if (!appLanguage || appDiffFromDefault) {
                this.setAppLanguage(this.defaultI18n, LanguageSource.Hardcoded);
                Logger_1.Logger.instance.startup.log("succesfully applied default hardcoded language as app language en");
            }
        }
        I18nRegion_1.I18nRegion.loadAppRegion();
        ClientSettings_1.ClientSettings.setAppFontScale(mdk_sap_1.I18n.getDeviceFontScale());
        this._resetSupportedLanguages();
    };
    I18nLanguage.applyLanguage = function (languageCode) {
        var languageToBeApplied = languageCode;
        if (languageCode === this.defaultI18n) {
            languageToBeApplied = this.hardcodedLanguageCode;
            if (application.ios) {
                var deviceLanguageCode = mdk_sap_1.I18n.getDeviceLanguageCode();
                if (deviceLanguageCode && deviceLanguageCode.indexOf(languageToBeApplied) === 0) {
                    languageToBeApplied = '';
                }
            }
        }
        mdk_sap_1.I18n.applyLanguage(languageToBeApplied);
    };
    I18nLanguage.setAppLanguage = function (languageCode, source, isOverride) {
        if (isOverride === void 0) { isOverride = true; }
        if (isOverride) {
            this.applyLanguage(languageCode);
        }
        ClientSettings_1.ClientSettings.setAppLanguage(languageCode);
        if (source) {
            ClientSettings_1.ClientSettings.setAppLanguageSource(source);
        }
        var appLanguage = ClientSettings_1.ClientSettings.getAppLanguage();
        if (appLanguage !== undefined && appLanguage !== '') {
            ClientSettings_1.ClientSettings.setAppLocale(I18nRegion_1.I18nRegion.getLocale());
        }
    };
    I18nLanguage.setUserDefinedLanguage = function (languageCode) {
        if (languageCode) {
            if (languageCode !== mdk_sap_1.I18n.getDeviceLanguageCode()) {
                ClientSettings_1.ClientSettings.setUserDefinedLanguage(languageCode);
                this.setAppLanguage(languageCode, LanguageSource.UserDefined);
            }
            else {
                ClientSettings_1.ClientSettings.setUserDefinedLanguage('');
                this.setAppLanguage(languageCode, LanguageSource.DeviceSetting);
            }
        }
        else {
            ClientSettings_1.ClientSettings.setUserDefinedLanguage('');
            this.loadAppLanguage();
        }
    };
    I18nLanguage.toTitleCase = function (text) {
        var titleText = '';
        var firstChar = (text.charAt(0).toUpperCase() + text.slice(1));
        var textArr = firstChar.split('(');
        for (var i = 0; i < textArr.length; i++) {
            titleText += (textArr[i].charAt(0).toUpperCase() + textArr[i].slice(1));
            if (i !== textArr.length - 1) {
                titleText += '(';
            }
        }
        return titleText;
    };
    I18nLanguage.convertSAPSpecificLanguageCode = function (language) {
        var languageCodeLowerCase = language.toLowerCase();
        if (languageCodeLowerCase.startsWith('zh')) {
            if (languageCodeLowerCase.indexOf('hant') > 2 ||
                languageCodeLowerCase.indexOf('hk') > 2 ||
                languageCodeLowerCase.indexOf('tw') > 2) {
                return 'zf';
            }
        }
        else if (languageCodeLowerCase.startsWith('sr')) {
            if (languageCodeLowerCase.indexOf('latn') > 2 ||
                languageCodeLowerCase.indexOf('rs') > 2) {
                return 'sh';
            }
        }
        return language;
    };
    I18nLanguage._adjustLanguageCodeCase = function (code) {
        code = code.replace('_', '-');
        var codeArr = code.split('-');
        if (codeArr.length === 3) {
            return codeArr[0] + '-' + this.toTitleCase(codeArr[1]) + '-' + codeArr[2].toUpperCase();
        }
        else if (codeArr.length === 2) {
            if (codeArr[1].length > 2) {
                return codeArr[0] + '-' + this.toTitleCase(codeArr[1]);
            }
            else {
                return codeArr[0] + '-' + codeArr[1].toUpperCase();
            }
        }
        else {
            return code;
        }
    };
    I18nLanguage._resetSupportedLanguages = function () {
        var _this = this;
        if (IDefinitionProvider_1.IDefinitionProvider.isDefinitionInstantiated()) {
            var appDefinition = IDefinitionProvider_1.IDefinitionProvider.instance().getApplicationDefinition();
            var resourceList = IDefinitionProvider_1.IDefinitionProvider.instance().getLocalizationResourceList();
            if (appDefinition && resourceList) {
                var defaultLocalizationRef = Application_1.Application.getApplicationParams().localization;
                if (defaultLocalizationRef) {
                    var strRef = I18nHelper_1.I18nHelper.getI18nStringReference(this.defaultI18n, defaultLocalizationRef);
                    var strRefValid = strRef ? strRef.length >= 3 : false;
                    if (strRefValid) {
                        var fileName_1 = strRef[1].replace('.properties', '');
                        var finalResourceList_1 = [];
                        var languageCode_1 = '';
                        var i18nIndex_1 = -1;
                        resourceList.forEach(function (item) {
                            i18nIndex_1 = item.indexOf('_i18n_');
                            languageCode_1 = item.substr(i18nIndex_1 + 6, item.length - i18nIndex_1 + 6)
                                .replace('_properties', '')
                                .replace(fileName_1 + '_', '')
                                .replace(fileName_1, '')
                                .replace('_', '-');
                            if (languageCode_1) {
                                languageCode_1 = _this._adjustLanguageCodeCase(languageCode_1);
                                finalResourceList_1.push(languageCode_1);
                            }
                        });
                        ClientSettings_1.ClientSettings.setSupportedLanguages(finalResourceList_1);
                    }
                }
            }
        }
    };
    I18nLanguage._addPossibleScriptFromLanguageCode = function (languageCodes) {
        if (languageCodes.length === 2) {
            for (var _i = 0, _a = I18nLanguage._languageScripts; _i < _a.length; _i++) {
                var languageItem = _a[_i];
                if (languageCodes[0] === languageItem.language
                    && languageCodes[1] === languageItem.region) {
                    return [languageItem.language, languageItem.script, languageItem.region];
                }
            }
        }
        return languageCodes;
    };
    I18nLanguage.defaultI18n = 'DEFAULT';
    I18nLanguage.hardcodedLanguageCode = 'en';
    I18nLanguage._languageScripts = [
        {
            language: 'zh',
            region: 'CN',
            script: 'Hans'
        },
        {
            language: 'zh',
            region: 'TW',
            script: 'Hant'
        },
        {
            language: 'zh',
            region: 'HK',
            script: 'Hant'
        }
    ];
    return I18nLanguage;
}());
exports.I18nLanguage = I18nLanguage;
;
