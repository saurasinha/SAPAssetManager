"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("tns-core-modules/utils/utils");
var I18n = (function () {
    function I18n() {
    }
    I18n.applyLanguage = function (languageCode) {
        if (NSUserDefaults.standardUserDefaults) {
            NSUserDefaults.standardUserDefaults.removeObjectForKey('AppleLanguages');
            if (languageCode) {
                var languageArr = [languageCode];
                NSUserDefaults.standardUserDefaults.setObjectForKey(languageArr, 'AppleLanguages');
                NSUserDefaults.standardUserDefaults.synchronize();
            }
        }
    };
    I18n.formatDateToLocaleString = function (date, format, customLocale, customTimeZone, customOptions) {
        var formatter = NSDateFormatter.alloc().init();
        var customStyle = (customOptions ? customOptions.format : '').toLowerCase();
        if (customLocale) {
            formatter.locale = NSLocale.alloc().initWithLocaleIdentifier(customLocale);
        }
        switch (customStyle) {
            case 'short':
                formatter.dateStyle = 1;
                formatter.timeStyle = 1;
                break;
            case 'medium':
                formatter.dateStyle = 2;
                formatter.timeStyle = 2;
                break;
            case 'long':
                formatter.dateStyle = 3;
                formatter.timeStyle = 3;
                break;
            case 'full':
                formatter.dateStyle = 4;
                formatter.timeStyle = 4;
                break;
            default:
                formatter.dateStyle = 2;
                formatter.timeStyle = 1;
        }
        if (format === 'D') {
            formatter.timeStyle = 0;
        }
        else if (format === 'T') {
            formatter.dateStyle = 0;
        }
        if (customTimeZone) {
            var timeZone = NSTimeZone.alloc().initWithName(customTimeZone);
            if (timeZone) {
                formatter.timeZone = timeZone;
            }
        }
        return formatter.stringFromDate(date);
    };
    I18n.formatNumberToLocaleString = function (value, options, customLocale, patterns) {
        var numberFormat = NSNumberFormatter.alloc().init();
        if (customLocale) {
            numberFormat.locale = NSLocale.alloc().initWithLocaleIdentifier(customLocale);
        }
        if (options) {
            if (options.style !== void 0) {
                switch (options.style.toLowerCase()) {
                    case 'decimal':
                        numberFormat.numberStyle = 1;
                        break;
                    case 'percent':
                        numberFormat.numberStyle = 3;
                        break;
                    case 'scientific':
                        numberFormat.numberStyle = 4;
                        if (utils_1.ios.MajorVersion < 13) {
                            if (options.minimumFractionDigits !== void 0 && options.minimumFractionDigits !== null) {
                                options.minimumFractionDigits = options.minimumFractionDigits + 1;
                            }
                            if (options.maximumFractionDigits !== void 0 && options.maximumFractionDigits !== null) {
                                options.maximumFractionDigits = options.maximumFractionDigits + 1;
                            }
                        }
                        break;
                    case 'currency':
                        numberFormat.numberStyle = 2;
                        if (options.currency !== void 0) {
                            numberFormat.currencyCode = options.currency;
                        }
                        if (!patterns && options.currencyDisplay === 'code') {
                            var tempPattern = numberFormat.positiveFormat;
                            tempPattern = tempPattern.replace('¤', '¤¤');
                            numberFormat.positiveFormat = tempPattern;
                        }
                        break;
                    default:
                        numberFormat.numberStyle = 1;
                        break;
                }
            }
            else {
                numberFormat.numberStyle = 1;
            }
            if (options.minimumIntegerDigits !== void 0 && options.minimumIntegerDigits !== null) {
                numberFormat.minimumIntegerDigits = options.minimumIntegerDigits;
            }
            if (options.minimumFractionDigits !== void 0 && options.minimumFractionDigits !== null) {
                numberFormat.minimumFractionDigits = options.minimumFractionDigits;
            }
            if (options.maximumFractionDigits !== void 0 && options.maximumFractionDigits !== null) {
                numberFormat.maximumFractionDigits = options.maximumFractionDigits;
            }
            if (options.useGrouping !== void 0 && options.useGrouping !== null) {
                numberFormat.usesGroupingSeparator = options.useGrouping;
            }
        }
        if (patterns) {
            numberFormat.positiveFormat = patterns;
        }
        return numberFormat.stringFromNumber(value);
    };
    I18n.getDeviceLanguageCode = function () {
        var originalNSDefaultLanguage = this.getNSDefaultLanguage();
        this.applyLanguage('');
        var deviceLanguage = this.getNSDefaultLanguage();
        if (deviceLanguage !== originalNSDefaultLanguage) {
            this.applyLanguage(originalNSDefaultLanguage);
        }
        return deviceLanguage;
    };
    I18n.getDeviceRegionCode = function () {
        return NSLocale.currentLocale.countryCode;
    };
    I18n.getDeviceFontScale = function () {
        return 1;
    };
    I18n.getDeviceRegionCodeList = function () {
        var arrayCount = NSLocale.ISOCountryCodes.count;
        var regionCodeList = [];
        for (var i = 0; i < arrayCount; i++) {
            var countryCode = NSLocale.ISOCountryCodes.objectAtIndex(i);
            regionCodeList.push(countryCode);
        }
        return regionCodeList;
    };
    I18n.getDeviceRegionName = function (currentAppLocale, countryCode) {
        var locale = NSLocale.alloc().initWithLocaleIdentifier(currentAppLocale);
        return locale.displayNameForKeyValue(NSLocaleCountryCode, countryCode);
    };
    I18n.getLocalizedLanguageName = function (currentAppLocale, languageCode) {
        var appNSLocale = NSLocale.alloc().initWithLocaleIdentifier(currentAppLocale);
        return appNSLocale.localizedStringForLocaleIdentifier(languageCode);
    };
    I18n.getNSDefaultLanguage = function () {
        var languageCode = '';
        var languageObj = NSUserDefaults.standardUserDefaults.objectForKey('AppleLanguages');
        if (languageObj) {
            languageCode = languageObj.count > 0 ? languageObj[0] : '';
        }
        return languageCode;
    };
    return I18n;
}());
exports.I18n = I18n;
;
