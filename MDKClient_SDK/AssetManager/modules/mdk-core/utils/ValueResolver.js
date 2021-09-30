"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TargetPathInterpreter_1 = require("../targetpath/TargetPathInterpreter");
var IContext_1 = require("../context/IContext");
var EventHandler_1 = require("../EventHandler");
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var PropertyTypeChecker_1 = require("./PropertyTypeChecker");
var Logger_1 = require("./Logger");
var I18nHelper_1 = require("./I18nHelper");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var app = require("tns-core-modules/application");
var CommonUtil_1 = require("./CommonUtil");
var I18nFormatter_1 = require("./I18nFormatter");
var SAPIconMap_1 = require("../common/SAPIconMap");
var ImageHelper_1 = require("./ImageHelper");
var ValueType;
(function (ValueType) {
    ValueType[ValueType["Rule"] = 1] = "Rule";
    ValueType[ValueType["Global"] = 2] = "Global";
    ValueType[ValueType["TargetPath"] = 3] = "TargetPath";
    ValueType[ValueType["DynamicTargetPath"] = 4] = "DynamicTargetPath";
    ValueType[ValueType["Image"] = 5] = "Image";
    ValueType[ValueType["SAPIcon"] = 6] = "SAPIcon";
    ValueType[ValueType["FontIcon"] = 7] = "FontIcon";
    ValueType[ValueType["Binding"] = 8] = "Binding";
    ValueType[ValueType["PlatformSpecific"] = 9] = "PlatformSpecific";
    ValueType[ValueType["LocalizableString"] = 10] = "LocalizableString";
    ValueType[ValueType["NewBinding"] = 11] = "NewBinding";
    ValueType[ValueType["NativeArray"] = 12] = "NativeArray";
    ValueType[ValueType["Array"] = 13] = "Array";
    ValueType[ValueType["Object"] = 14] = "Object";
    ValueType[ValueType["Escape"] = 15] = "Escape";
    ValueType[ValueType["DefaultValue"] = 16] = "DefaultValue";
})(ValueType = exports.ValueType || (exports.ValueType = {}));
var ValueResolver = (function () {
    function ValueResolver() {
    }
    ValueResolver.resolveValue = function (sValue, context, recursive, excludedTypes, style) {
        var _this = this;
        if (context === void 0) { context = IContext_1.fromPage(); }
        if (recursive === void 0) { recursive = true; }
        return this._resolveValue(sValue, context, recursive, excludedTypes, style).then(function (value) {
            if (value !== null && value !== undefined) {
                var isObjectFromClasses = typeof value === 'object' ? value.constructor !== Object : false;
                if (recursive && _this.canRecursive(sValue, value) && !isObjectFromClasses) {
                    var sameValueType = typeof value === typeof sValue;
                    if ((sameValueType && JSON.stringify(value) !== JSON.stringify(sValue)) || !sameValueType) {
                        return _this.resolveValue(value, context, recursive, excludedTypes, style);
                    }
                }
            }
            return value;
        });
    };
    ValueResolver.canRecursive = function (sValue, value) {
        if (PropertyTypeChecker_1.PropertyTypeChecker.isRule(sValue) ||
            ((PropertyTypeChecker_1.PropertyTypeChecker.isDynamicTargetPath(sValue) || PropertyTypeChecker_1.PropertyTypeChecker.isNewDynamicTargetPath(sValue)
                || PropertyTypeChecker_1.PropertyTypeChecker.isNewBinding(sValue)) && PropertyTypeChecker_1.PropertyTypeChecker.isLocalizableString(value)) ||
            PropertyTypeChecker_1.PropertyTypeChecker.isSAPIcon(sValue) || PropertyTypeChecker_1.PropertyTypeChecker.isDefaultValue(sValue) ||
            PropertyTypeChecker_1.PropertyTypeChecker.isImage(value)) {
            return true;
        }
        return false;
    };
    ValueResolver.canResolve = function (sValue) {
        if (PropertyTypeChecker_1.PropertyTypeChecker.isRule(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isGlobal(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isImage(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isSAPIcon(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isFontIcon(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isBinding(sValue) && !PropertyTypeChecker_1.PropertyTypeChecker.isNewDynamicTargetPath(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isDynamicTargetPath(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isPlatformSpecific(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isDefaultValue(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isLocalizableString(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isNewDynamicTargetPath(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isNewBinding(sValue)) {
            return true;
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isEscape(sValue)) {
            return true;
        }
        else if (this._isNativeArray(sValue)) {
            return false;
        }
        else if (Array.isArray(sValue)) {
            return this._canResolveArray(sValue);
        }
        else if (sValue != null && (typeof (sValue) === 'object')) {
            return this._canResolveObject(sValue);
        }
        return false;
    };
    ValueResolver.resolveKeyValues = function (definitionObj, context, recursive, excludedTypes) {
        var _this = this;
        if (context === void 0) { context = IContext_1.fromPage(); }
        if (recursive === void 0) { recursive = true; }
        var resolvedObj = {};
        if (definitionObj !== undefined) {
            var promises_1 = [];
            var promise_1;
            var paramKeyType_1;
            Object.keys(definitionObj).forEach(function (paramKey) {
                paramKeyType_1 = typeof definitionObj[paramKey];
                switch (paramKeyType_1) {
                    case 'undefined':
                        resolvedObj[paramKey] = undefined;
                        break;
                    case 'object':
                        if (definitionObj[paramKey] === null) {
                            resolvedObj[paramKey] = 'null';
                            return;
                        }
                        if (Array.isArray(definitionObj[paramKey])) {
                            promise_1 = _this.resolveArrayOfKeyValues(definitionObj[paramKey], context);
                        }
                        else {
                            promise_1 = _this.resolveKeyValues(definitionObj[paramKey], context);
                        }
                        promises_1.push(promise_1.then(function (resolvedObjParam) {
                            resolvedObj[paramKey] = resolvedObjParam;
                            return Promise.resolve();
                        }));
                        break;
                    default:
                        promise_1 = ValueResolver.resolveValue(definitionObj[paramKey], context, recursive, excludedTypes).then(function (resolvedValue) {
                            resolvedObj[paramKey] = resolvedValue;
                        });
                        promises_1.push(promise_1);
                        break;
                }
            });
            return Promise.all(promises_1).then(function () {
                return resolvedObj;
            });
        }
        return Promise.resolve(resolvedObj);
    };
    ValueResolver.resolveArrayOfKeyValues = function (definitionObjArray, context, recursive, excludedTypes) {
        var _this = this;
        if (context === void 0) { context = IContext_1.fromPage(); }
        if (recursive === void 0) { recursive = true; }
        var promises = [];
        if (definitionObjArray && Array.isArray(definitionObjArray)) {
            definitionObjArray.forEach(function (definitionObj) {
                promises.push(_this.resolveValue(definitionObj, context, recursive, excludedTypes));
            });
        }
        return Promise.all(promises);
    };
    ValueResolver.parseBinding = function (value, context) {
        if (context === void 0) { context = IContext_1.fromPage(); }
        var bindingProperties = value.substring(1, value.length - 1).split('/');
        var actionBindingObject = context.clientAPIProps && context.clientAPIProps.actionBinding ?
            context.clientAPIProps.actionBinding : undefined;
        var bindingObject = context.binding;
        if (actionBindingObject) {
            var useActionBinding = false;
            for (var _i = 0, bindingProperties_1 = bindingProperties; _i < bindingProperties_1.length; _i++) {
                var bindingPropertyEach = bindingProperties_1[_i];
                if (actionBindingObject && actionBindingObject.hasOwnProperty(bindingPropertyEach)) {
                    useActionBinding = true;
                    break;
                }
            }
            if (useActionBinding) {
                return this._parseBindingProperty(bindingProperties, actionBindingObject);
            }
        }
        if (bindingObject) {
            return this._parseBindingProperty(bindingProperties, bindingObject);
        }
        return '';
    };
    ValueResolver._isNativeArray = function (item) {
        var type = Object.prototype.toString.call(item);
        return type === '[object Swift.__EmptyArrayStorage]' || type === '[object Swift.__SwiftDeferredNSArray]';
    };
    ValueResolver._canResolveArray = function (items) {
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (this.canResolve(item)) {
                return true;
            }
        }
        return false;
    };
    ValueResolver._canResolveObject = function (item) {
        for (var key in item) {
            if (item.hasOwnProperty(key)) {
                if (this.canResolve(item[key])) {
                    return true;
                }
            }
        }
        return false;
    };
    ValueResolver._resolveValue = function (sValue, context, recursive, excludedTypes, style) {
        var _this = this;
        var promise = Promise.resolve(sValue);
        if (PropertyTypeChecker_1.PropertyTypeChecker.isRule(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.Rule)) {
            promise = this._executeRule(sValue, context);
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isGlobal(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.Global)) {
            promise = Promise.resolve(this._parseGlobal(sValue));
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.TargetPath)) {
            promise = this._evaluateTargetPath(sValue, context);
        }
        else if ((PropertyTypeChecker_1.PropertyTypeChecker.isDynamicTargetPath(sValue) || PropertyTypeChecker_1.PropertyTypeChecker.isNewDynamicTargetPath(sValue)) && !PropertyTypeChecker_1.PropertyTypeChecker.isDefaultValue(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.DynamicTargetPath)) {
            promise = this._parseDynamicTargetPath(sValue, context);
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isImage(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.Image)) {
            promise = Promise.resolve(this._parseImage(sValue));
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isSAPIcon(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.SAPIcon)) {
            if (!app.ios && !app.android) {
                promise = Promise.resolve(sValue);
            }
            else {
                promise = Promise.resolve(SAPIconMap_1.parseSAPIcon(sValue));
            }
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isFontIcon(sValue)) {
            if (!app.ios && !app.android) {
                promise = Promise.resolve(SAPIconMap_1.parseFontIcon(sValue));
            }
            else if (!this._isInExcludedTypes(excludedTypes, ValueType.FontIcon)) {
                promise = Promise.resolve(ImageHelper_1.ImageHelper.convertFontIconToBase64(sValue, style));
            }
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isBinding(sValue) && !PropertyTypeChecker_1.PropertyTypeChecker.isNewDynamicTargetPath(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.Binding)) {
            promise = Promise.resolve(this.parseBinding(sValue, context));
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isNewBinding(sValue) && !PropertyTypeChecker_1.PropertyTypeChecker.isDefaultValue(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.NewBinding)) {
            promise = this._parseDynamicTargetPath(sValue, context);
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isDefaultValue(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.DefaultValue)) {
            promise = this._parseDefaultValue(sValue, context, recursive, excludedTypes);
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isPlatformSpecific(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.PlatformSpecific)) {
            promise = this._parsePlatformSpecific(sValue, context, recursive, excludedTypes);
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isLocalizableString(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.LocalizableString)) {
            promise = Promise.resolve(I18nHelper_1.I18nHelper.parseLocalizableString(sValue, context));
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isEscape(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.Escape)) {
            promise = this._parseDynamicTargetPath(sValue, context);
        }
        else if (this._isNativeArray(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.NativeArray)) {
            promise = Promise.resolve(sValue);
        }
        else if (Array.isArray(sValue) && !this._isInExcludedTypes(excludedTypes, ValueType.Array)) {
            promise = this._resolveArray(sValue, context, recursive, excludedTypes);
        }
        else if (sValue != null && (typeof (sValue) === 'object') && !this._isInExcludedTypes(excludedTypes, ValueType.Object)) {
            promise = this._resolveObject(sValue, context, recursive, excludedTypes);
        }
        else if (sValue === 'null') {
            promise = Promise.resolve(undefined);
        }
        return promise.then(function (result) {
            if (_this._isDateInvalid(result)) {
                return '';
            }
            return result;
        })
            .catch(function (failedBinding) {
            var message = "ValueResolver._resolveValue: failed to bind property '" + failedBinding + "'";
            Logger_1.Logger.instance.valueResolver.error(Logger_1.Logger.ERROR, message);
            return '';
        });
    };
    ValueResolver._isInExcludedTypes = function (excludedTypes, type) {
        if (excludedTypes && Array.isArray(excludedTypes)) {
            return excludedTypes.includes(type);
        }
        return false;
    };
    ValueResolver._isDateInvalid = function (value) {
        if (value instanceof Date && value.toString() === 'Invalid Date') {
            Logger_1.Logger.instance.valueResolver.error(ErrorMessage_1.ErrorMessage.INVALID_DATE);
            return true;
        }
        else {
            return false;
        }
    };
    ValueResolver._resolveArray = function (items, context, recursive, excludedTypes) {
        if (recursive === void 0) { recursive = true; }
        var promises = [];
        for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
            var item = items_2[_i];
            promises.push(this.resolveValue(item, context, recursive, excludedTypes));
        }
        return Promise.all(promises);
    };
    ValueResolver._resolveObject = function (item, context, recursive, excludedTypes) {
        if (recursive === void 0) { recursive = true; }
        try {
            var promises = [];
            var error_1 = false;
            if (this._isDateInvalid(item)) {
                return Promise.resolve('');
            }
            var result_1 = Object.create(item);
            var _loop_1 = function (key) {
                if (item.hasOwnProperty(key)) {
                    promises.push(this_1.resolveValue(item[key], context, recursive, excludedTypes)
                        .then(function (value) {
                        try {
                            result_1[key] = value;
                            if (result_1[key] !== value) {
                                error_1 = true;
                            }
                        }
                        catch (e) {
                            Logger_1.Logger.instance.valueResolver.log(e);
                            error_1 = true;
                        }
                    }));
                }
            };
            var this_1 = this;
            for (var key in item) {
                _loop_1(key);
            }
            return Promise.all(promises).then(function (r) {
                return error_1 ? item : result_1;
            });
        }
        catch (e) {
            Logger_1.Logger.instance.valueResolver.log(e);
            return Promise.resolve(item);
        }
    };
    ValueResolver._parseBindingProperty = function (bindingProperties, bindingObject) {
        var numericBindingProperty = -1;
        var bindingPropertyEach;
        var bindingObjectResult;
        for (var i = 0; i < bindingProperties.length; i++) {
            bindingObjectResult = undefined;
            if (bindingProperties[i].startsWith('#Property:')) {
                bindingPropertyEach = bindingProperties[i].split(':')[1];
            }
            else if (bindingProperties[i].startsWith('#Index:')) {
                bindingPropertyEach = bindingProperties[i].split(':')[1];
                numericBindingProperty = Number(bindingPropertyEach);
            }
            else {
                bindingPropertyEach = bindingProperties[i];
                numericBindingProperty = Number(bindingPropertyEach);
            }
            if (!isNaN(numericBindingProperty)) {
                if (bindingObject instanceof Array && bindingObject.length >= numericBindingProperty + 1) {
                    bindingObjectResult = bindingObject[numericBindingProperty];
                }
            }
            if (bindingObjectResult === undefined && bindingObject && bindingObject.hasOwnProperty(bindingPropertyEach)) {
                bindingObjectResult = bindingObject[bindingPropertyEach];
            }
            if (i === bindingProperties.length - 1) {
                if (bindingObjectResult !== undefined && bindingObjectResult !== null) {
                    if (bindingObjectResult instanceof observable_array_1.ObservableArray) {
                        bindingObjectResult = bindingObjectResult.slice();
                    }
                    return bindingObjectResult;
                }
                else {
                    return '';
                }
            }
            else if (bindingObjectResult !== undefined) {
                bindingObject = bindingObjectResult;
            }
        }
        return '';
    };
    ValueResolver._parseGlobal = function (value) {
        try {
            return IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(value).getValue();
        }
        catch (e) {
            this._onParseFail('ObservableValue._parseGlobal()', value, e);
            return value;
        }
    };
    ValueResolver._parseImage = function (value) {
        try {
            var defProvider = IDefinitionProvider_1.IDefinitionProvider.instance();
            var imagePath = value;
            var imageFileNamePart = '';
            var imageExtPart = '';
            var checkImagePath = '';
            var replacePos = value.lastIndexOf('.');
            if (replacePos > 0) {
                imageFileNamePart = value.substr(0, replacePos);
                imageExtPart = value.substr(replacePos, value.length - replacePos);
            }
            if (imageFileNamePart != '' && imageExtPart != '') {
                if (app.systemAppearance() === 'dark') {
                    checkImagePath = imageFileNamePart + this._darkOption + imageExtPart;
                    if (defProvider.isDefinitionPathValid(checkImagePath)) {
                        imagePath = checkImagePath;
                    }
                }
                else {
                    checkImagePath = imageFileNamePart + this._lightOption + imageExtPart;
                    if (defProvider.isDefinitionPathValid(checkImagePath)) {
                        imagePath = checkImagePath;
                    }
                }
            }
            return IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(imagePath);
        }
        catch (e) {
            if (app.ios || app.android) {
                this._onParseFail('ObservableValue.parseImage()', value, e);
            }
            return value;
        }
    };
    ValueResolver._parsePlatformSpecific = function (value, context, recursive, excludedTypes) {
        if (recursive === void 0) { recursive = true; }
        var resolvableValue;
        var sValue = '';
        var notAString = false;
        var count = (value.match(/\$\(/g) || []).length;
        if (count >= 1 && value.length > 6) {
            value = value.trim();
            var oriValue = value.substr(6, value.length - 7);
            oriValue = oriValue.trim();
            var sValues = oriValue.split(',');
            if (sValues && sValues.length >= 1) {
                var inspectedValues = CommonUtil_1.CommonUtil.inspectIndicatorValues(sValues);
                if (app.ios) {
                    resolvableValue = inspectedValues[0];
                    sValue = sValues[0];
                }
                else if (app.android) {
                    if (inspectedValues.length >= 2) {
                        resolvableValue = inspectedValues[1];
                        sValue = sValues[1];
                    }
                }
                else {
                    if (inspectedValues.length > 2) {
                        resolvableValue = inspectedValues[2];
                        sValue = sValues[2];
                    }
                }
                if (resolvableValue) {
                    var inspectDiff = sValue.trim().length - resolvableValue.length;
                    notAString = inspectDiff <= 1 ? true : false;
                }
            }
            if (resolvableValue && resolvableValue !== '') {
                return ValueResolver.resolveValue(resolvableValue, context, recursive, excludedTypes).then(function (result) {
                    if (notAString && result !== undefined) {
                        var numericValue = I18nFormatter_1.I18nFormatter.validateNumber(result);
                        if (numericValue !== false) {
                            return numericValue;
                        }
                        var booleanValue = I18nFormatter_1.I18nFormatter.validateBoolean(result);
                        if (booleanValue !== result) {
                            return booleanValue;
                        }
                    }
                    return result;
                });
            }
        }
        return Promise.resolve(resolvableValue);
    };
    ValueResolver._parseDefaultValue = function (value, context, recursive, excludedTypes) {
        if (recursive === void 0) { recursive = true; }
        var count = (value.match(/\$\(DV/g) || []).length;
        if (count >= 1 && value.length > 5) {
            var prefix_1 = value.split('$(DV', 1);
            var defaultString = value.substring(value.indexOf('$(DV'));
            var index_1 = this._getMatchedPosition(defaultString);
            var resolvableString = defaultString.substr(0, index_1 + 1);
            var suffix_1 = defaultString.substring(index_1 + 1);
            resolvableString = resolvableString.trim();
            var oriValue = resolvableString.substr(5, resolvableString.length - 6);
            oriValue = oriValue.trim();
            var sValues = oriValue.split(',');
            if (sValues && sValues.length >= 1) {
                var inspectedValues = CommonUtil_1.CommonUtil.inspectIndicatorValues(sValues);
                var promises = [];
                var results_1 = {};
                var _loop_2 = function (i) {
                    var resolvableValue = inspectedValues[i];
                    promises.push(ValueResolver.resolveValue(resolvableValue, context, recursive, excludedTypes).then(function (resolvedValue) {
                        results_1[i] = resolvedValue;
                    }));
                };
                for (var i = 0; i < inspectedValues.length; i++) {
                    _loop_2(i);
                }
                return Promise.all(promises).then(function () {
                    if (results_1[0] === undefined || results_1[0] === null || results_1[0] === '' && Object.keys(results_1).length > 1) {
                        return Promise.resolve(prefix_1 + results_1[1] + suffix_1);
                    }
                    ;
                    return Promise.resolve(prefix_1 + results_1[0] + suffix_1);
                });
            }
        }
        return Promise.resolve('');
    };
    ValueResolver._getMatchedPosition = function (value) {
        var open = 0;
        var close = 0;
        for (var i = 0; i < value.length; i++) {
            if (value[i] === '(') {
                open++;
            }
            else if (value[i] === ')') {
                close++;
                if (open === close) {
                    return i;
                }
            }
            else {
            }
        }
    };
    ValueResolver._evaluateTargetPath = function (sTargetPath, context) {
        return new Promise(function (resolve, _) {
            resolve(new TargetPathInterpreter_1.TargetPathInterpreter(context).evaluateTargetPathForValue(sTargetPath));
        });
    };
    ValueResolver._parseDynamicTargetPath = function (sDynamicTargetPath, context) {
        var _this = this;
        var promises = [];
        var sValue = sDynamicTargetPath;
        var dynamicTargetPath;
        var bindingType;
        do {
            dynamicTargetPath = PropertyTypeChecker_1.PropertyTypeChecker.getDynamicTargetPath(sValue);
            bindingType = dynamicTargetPath.BindingType;
            sValue = dynamicTargetPath.Suffix;
            if (bindingType === 3) {
                promises.push(Promise.resolve(this.parseBinding(dynamicTargetPath.DynamicTargetPath, context)).then((function (currentDynamicTargetPath) {
                    return function (result) {
                        return _this._conbinePrefixAndResult(currentDynamicTargetPath.Prefix, result);
                    };
                })(dynamicTargetPath)));
            }
            else if (bindingType === 1 || bindingType === 2) {
                promises.push(Promise.resolve(dynamicTargetPath.DynamicTargetPath).then((function (currentDynamicTargetPath) {
                    return function (result) {
                        return _this._conbinePrefixAndResult(currentDynamicTargetPath.Prefix, result);
                    };
                })(dynamicTargetPath)));
            }
            else {
                promises.push(this._evaluateTargetPath(dynamicTargetPath.DynamicTargetPath, context)
                    .then((function (currentDynamicTargetPath) {
                    return function (result) {
                        return _this._conbinePrefixAndResult(currentDynamicTargetPath.Prefix, result);
                    };
                })(dynamicTargetPath)));
            }
        } while (PropertyTypeChecker_1.PropertyTypeChecker.isDynamicTargetPath(sValue) || PropertyTypeChecker_1.PropertyTypeChecker.isNewDynamicTargetPath(sValue)
            || PropertyTypeChecker_1.PropertyTypeChecker.isNewBinding(sValue) || PropertyTypeChecker_1.PropertyTypeChecker.isEscape(sValue));
        return Promise.all(promises).then(function (results) {
            if (dynamicTargetPath.Suffix !== '' || typeof results[0] !== 'object') {
                return results.join('') + dynamicTargetPath.Suffix;
            }
            return results[0];
        }, function (error) {
            _this._onParseFail('ObservableValue._parseDynamicTargetPath()', sValue, error);
            return '';
        });
    };
    ValueResolver._executeRule = function (sRule, context) {
        return new EventHandler_1.EventHandler().executeRule(sRule, context);
    };
    ValueResolver._onParseFail = function (origin, value, error) {
        Logger_1.Logger.instance.valueResolver.error(Logger_1.Logger.VALUERESOLVER_PARSE_FAILED, value, error);
    };
    ValueResolver._conbinePrefixAndResult = function (prefix, result) {
        return result === null ? prefix : prefix !== '' ? prefix + result : result;
    };
    ValueResolver._darkOption = '.dark';
    ValueResolver._lightOption = '.light';
    return ValueResolver;
}());
exports.ValueResolver = ValueResolver;
;
