"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientSettings_1 = require("../storage/ClientSettings");
var mdk_sap_1 = require("mdk-sap");
var I18nFormatter = (function () {
    function I18nFormatter() {
    }
    I18nFormatter.formatDateToLocaleString = function (date, format, customLocale, customTimeZone, customOptions) {
        if (!customLocale) {
            customLocale = ClientSettings_1.ClientSettings.getAppLocale();
        }
        return mdk_sap_1.I18n.formatDateToLocaleString(date, format, customLocale, customTimeZone, customOptions);
    };
    I18nFormatter.formatNumberToLocaleString = function (value, options, customLocale, patterns) {
        if (!customLocale) {
            customLocale = ClientSettings_1.ClientSettings.getAppLocale();
        }
        return mdk_sap_1.I18n.formatNumberToLocaleString(value, options, customLocale, patterns);
    };
    I18nFormatter.parseFormatOptions = function (defaultOptions, customOptions) {
        var options = defaultOptions;
        if (customOptions) {
            if (customOptions.minimumIntegerDigits !== void 0 && customOptions.minimumIntegerDigits !== null &&
                customOptions.minimumIntegerDigits !== undefined) {
                if (typeof customOptions.minimumIntegerDigits !== 'number') {
                    customOptions.minimumIntegerDigits = Number(customOptions.minimumIntegerDigits);
                }
                options.minimumIntegerDigits = customOptions.minimumIntegerDigits;
            }
            if (customOptions.minimumFractionDigits !== void 0 && customOptions.minimumFractionDigits !== null &&
                customOptions.minimumFractionDigits !== undefined) {
                if (typeof customOptions.minimumFractionDigits !== 'number') {
                    customOptions.minimumFractionDigits = Number(customOptions.minimumFractionDigits);
                }
                options.minimumFractionDigits = customOptions.minimumFractionDigits;
            }
            if (customOptions.maximumFractionDigits !== void 0 && customOptions.maximumFractionDigits !== null &&
                customOptions.maximumFractionDigits !== undefined) {
                if (typeof customOptions.maximumFractionDigits !== 'number') {
                    customOptions.maximumFractionDigits = Number(customOptions.maximumFractionDigits);
                }
                options.maximumFractionDigits = customOptions.maximumFractionDigits;
            }
            if (customOptions.useGrouping !== void 0 && customOptions.useGrouping !== null &&
                customOptions.useGrouping !== undefined) {
                if (typeof customOptions.useGrouping !== 'boolean') {
                    customOptions.useGrouping = (customOptions.useGrouping === 'true');
                }
                options.useGrouping = customOptions.useGrouping;
            }
        }
        return options;
    };
    I18nFormatter.validateDate = function (value) {
        if (value instanceof Date === false) {
            if (typeof (value) === 'string' && value.indexOf('/Date(') === 0) {
                value = value.replace('/Date(', '').replace(')/', '');
            }
            var serviceTimeZoneAbbreviation = ClientSettings_1.ClientSettings.getServiceTimeZoneAbbreviation();
            if (typeof (value) === 'string' &&
                (serviceTimeZoneAbbreviation && serviceTimeZoneAbbreviation === 'UTC') &&
                value.indexOf('T') > 0 && value.indexOf('Z') === -1 && (value.length === 19 || value.length === 23)) {
                value = value + 'Z';
            }
            if (Number(value)) {
                value = Number(value);
            }
            value = new Date(value);
            var typeCheck = typeof value;
            if (value.toString() === this._invalidDateText) {
                return false;
            }
        }
        return value;
    };
    I18nFormatter.validateNumber = function (value) {
        if (typeof value === 'string') {
            value = Number(value);
        }
        if (isNaN(value)) {
            value = Number(value);
            if (isNaN(value)) {
                return false;
            }
        }
        return value;
    };
    I18nFormatter.validateBoolean = function (value) {
        if (typeof value === 'string') {
            if (value === 'true') {
                return true;
            }
            else if (value === 'false') {
                return false;
            }
        }
        return value;
    };
    I18nFormatter.currencyOptions = {
        currency: 'USD',
        currencyDisplay: 'symbol',
        maximumFractionDigits: null,
        minimumFractionDigits: null,
        minimumIntegerDigits: null,
        style: 'currency',
        useGrouping: null,
    };
    I18nFormatter.numberOptions = {
        maximumFractionDigits: 2,
        minimumFractionDigits: null,
        minimumIntegerDigits: null,
        style: 'decimal',
        useGrouping: true,
    };
    I18nFormatter.percentageOptions = {
        maximumFractionDigits: 2,
        minimumFractionDigits: null,
        minimumIntegerDigits: null,
        style: 'percent',
        useGrouping: false,
    };
    I18nFormatter.scientificOptions = {
        maximumFractionDigits: null,
        minimumFractionDigits: null,
        minimumIntegerDigits: null,
        style: 'scientific',
        useGrouping: false,
    };
    I18nFormatter._invalidDateText = 'Invalid Date';
    return I18nFormatter;
}());
exports.I18nFormatter = I18nFormatter;
;
