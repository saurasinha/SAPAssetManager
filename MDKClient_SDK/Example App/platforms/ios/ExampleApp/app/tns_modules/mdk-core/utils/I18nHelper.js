"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var Logger_1 = require("../utils/Logger");
var ValueResolver_1 = require("../utils/ValueResolver");
var IContext_1 = require("../context/IContext");
var PropertyTypeChecker_1 = require("../utils/PropertyTypeChecker");
var I18nFormatter_1 = require("../utils/I18nFormatter");
var I18nLanguage_1 = require("../utils/I18nLanguage");
var ClientSettings_1 = require("../storage/ClientSettings");
var extControlSource = require("../common/ExtensionControlSource");
var fs = require("tns-core-modules/file-system");
var CommonUtil_1 = require("./CommonUtil");
var Application_1 = require("../Application");
var i18n_1 = require("../i18n");
var LocalizationStringSource;
(function (LocalizationStringSource) {
    LocalizationStringSource[LocalizationStringSource["Bundle"] = 1] = "Bundle";
    LocalizationStringSource[LocalizationStringSource["Extension"] = 2] = "Extension";
    LocalizationStringSource[LocalizationStringSource["MDK"] = 3] = "MDK";
})(LocalizationStringSource = exports.LocalizationStringSource || (exports.LocalizationStringSource = {}));
var I18nHelper = (function () {
    function I18nHelper() {
    }
    I18nHelper.getDefinition = function (languageCode, stringSource, localizationFolder) {
        if (stringSource === void 0) { stringSource = LocalizationStringSource.Bundle; }
        if (localizationFolder === void 0) { localizationFolder = ''; }
        var i18nObj = null;
        if (IDefinitionProvider_1.IDefinitionProvider.isDefinitionInstantiated()) {
            var appDefinition = IDefinitionProvider_1.IDefinitionProvider.instance().getApplicationDefinition();
            if (appDefinition) {
                var defaultLocalizationRef = void 0;
                if (stringSource === LocalizationStringSource.MDK) {
                    defaultLocalizationRef = this.mdkI18nPath + '/' + this.defaultMDKFileName;
                }
                else {
                    defaultLocalizationRef = Application_1.Application.getApplicationParams().localization;
                }
                if (defaultLocalizationRef) {
                    var localizationRefArr = this.getI18nStringReference(languageCode, defaultLocalizationRef);
                    var refArrValid = localizationRefArr ? localizationRefArr.length === 3 : false;
                    if (refArrValid) {
                        switch (stringSource) {
                            case LocalizationStringSource.Bundle:
                                i18nObj = this._getBundleDefinition(IDefinitionProvider_1.IDefinitionProvider.instance(), localizationRefArr[0]);
                                break;
                            case LocalizationStringSource.Extension:
                                var resolveDef = true;
                                var resolveExt = true;
                                var extSource = undefined;
                                var extSourceMap = ClientSettings_1.ClientSettings.getExtensionControlSourceMap();
                                if (extSourceMap) {
                                    if (extSourceMap.hasOwnProperty(localizationFolder)) {
                                        extSource = extSourceMap[localizationFolder];
                                    }
                                }
                                if (extSource !== undefined) {
                                    if (extControlSource.isMetadataSource(extSource)) {
                                        resolveExt = false;
                                    }
                                    else if (extControlSource.isExtensionSource(extSource)) {
                                        resolveDef = false;
                                    }
                                }
                                if (resolveDef) {
                                    i18nObj = this._getBundleDefinition(IDefinitionProvider_1.IDefinitionProvider.instance(), this._getExtensionBundleDefPath(appDefinition.name, localizationFolder, localizationRefArr[1]));
                                }
                                if (!i18nObj && resolveExt) {
                                    i18nObj = this._getExtensionDefinition(localizationRefArr[1], localizationFolder);
                                }
                                break;
                            case LocalizationStringSource.MDK:
                                i18nObj = this._getMDKDefinition(localizationRefArr[1]);
                                break;
                            default:
                                i18nObj = this._getBundleDefinition(IDefinitionProvider_1.IDefinitionProvider.instance(), localizationRefArr[0]);
                                break;
                        }
                    }
                }
            }
        }
        return i18nObj;
    };
    I18nHelper.getI18nStringReference = function (languageCode, localizationStringRef) {
        var result = [];
        var frontPartRef = '';
        var folderPartRef = '';
        var fileNamePartRef = '';
        var extPartRef = '';
        var replacePos = localizationStringRef.lastIndexOf('.');
        if (replacePos > 0) {
            frontPartRef = localizationStringRef.substr(0, replacePos);
            extPartRef = localizationStringRef.substr(replacePos, localizationStringRef.length - replacePos);
            var lastSlashPos = frontPartRef.lastIndexOf('/');
            if (lastSlashPos > 0) {
                folderPartRef = frontPartRef.substr(0, lastSlashPos + 1);
                fileNamePartRef = frontPartRef.substr(lastSlashPos + 1, frontPartRef.length - lastSlashPos + 1);
            }
        }
        if (frontPartRef !== '' && fileNamePartRef !== '' && extPartRef !== '') {
            if (languageCode !== I18nLanguage_1.I18nLanguage.defaultI18n) {
                var languagePartRef = '_' + languageCode.replace(/-/g, '_');
                result.push(folderPartRef + fileNamePartRef + languagePartRef + extPartRef);
                result.push(fileNamePartRef + languagePartRef + extPartRef);
            }
            else {
                result.push(folderPartRef + fileNamePartRef + extPartRef);
                result.push(fileNamePartRef + extPartRef);
            }
            result.push(fileNamePartRef + extPartRef);
        }
        return result;
    };
    I18nHelper.localizeDefinitionText = function (key, dynamicParams, context) {
        return this._localizeText(key, LocalizationStringSource.Bundle, dynamicParams, context);
    };
    I18nHelper.localizeExtensionText = function (key, localizationFolder, dynamicParams, context) {
        return this._localizeText(key, LocalizationStringSource.Extension, dynamicParams, context, localizationFolder);
    };
    I18nHelper.localizeMDKText = function (key, dynamicParams, context) {
        return this._localizeText(key, LocalizationStringSource.MDK, dynamicParams, context);
    };
    I18nHelper.parseLocalizableString = function (value, context) {
        var _this = this;
        if (context === void 0) { context = IContext_1.fromPage(); }
        var finalValue = '';
        var count = (value.match(/\$\(/g) || []).length;
        if (count > 0) {
            var sValues = value.split('$(');
            sValues = sValues.filter(Boolean);
            sValues.forEach(function (splittedValue) {
                finalValue += _this._manageLocalizableString(splittedValue, context);
            });
        }
        return finalValue;
    };
    I18nHelper.getLocalizableKey = function (value) {
        var key = value;
        var count = (value.match(/\$\(/g) || []).length;
        if (count > 0) {
            value = value.trim();
            if (value.indexOf('$(') === 0 && value.lastIndexOf(')') === value.length - 1) {
                value = value.substr(2, value.length - 3);
                var lValues = value.split(',');
                if (lValues.length >= 2) {
                    var lValuesToBeInspected = lValues;
                    lValuesToBeInspected.splice(0, 1);
                    var inspectedValues = CommonUtil_1.CommonUtil.inspectIndicatorValues(lValuesToBeInspected);
                    key = inspectedValues[0];
                }
            }
        }
        return key;
    };
    I18nHelper._getBundleDefinition = function (defProvider, localizationRef) {
        if (defProvider) {
            var i18nObj = null;
            if (defProvider.isDefinitionPathValid(localizationRef)) {
                i18nObj = defProvider.getDefinition(localizationRef);
                return i18nObj;
            }
        }
        return null;
    };
    I18nHelper._getExtensionDefinition = function (fileNameRef, localizationFolder) {
        var _this = this;
        if (localizationFolder === void 0) { localizationFolder = ''; }
        var extLocalizationFolder = localizationFolder !== '' ? localizationFolder + '/' : '';
        var folderPath = 'extensions/' + extLocalizationFolder + 'i18n/';
        var filePath = folderPath + fileNameRef;
        var currentAppPath = fs.knownFolders.currentApp().path;
        var extensionI18nFilePath = fs.path.join(currentAppPath, filePath);
        if (!fs.File.exists(extensionI18nFilePath)) {
            return null;
        }
        var file = fs.File.fromPath(extensionI18nFilePath);
        var fileData = file.readTextSync(function (e) {
            _this._onParseFail('I18nHelper._getExtensionDefinition() - strings file not found: ', fileNameRef, e);
        });
        return fileData;
    };
    I18nHelper._getExtensionBundleDefPath = function (appDefName, locFolder, locFileName) {
        var extLocDefPath = fs.path.join('/' + appDefName, I18nHelper._defaultExtensionFolderName);
        if (locFolder) {
            extLocDefPath = fs.path.join(extLocDefPath, locFolder);
        }
        extLocDefPath = fs.path.join(extLocDefPath, I18nHelper._defaultI18nFolderName);
        extLocDefPath = fs.path.join(extLocDefPath, locFileName);
        return extLocDefPath;
    };
    I18nHelper._getMDKDefinition = function (fileNameRef) {
        var fileData = null;
        if (i18n_1.mdkI18n.hasOwnProperty(fileNameRef)) {
            fileData = i18n_1.mdkI18n[fileNameRef];
        }
        return fileData;
    };
    I18nHelper._i18nMatchKeyValuePair = function (i18nStrings, sKey) {
        var strings = '';
        var value = '';
        var i18nArr = i18nStrings.split('\n');
        var i18nStringSeparatorIdx = -1;
        var firstString = '';
        var secondString = '';
        for (var _i = 0, i18nArr_1 = i18nArr; _i < i18nArr_1.length; _i++) {
            var i18nString = i18nArr_1[_i];
            i18nStringSeparatorIdx = i18nString.indexOf('=');
            firstString = i18nString.substr(0, i18nStringSeparatorIdx).trim();
            if (firstString === sKey) {
                secondString = i18nString.substr(i18nStringSeparatorIdx + 1, i18nString.length - i18nStringSeparatorIdx + 1).trim();
                return secondString.replace(/\\n/g, '\n');
            }
        }
        return '';
    };
    I18nHelper._localize = function (localizableValue, context) {
        var result = localizableValue;
        var value;
        var lValues = localizableValue.split(',');
        if (lValues.length >= 2) {
            var lType = lValues[0].replace('$(', '').trim();
            var lValuesToBeInspected = lValues;
            lValuesToBeInspected.splice(0, 1);
            var inspectedValues = CommonUtil_1.CommonUtil.inspectIndicatorValues(lValuesToBeInspected);
            value = inspectedValues[0];
            result = value;
            var resolvedValue = value;
            if (PropertyTypeChecker_1.PropertyTypeChecker.isBinding(value)) {
                resolvedValue = ValueResolver_1.ValueResolver.parseBinding(value, context);
            }
            result = resolvedValue;
            var count = 0;
            var options = void 0;
            var customLocale = null;
            var customTimeZone = null;
            var customOptions = null;
            var validatedValue = null;
            if (resolvedValue) {
                switch (lType) {
                    case 'L':
                        var dynamicParams = null;
                        if (inspectedValues.length >= 2) {
                            dynamicParams = [];
                            for (var i = 1; i < inspectedValues.length; i++) {
                                dynamicParams.push(inspectedValues[i]);
                            }
                        }
                        result = this.localizeDefinitionText(resolvedValue, dynamicParams, context);
                        break;
                    case 'N':
                    case 'P':
                    case 'S':
                        validatedValue = I18nFormatter_1.I18nFormatter.validateNumber(resolvedValue);
                        if (validatedValue) {
                            options = lType === 'N' ? Object.assign({}, I18nFormatter_1.I18nFormatter.numberOptions) :
                                lType === 'P' ? Object.assign({}, I18nFormatter_1.I18nFormatter.percentageOptions) :
                                    lType === 'S' ? Object.assign({}, I18nFormatter_1.I18nFormatter.scientificOptions) :
                                        Object.assign({}, I18nFormatter_1.I18nFormatter.numberOptions);
                            if (inspectedValues.length >= 2) {
                                if (inspectedValues[1] !== '' && inspectedValues[1] !== 'null') {
                                    customLocale = inspectedValues[1];
                                }
                            }
                            if (inspectedValues.length >= 3) {
                                var customOptionsStr = '';
                                if (inspectedValues[2].indexOf('{') === 0) {
                                    for (var i = 2; i < inspectedValues.length; i++) {
                                        customOptionsStr += inspectedValues[i];
                                        if (inspectedValues[i].indexOf('}') === inspectedValues[i].length - 1) {
                                            break;
                                        }
                                        else {
                                            customOptionsStr += ',';
                                        }
                                    }
                                    customOptions = this._parseStringToJSObject(customOptionsStr);
                                    options = I18nFormatter_1.I18nFormatter.parseFormatOptions(options, customOptions);
                                }
                            }
                            result = I18nFormatter_1.I18nFormatter.formatNumberToLocaleString(validatedValue, options, customLocale);
                        }
                        break;
                    case 'C':
                        validatedValue = I18nFormatter_1.I18nFormatter.validateNumber(resolvedValue);
                        if (validatedValue) {
                            if (inspectedValues.length >= 2) {
                                var currencyCode = inspectedValues[1];
                                if (PropertyTypeChecker_1.PropertyTypeChecker.isBinding(currencyCode)) {
                                    currencyCode = ValueResolver_1.ValueResolver.parseBinding(currencyCode, context);
                                }
                                else if (inspectedValues[1].length !== 3) {
                                    currencyCode = '';
                                }
                                if (currencyCode) {
                                    options = Object.assign({}, I18nFormatter_1.I18nFormatter.currencyOptions);
                                    options.currency = currencyCode;
                                    if (inspectedValues.length >= 3) {
                                        if (inspectedValues[2] !== '' && inspectedValues[2] !== 'null') {
                                            customLocale = inspectedValues[2];
                                        }
                                    }
                                    if (inspectedValues.length >= 4) {
                                        var customOptionsStr = '';
                                        if (inspectedValues[3].indexOf('{') === 0) {
                                            for (var i = 3; i < inspectedValues.length; i++) {
                                                customOptionsStr += inspectedValues[i];
                                                if (inspectedValues[i].indexOf('}') === inspectedValues[i].length - 1) {
                                                    break;
                                                }
                                                else {
                                                    customOptionsStr += ',';
                                                }
                                            }
                                            customOptions = this._parseStringToJSObject(customOptionsStr);
                                            options = I18nFormatter_1.I18nFormatter.parseFormatOptions(options, customOptions);
                                        }
                                    }
                                    result = I18nFormatter_1.I18nFormatter.formatNumberToLocaleString(validatedValue, options, customLocale);
                                }
                            }
                        }
                        break;
                    case 'D':
                    case 'T':
                    case 'DT':
                        validatedValue = I18nFormatter_1.I18nFormatter.validateDate(resolvedValue);
                        if (validatedValue) {
                            if (inspectedValues.length >= 2) {
                                if (inspectedValues[1] !== '' && inspectedValues[1] !== 'null') {
                                    customLocale = inspectedValues[1];
                                }
                            }
                            if (inspectedValues.length >= 3) {
                                if (inspectedValues[2] !== '' && inspectedValues[2] !== 'null') {
                                    customTimeZone = inspectedValues[2];
                                }
                            }
                            if (inspectedValues.length >= 4) {
                                var customOptionsStr = '';
                                if (inspectedValues[3].indexOf('{') === 0) {
                                    for (var i = 3; i < inspectedValues.length; i++) {
                                        customOptionsStr += inspectedValues[i];
                                        if (inspectedValues[i].indexOf('}') === inspectedValues[i].length - 1) {
                                            break;
                                        }
                                        else {
                                            customOptionsStr += ',';
                                        }
                                    }
                                    customOptions = this._parseStringToJSObject(customOptionsStr);
                                }
                            }
                            result = I18nFormatter_1.I18nFormatter.formatDateToLocaleString(validatedValue, lType, customLocale, customTimeZone, customOptions);
                        }
                        break;
                    default:
                        Logger_1.Logger.instance.i18n.error("Invalid localizable format type " + lType + " from " + localizableValue + "\nContinuing in unresolved value");
                        result = resolvedValue.toString();
                        break;
                }
            }
        }
        return result;
    };
    I18nHelper._localizeString = function (sKey, stringSource, localizationFolder) {
        if (stringSource === void 0) { stringSource = LocalizationStringSource.Bundle; }
        if (localizationFolder === void 0) { localizationFolder = ''; }
        var result = '';
        var appLanguage = I18nLanguage_1.I18nLanguage.getAppLanguage();
        if (appLanguage) {
            var possibleAppLanguages = [];
            if (appLanguage !== I18nLanguage_1.I18nLanguage.defaultI18n) {
                possibleAppLanguages = I18nLanguage_1.I18nLanguage.getPossibleCombinationFromLanguageCode(appLanguage, true);
            }
            else {
                possibleAppLanguages.push(appLanguage);
            }
            var i18nObj = null;
            for (var _i = 0, possibleAppLanguages_1 = possibleAppLanguages; _i < possibleAppLanguages_1.length; _i++) {
                var appLanguageEach = possibleAppLanguages_1[_i];
                i18nObj = this.getDefinition(appLanguageEach, stringSource, localizationFolder);
                if (i18nObj) {
                    result = this._i18nMatchKeyValuePair(i18nObj, sKey);
                    if (result !== '') {
                        return result;
                    }
                }
            }
        }
        else {
            this._onParseFail('I18nHelper._localizeString(): no app language found', sKey, new Error('key not found'));
            return sKey;
        }
        this._onParseFail('I18nHelper._localizeString()', sKey, new Error('key not found'));
        return sKey;
    };
    I18nHelper._localizeText = function (key, stringSource, dynamicParams, context, localizationFolder) {
        if (stringSource === void 0) { stringSource = LocalizationStringSource.Bundle; }
        var result = this._localizeString(key, stringSource, localizationFolder);
        var paramExists = dynamicParams ? dynamicParams.length > 0 : false;
        if (paramExists) {
            var paramValue = '';
            var resolvedLParamValues = [];
            for (var _i = 0, dynamicParams_1 = dynamicParams; _i < dynamicParams_1.length; _i++) {
                var paramEach = dynamicParams_1[_i];
                if (PropertyTypeChecker_1.PropertyTypeChecker.isBinding(paramEach)) {
                    resolvedLParamValues.push(ValueResolver_1.ValueResolver.parseBinding(paramEach, context));
                }
                else {
                    resolvedLParamValues.push(paramEach);
                }
            }
            for (var j = 0; j < resolvedLParamValues.length; j++) {
                result = result.replace('{' + j + '}', resolvedLParamValues[j]);
            }
        }
        return result;
    };
    I18nHelper._manageLocalizableString = function (value, context) {
        var promises = [];
        var localizeStart;
        var localizeEnd;
        var trimmedLValue = '';
        var finalValue = '';
        var befValue = '';
        var aftValue = '';
        if (value !== '') {
            befValue = '';
            aftValue = '';
            localizeEnd = value.indexOf(')');
            if (localizeEnd >= 1) {
                value = '$(' + value;
                localizeStart = 0;
                localizeEnd += 2;
                trimmedLValue = value.substr(2, localizeEnd - 2);
                var localizedValue = this._localize(trimmedLValue, context);
                if (localizeEnd + 1 !== value.length) {
                    aftValue = value.substr(localizeEnd + 1, value.length - localizeEnd + 1);
                }
                finalValue += localizedValue + aftValue;
            }
            else {
                finalValue += value;
            }
        }
        return finalValue;
    };
    I18nHelper._onParseFail = function (origin, value, error) {
        Logger_1.Logger.instance.i18n.error(origin + " Failed to parse value of " + value + ": " + error + "\n Continuing");
    };
    I18nHelper._parseStringToJSObject = function (optionsStr) {
        optionsStr = optionsStr.replace('{', '').replace('}', '');
        var optionsArr = optionsStr.split(',');
        var optionKeyValueArr = [];
        var key = '';
        var value = '';
        var obj = {};
        for (var _i = 0, optionsArr_1 = optionsArr; _i < optionsArr_1.length; _i++) {
            var optionEach = optionsArr_1[_i];
            optionKeyValueArr = optionEach.split(':');
            optionKeyValueArr = CommonUtil_1.CommonUtil.inspectIndicatorValues(optionKeyValueArr);
            obj[optionKeyValueArr[0]] = optionKeyValueArr[1];
        }
        return obj;
    };
    I18nHelper.mdkI18nPath = 'mdk-core/i18n';
    I18nHelper.defaultMDKFileName = 'i18n.properties';
    I18nHelper._defaultExtensionFolderName = 'Extensions';
    I18nHelper._defaultI18nFolderName = 'i18n';
    return I18nHelper;
}());
exports.I18nHelper = I18nHelper;
;
