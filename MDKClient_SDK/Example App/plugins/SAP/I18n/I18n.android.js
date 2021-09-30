"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("tns-core-modules/utils/utils");
var I18n = (function () {
    function I18n() {
    }
    I18n.applyLanguage = function (languageCode) {
        var finalLocale;
        if (languageCode === '') {
            finalLocale = this.getDeviceLocale();
        }
        else {
            var locale = java.util.Locale.forLanguageTag(languageCode);
            var finalLanguageCode = locale ? locale.getLanguage() : languageCode;
            var script = locale.getScript();
            if (script) {
                finalLocale = new java.util.Locale.Builder().setLanguage(finalLanguageCode).setScript(script)
                    .setRegion(this.getDeviceRegionCode()).build();
            }
            else {
                finalLocale = new java.util.Locale(finalLanguageCode, this.getDeviceRegionCode());
            }
        }
        if (finalLocale) {
            com.sap.mdk.client.ui.common.LocaleManager.setNewLocale(utils.ad.getApplicationContext(), finalLocale);
        }
    };
    I18n.formatDateToLocaleString = function (date, format, customLocale, customTimeZone, customOptions) {
        if (date) {
            var dateTimePattern = this.getDateTimePattern(format, customLocale, customOptions);
            var simpleDateFormat = customLocale ?
                new java.text.SimpleDateFormat(dateTimePattern, this.getLocale(customLocale)) :
                new java.text.SimpleDateFormat(dateTimePattern);
            if (customTimeZone) {
                var timeZone = java.util.TimeZone.getTimeZone(customTimeZone);
                if (timeZone) {
                    simpleDateFormat.setTimeZone(timeZone);
                }
            }
            return simpleDateFormat.format(new java.util.Date(date.valueOf())).toString();
        }
        return '';
    };
    I18n.formatNumberToLocaleString = function (value, options, customLocale, patterns) {
        var numberFormat;
        var locale = this.getLocale(customLocale);
        if (patterns) {
            numberFormat = new java.text.DecimalFormat(patterns);
        }
        else {
            if (options) {
                if (options.style !== void 0) {
                    switch (options.style.toLowerCase()) {
                        case 'decimal':
                            numberFormat = java.text.NumberFormat.getNumberInstance(locale);
                            break;
                        case 'percent':
                            numberFormat = java.text.NumberFormat.getPercentInstance(locale);
                            break;
                        case 'scientific':
                            var eHashCount = value.toString().length - 1;
                            var eHash = '';
                            for (var i = 0; i < eHashCount; i++) {
                                eHash += '#';
                            }
                            numberFormat = new java.text.DecimalFormat('0.' + eHash + 'E0');
                            break;
                        case 'currency':
                            numberFormat = java.text.NumberFormat.getCurrencyInstance(locale);
                            if (options.currency !== void 0) {
                                numberFormat.setCurrency(java.util.Currency.getInstance(options.currency));
                            }
                            break;
                        default:
                            numberFormat = java.text.NumberFormat.getNumberInstance(locale);
                            break;
                    }
                }
                else {
                    numberFormat = java.text.NumberFormat.getNumberInstance(locale);
                }
            }
        }
        var decimalFormatSymbols = locale ?
            new java.text.DecimalFormatSymbols(locale) :
            new java.text.DecimalFormatSymbols();
        if (options && (options.style.toLowerCase() === 'currency' && options.currencyDisplay)) {
            if (!patterns && options.currencyDisplay === 'code') {
                var currrentPattern = numberFormat.toPattern();
                currrentPattern = currrentPattern.replace('¤', '¤¤');
                numberFormat = new java.text.DecimalFormat(currrentPattern);
            }
            if (options.currency !== void 0) {
                decimalFormatSymbols.setCurrency(java.util.Currency.getInstance(options.currency));
            }
        }
        numberFormat.setDecimalFormatSymbols(decimalFormatSymbols);
        if (options) {
            if (options.minimumIntegerDigits !== void 0 && options.minimumIntegerDigits !== null) {
                numberFormat.setMinimumIntegerDigits(options.minimumIntegerDigits);
            }
            if (options.minimumFractionDigits !== void 0 && options.minimumFractionDigits !== null) {
                numberFormat.setMinimumFractionDigits(options.minimumFractionDigits);
            }
            if (options.maximumFractionDigits !== void 0 && options.maximumFractionDigits !== null) {
                numberFormat.setMaximumFractionDigits(options.maximumFractionDigits);
            }
            if (options.useGrouping !== void 0 && options.useGrouping !== null) {
                numberFormat.setGroupingUsed(options.useGrouping);
            }
        }
        return numberFormat.format(value);
    };
    I18n.getDeviceLanguageCode = function () {
        return this.getDeviceLocale().toLanguageTag();
    };
    I18n.getDeviceRegionCode = function () {
        return android.content.res.Resources.getSystem().getConfiguration().locale.getCountry();
    };
    I18n.getDeviceFontScale = function () {
        return android.content.res.Resources.getSystem().getConfiguration().fontScale;
    };
    I18n.getDeviceRegionCodeList = function () {
        var regionCodeList = [];
        var isoCountries = java.util.Locale.getISOCountries();
        for (var i = 0; i < isoCountries.length; i++) {
            regionCodeList[i] = isoCountries[i];
        }
        return regionCodeList;
    };
    I18n.getDeviceRegionName = function (currentAppLocale, countryCode) {
        var locale = this.getLocale(currentAppLocale);
        return new java.util.Locale('en', countryCode).getDisplayCountry(locale);
    };
    I18n.getLocalizedLanguageName = function (currentAppLocale, languageCode) {
        var sourcelocale = java.util.Locale.forLanguageTag(currentAppLocale);
        var targetLocale = java.util.Locale.forLanguageTag(languageCode);
        return sourcelocale.getDisplayName(targetLocale);
    };
    I18n.getLocale = function (locale) {
        if (this.localesCache.has(locale)) {
            return this.localesCache.get(locale);
        }
        var result;
        if (locale) {
            locale = locale.replace(/_/g, '-');
            var firstHypenIndex = locale.indexOf('-');
            var lang = '';
            var country = '';
            if (firstHypenIndex > -1) {
                lang = locale.substr(0, firstHypenIndex);
                var nextHypenIndex = locale.substr(firstHypenIndex + 1).indexOf('-');
                country = locale.substr(firstHypenIndex + 1, (nextHypenIndex > -1) ? nextHypenIndex : undefined);
            }
            else {
                lang = locale;
            }
            if (country !== '') {
                result = new java.util.Locale(lang, country);
            }
            else {
                result = new java.util.Locale(lang);
            }
        }
        else {
            result = new java.util.Locale('en', 'US');
        }
        this.localesCache.set(locale, result);
        return result;
    };
    I18n.getDeviceLocale = function () {
        return android.content.res.Resources.getSystem().getConfiguration().locale;
    };
    I18n.getDateTimePattern = function (format, locale, customOptions) {
        var result = '';
        var nativeLocale = undefined;
        var dateOption = undefined;
        var timeOption = undefined;
        var customStyle = (customOptions ? customOptions.format : '').toLowerCase();
        if (locale) {
            nativeLocale = this.getLocale(locale);
        }
        switch (customStyle) {
            case 'short':
                dateOption = java.text.DateFormat.SHORT;
                timeOption = java.text.DateFormat.SHORT;
                break;
            case 'medium':
                dateOption = java.text.DateFormat.MEDIUM;
                timeOption = java.text.DateFormat.MEDIUM;
                break;
            case 'long':
                dateOption = java.text.DateFormat.LONG;
                timeOption = java.text.DateFormat.LONG;
                break;
            case 'full':
                dateOption = java.text.DateFormat.FULL;
                timeOption = java.text.DateFormat.FULL;
                break;
            default:
                dateOption = java.text.DateFormat.DEFAULT;
                timeOption = java.text.DateFormat.SHORT;
        }
        if (format === 'D') {
            timeOption = undefined;
        }
        else if (format === 'T') {
            dateOption = undefined;
        }
        var dateFormat;
        if (nativeLocale) {
            if (dateOption !== undefined && timeOption !== undefined) {
                dateFormat = java.text.DateFormat.getDateTimeInstance(dateOption, timeOption, nativeLocale);
            }
            else if (dateOption !== undefined) {
                dateFormat = java.text.DateFormat.getDateInstance(dateOption, nativeLocale);
            }
            else if (timeOption !== undefined) {
                dateFormat = java.text.DateFormat.getTimeInstance(timeOption, nativeLocale);
            }
        }
        else {
            if (dateOption !== undefined && timeOption !== undefined) {
                dateFormat = java.text.DateFormat.getDateTimeInstance(dateOption, timeOption);
            }
            else if (dateOption !== undefined) {
                dateFormat = java.text.DateFormat.getDateInstance(dateOption);
            }
            else if (timeOption !== undefined) {
                dateFormat = java.text.DateFormat.getTimeInstance(timeOption);
            }
        }
        result = dateFormat.toPattern();
        if (timeOption !== undefined) {
            if (android.text.format.DateFormat.is24HourFormat(utils.ad.getApplicationContext())) {
                if (result.indexOf('a') > -1) {
                    result = result.replace('h:mm a', 'HH:mm');
                }
            }
            else {
                if (result.indexOf('a') === -1) {
                    result = result.replace('HH:mm', 'h:mm a');
                }
            }
        }
        return result;
    };
    I18n.localesCache = new Map();
    return I18n;
}());
exports.I18n = I18n;
;
