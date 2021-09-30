"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Segments_1 = require("../common/Segments");
var file_system_1 = require("tns-core-modules/file-system");
;
var PropertyTypeChecker = (function () {
    function PropertyTypeChecker() {
    }
    PropertyTypeChecker.isGlobal = function (sReference) {
        if (!PropertyTypeChecker._isValidString(sReference)) {
            return false;
        }
        return sReference.endsWith('.global');
    };
    PropertyTypeChecker.isImage = function (sReference) {
        if (!PropertyTypeChecker._isValidString(sReference)) {
            return false;
        }
        var imageExtensionRegEx = new RegExp('.(jpe?g|png|pdf)$', 'i');
        return sReference.includes('/Images/') && imageExtensionRegEx.test(sReference);
    };
    PropertyTypeChecker.isRule = function (sReference) {
        if (!PropertyTypeChecker._isValidString(sReference)) {
            return false;
        }
        return sReference.endsWith('.js');
    };
    PropertyTypeChecker.isTargetPath = function (sReference) {
        if (!PropertyTypeChecker._isValidString(sReference)) {
            return false;
        }
        if (sReference.startsWith('#')) {
            var sReferenceLowerCase = sReference.toLowerCase();
            var segmentsEnumKeys = Object.keys(Segments_1.Segments);
            for (var _i = 0, segmentsEnumKeys_1 = segmentsEnumKeys; _i < segmentsEnumKeys_1.length; _i++) {
                var key = segmentsEnumKeys_1[_i];
                if (sReferenceLowerCase.indexOf(Segments_1.Segments[key]) === 0) {
                    return true;
                }
            }
        }
        return false;
    };
    PropertyTypeChecker.isBinding = function (sReference) {
        if (!PropertyTypeChecker._isValidString(sReference)) {
            return false;
        }
        if (sReference.startsWith('{') && sReference.endsWith('}') && sReference.length > 2) {
            return isNaN(sReference.substring(1, sReference.length - 1));
        }
        return false;
    };
    PropertyTypeChecker.isDynamicTargetPath = function (sReference) {
        if (typeof (sReference) !== 'string') {
            return false;
        }
        return sReference.match('{{#(.*)}}') ? true : false;
    };
    PropertyTypeChecker.getDynamicTargetPath = function (sReference) {
        var dynamicTargetPath;
        var prefix;
        var suffix;
        if (this.isDynamicTargetPath(sReference)) {
            dynamicTargetPath = sReference.substring(sReference.indexOf('{{') + 2, sReference.indexOf('}}'));
            prefix = sReference.substring(0, sReference.indexOf('{{'));
            suffix = sReference.substring(sReference.indexOf('}}') + 2, sReference.length);
            return { Prefix: prefix,
                DynamicTargetPath: dynamicTargetPath,
                Suffix: suffix,
                BindingType: 0
            };
        }
        else {
            var type = this.checkNextTargetPath(sReference);
            switch (type) {
                case 0:
                    dynamicTargetPath = sReference.substring(sReference.indexOf('{') + 1, sReference.indexOf('}'));
                    prefix = sReference.substring(0, sReference.indexOf('{'));
                    suffix = sReference.substring(sReference.indexOf('}') + 1, sReference.length);
                    var propertes = dynamicTargetPath.split('/');
                    var newPath = '';
                    for (var _i = 0, propertes_1 = propertes; _i < propertes_1.length; _i++) {
                        var prop = propertes_1[_i];
                        if (!prop.startsWith('#')) {
                            if (typeof prop === 'number' && Number.isInteger(prop)) {
                                newPath = newPath + '/#Index:' + prop;
                            }
                            else {
                                newPath = newPath + '/#Property:' + prop;
                            }
                        }
                        else {
                            newPath = newPath + '/' + prop;
                        }
                    }
                    newPath = newPath.substring(1, newPath.length);
                    return { Prefix: prefix,
                        DynamicTargetPath: newPath,
                        Suffix: suffix,
                        BindingType: 0
                    };
                case 1:
                    dynamicTargetPath = sReference.substring(sReference.indexOf('`{') + 2, sReference.indexOf('}`'));
                    prefix = sReference.substring(0, sReference.indexOf('`{'));
                    suffix = sReference.substring(sReference.indexOf('}`') + 2, sReference.length);
                    return { Prefix: prefix,
                        DynamicTargetPath: '{' + dynamicTargetPath + '}',
                        Suffix: suffix,
                        BindingType: 1
                    };
                case 2:
                    var hashIndex = sReference.indexOf('`#');
                    var str = sReference.substring(hashIndex + 2, sReference.length);
                    dynamicTargetPath = sReference.substring(hashIndex + 2, hashIndex + 2 + str.indexOf('`'));
                    prefix = sReference.substring(0, hashIndex);
                    suffix = sReference.substring(hashIndex + 2 + str.indexOf('`') + 1, sReference.length);
                    return { Prefix: prefix,
                        DynamicTargetPath: '#' + dynamicTargetPath + '',
                        Suffix: suffix,
                        BindingType: 2
                    };
                case 3:
                    dynamicTargetPath = sReference.substring(sReference.indexOf('{') + 1, sReference.indexOf('}'));
                    prefix = sReference.substring(0, sReference.indexOf('{'));
                    suffix = sReference.substring(sReference.indexOf('}') + 1, sReference.length);
                    return { Prefix: prefix,
                        DynamicTargetPath: '{' + dynamicTargetPath + '}',
                        Suffix: suffix,
                        BindingType: 3
                    };
                default:
            }
        }
    };
    PropertyTypeChecker.checkNextTargetPath = function (sReference) {
        var STR_LENGTH = sReference.length;
        var firstEscapeIndex = STR_LENGTH;
        var firstTargetPathIndex = STR_LENGTH;
        var firstNewBindingIndex = STR_LENGTH;
        var escapeData;
        if (this.isNewDynamicTargetPath(sReference)) {
            firstTargetPathIndex = sReference.indexOf('{#');
        }
        if (this.isEscape(sReference)) {
            escapeData = this.checkNextEscape(sReference);
            firstEscapeIndex = escapeData.Index;
        }
        if (this.isNewBinding(sReference)) {
            firstNewBindingIndex = sReference.indexOf('{');
            if (firstNewBindingIndex === firstTargetPathIndex) {
                firstNewBindingIndex = STR_LENGTH;
            }
            if (firstNewBindingIndex === firstEscapeIndex + 1) {
                firstNewBindingIndex = STR_LENGTH;
            }
        }
        if (firstTargetPathIndex < firstEscapeIndex && firstTargetPathIndex < firstNewBindingIndex) {
            return 0;
        }
        if (firstEscapeIndex < firstTargetPathIndex && firstEscapeIndex < firstNewBindingIndex) {
            return escapeData.Type;
        }
        if (firstNewBindingIndex < firstEscapeIndex && firstNewBindingIndex < firstTargetPathIndex) {
            return 3;
        }
    };
    PropertyTypeChecker.checkNextEscape = function (sReference) {
        var index = sReference.length;
        var type;
        var escape1 = sReference.indexOf('`{');
        var escape2 = sReference.indexOf('`#');
        if (escape1 !== -1 && escape2 !== -1) {
            if (escape1 < escape2) {
                index = escape1;
                type = 1;
            }
            else {
                index = escape2;
                type = 2;
            }
        }
        else if (escape1 !== -1) {
            index = escape1;
            type = 1;
        }
        else if (escape2 !== -1) {
            index = escape2;
            type = 2;
        }
        return { Index: index, Type: type };
    };
    PropertyTypeChecker.isNewDynamicTargetPath = function (sReference) {
        if (typeof (sReference) !== 'string') {
            return false;
        }
        if (sReference.match('{#(.*)}')) {
            return true;
        }
        return false;
    };
    PropertyTypeChecker.isNewBinding = function (sReference) {
        if (typeof (sReference) !== 'string') {
            return false;
        }
        var selectors = sReference.match(/\{(\S+?)\}/g);
        if (selectors === null) {
            return false;
        }
        else {
            if (selectors.length === 1 && sReference === selectors[0]) {
                return false;
            }
            else {
                var validSelectors_1 = [];
                selectors.forEach(function (selector) {
                    var selectorStr = selector.substring(1, selector.length - 1);
                    if (selectorStr.indexOf(':') === -1 && selectorStr.indexOf('{') === -1 && selectorStr.indexOf('}') === -1) {
                        validSelectors_1.push(selector);
                    }
                    else if (selectorStr.indexOf(':') !== -1 && selectorStr.indexOf('#') !== -1) {
                        validSelectors_1.push(selector);
                    }
                });
                if (validSelectors_1.length > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    };
    PropertyTypeChecker.isEscape = function (sReference) {
        if (typeof (sReference) !== 'string') {
            return false;
        }
        if (sReference.match('`{(.*)}`') || sReference.match('`#(.*)`')) {
            return true;
        }
        return false;
    };
    PropertyTypeChecker.isLocalizableString = function (sReference) {
        if (typeof (sReference) !== 'string') {
            return false;
        }
        return (sReference).includes('$(');
    };
    PropertyTypeChecker.isPlatformSpecific = function (sReference) {
        if (typeof (sReference) !== 'string') {
            return false;
        }
        return (sReference).startsWith('$(PLT');
    };
    PropertyTypeChecker.isDefaultValue = function (sReference) {
        if (typeof (sReference) !== 'string') {
            return false;
        }
        return (sReference).includes('$(DV');
    };
    PropertyTypeChecker.isSAPIcon = function (sReference) {
        return typeof sReference === 'string' && sReference.startsWith('sap-icon://');
    };
    PropertyTypeChecker.isFontIcon = function (sReference) {
        return typeof sReference === 'string' && sReference.startsWith('font://');
    };
    PropertyTypeChecker.isResourcePath = function (sReference) {
        return typeof sReference === 'string' && sReference.startsWith('res://');
    };
    PropertyTypeChecker.isFilePath = function (sReference) {
        return typeof sReference === 'string' && sReference.startsWith(file_system_1.knownFolders.documents().path);
    };
    PropertyTypeChecker._isValidString = function (sReference) {
        return typeof (sReference) === 'string' && !sReference.includes(' ');
    };
    return PropertyTypeChecker;
}());
exports.PropertyTypeChecker = PropertyTypeChecker;
