"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CssPropertyParser_1 = require("./CssPropertyParser");
var ClientSettings_1 = require("../storage/ClientSettings");
var app = require("tns-core-modules/application");
var Application_1 = require("../Application");
var StyleHelper = (function () {
    function StyleHelper() {
    }
    StyleHelper.getStyle = function (selector, cssClassName) {
        var style = {};
        var color = CssPropertyParser_1.CssPropertyParser.getPropertyFromSelector(selector, cssClassName, this._colorProperty);
        if (color) {
            style.colorString = (typeof color === 'string') ? color : '';
            style.color = (typeof color === 'string') ? CssPropertyParser_1.CssPropertyParser.createColor(color) : color;
        }
        var fontSize = CssPropertyParser_1.CssPropertyParser
            .getPropertyFromSelector(selector, cssClassName, this._fontSizeProperty);
        if (fontSize) {
            style.fontSize = fontSize;
        }
        var fontFamily = CssPropertyParser_1.CssPropertyParser
            .getPropertyFromSelector(selector, cssClassName, this._fontFamilyProperty);
        if (fontFamily) {
            style.fontFamily = CssPropertyParser_1.CssPropertyParser.createFontFamily(fontFamily);
        }
        var backgroundColor = CssPropertyParser_1.CssPropertyParser.getPropertyFromSelector(selector, cssClassName, this._backgroundColorProperty);
        if (backgroundColor) {
            style.backgroundColorString = (typeof backgroundColor === 'string') ? backgroundColor : '';
            style.backgroundColor = (typeof backgroundColor === 'string') ? CssPropertyParser_1.CssPropertyParser.createColor(backgroundColor) : backgroundColor;
        }
        return style;
    };
    StyleHelper.convertStyleToCssString = function (styleObj, className) {
        var cssString = '';
        if (styleObj) {
            cssString = '.' + className + ' { ';
            if (styleObj.colorString && styleObj.colorString !== '') {
                cssString += this._colorProperty + ': ' + styleObj.colorString + '; ';
            }
            if (styleObj.fontSize && styleObj.fontSize !== '') {
                cssString += this._fontSizeProperty + ': ' + styleObj.fontSize + '; ';
            }
            if (styleObj.fontFamily && styleObj.fontFamily !== '') {
                cssString += this._fontFamilyProperty + ': ' + styleObj.fontFamily + '; ';
            }
            cssString += '}';
        }
        return cssString;
    };
    StyleHelper.getValidTheme = function (themeName) {
        var validTheme;
        themeName = themeName.replace(this._darkOption, '').replace(this._lightOption, '');
        var availableThemes = ClientSettings_1.ClientSettings.getAvailableThemes().split(",");
        if (availableThemes && availableThemes.length > 0) {
            if (availableThemes.indexOf(themeName) >= 0) {
                validTheme = themeName;
            }
            var platformIsReady = app.ios ? app.ios.window : app.android ? app.android.context : true;
            if (platformIsReady) {
                if (app.systemAppearance() === 'dark') {
                    if (availableThemes.indexOf(themeName + this._darkOption) >= 0) {
                        validTheme = themeName + this._darkOption;
                    }
                }
                else if (app.systemAppearance() === 'light') {
                    if (availableThemes.indexOf(themeName + this._lightOption) >= 0) {
                        validTheme = themeName + this._lightOption;
                    }
                }
            }
        }
        return validTheme;
    };
    StyleHelper.setTheme = function (themeName, initialLaunch) {
        var themeToBeSet = this.getValidTheme(themeName);
        if (themeToBeSet) {
            var existingTheme = ClientSettings_1.ClientSettings.getTheme();
            ClientSettings_1.ClientSettings.setTheme(themeToBeSet);
            Application_1.Application.applyThemeOnApplication(themeToBeSet, existingTheme, initialLaunch);
            return true;
        }
        return false;
    };
    StyleHelper.getTheme = function () {
        return ClientSettings_1.ClientSettings.getTheme().replace('.dark', '').replace('.light', '');
    };
    StyleHelper.getAvailableThemes = function () {
        var availableThemesString = ClientSettings_1.ClientSettings.getAvailableThemes();
        if (availableThemesString) {
            var availableThemes = availableThemesString.split(",");
            if (availableThemes && availableThemes.length > 0) {
                availableThemes = availableThemes.map(function (theme) { return theme.replace('.dark', '').replace('.light', ''); });
                var uniqueThemesSet = new Set(availableThemes);
                return Array.from(uniqueThemesSet);
            }
        }
        return null;
    };
    StyleHelper._colorProperty = 'color';
    StyleHelper._fontFamilyProperty = 'font-family';
    StyleHelper._fontSizeProperty = 'font-size';
    StyleHelper._backgroundColorProperty = 'background-color';
    StyleHelper._darkOption = '.dark';
    StyleHelper._lightOption = '.light';
    return StyleHelper;
}());
exports.StyleHelper = StyleHelper;
