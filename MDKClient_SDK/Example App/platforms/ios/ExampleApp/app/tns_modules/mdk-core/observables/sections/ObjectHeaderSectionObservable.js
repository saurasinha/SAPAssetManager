"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionObservable_1 = require("./BaseSectionObservable");
var EvaluateTarget_1 = require("../../data/EvaluateTarget");
var PropertyTypeChecker_1 = require("../../utils/PropertyTypeChecker");
var TypeConverter_1 = require("../../utils/TypeConverter");
var Logger_1 = require("../../utils/Logger");
var app = require("tns-core-modules/application");
var ValueResolver_1 = require("../../utils/ValueResolver");
var ObjectHeaderSectionObservable = (function (_super) {
    __extends(ObjectHeaderSectionObservable, _super);
    function ObjectHeaderSectionObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._resolveSectionTarget = false;
        return _this;
    }
    ObjectHeaderSectionObservable.prototype.bind = function () {
        var _this = this;
        var definition = this.section.definition;
        var objectHeader = definition.ObjectHeader;
        var promises = [];
        var tagPromises = [];
        this._resolveSectionTarget = true;
        return this._resolveData(objectHeader).then(function (data) {
            _this.binding = data;
            return _this._bindStyles(objectHeader, _this.binding).then(function (styles) {
                Object.keys(objectHeader).forEach(function (key) {
                    switch (key) {
                        case ObjectHeaderSectionObservable.BODY_TEXT_PARAM_KEY:
                        case ObjectHeaderSectionObservable.DESCRIPTION_TEXT_PARAM_KEY:
                        case ObjectHeaderSectionObservable.DETAIL_IMAGE_PARAM_KEY:
                        case ObjectHeaderSectionObservable.DETAIL_IMAGE_IS_CIRCULAR_PARAM_KEY:
                        case ObjectHeaderSectionObservable.FOOTNOTE_TEXT_PARAM_KEY:
                        case ObjectHeaderSectionObservable.HEADLINE_TEXT_PARAM_KEY:
                        case ObjectHeaderSectionObservable.STATUS_IMAGE_PARAM_KEY:
                        case ObjectHeaderSectionObservable.STATUS_TEXT_PARAM_KEY:
                        case ObjectHeaderSectionObservable.SUBHEADLINE_TEXT_PARAM_KEY:
                        case ObjectHeaderSectionObservable.SUBSTATUS_IMAGE_PARAM_KEY:
                        case ObjectHeaderSectionObservable.SUBSTATUS_TEXT_PARAM_KEY:
                            promises.push(_this._bindValue(_this.binding, key, objectHeader[key], styles && styles.hasOwnProperty(key) ? styles[key] : null).then(function (value) {
                                if (value === undefined) {
                                    Logger_1.Logger.instance.ui.warn(Logger_1.Logger.OBSERVABLE_OBJECTHEADERSECTION_BINDING_FAILED, objectHeader[key]);
                                }
                                var properties = {};
                                properties[key] = value || '';
                                return properties;
                            }));
                            break;
                        case ObjectHeaderSectionObservable.ANALYTIC_VIEW_CONTAINER_PARAM_KEY:
                            promises.push(_this._resolveData(objectHeader[key]).then(function (resolvedData) {
                                resolvedData = _this._getValidBindObject(resolvedData);
                                var properties = {};
                                var analyticViewPromises = [];
                                var analyticViewContainerDefinition = objectHeader[key];
                                if (analyticViewContainerDefinition) {
                                    properties[key] = {};
                                }
                                var _loop_1 = function (analyticViewItemKey) {
                                    if (analyticViewContainerDefinition.hasOwnProperty(analyticViewItemKey)) {
                                        if (analyticViewItemKey === ObjectHeaderSectionObservable.ONPRESS_PARAM_KEY) {
                                            properties[key][analyticViewItemKey] = analyticViewContainerDefinition[analyticViewItemKey];
                                        }
                                        else {
                                            analyticViewPromises.push(_this._bindValue(resolvedData, analyticViewItemKey, analyticViewContainerDefinition[analyticViewItemKey]).then(function (value) {
                                                if (value === undefined) {
                                                    Logger_1.Logger.instance.ui.warn(Logger_1.Logger.OBSERVABLE_OBJECTHEADERSECTION_BINDING_FAILED, analyticViewContainerDefinition[analyticViewItemKey]);
                                                }
                                                properties[key][analyticViewItemKey] = value || '';
                                            }));
                                        }
                                    }
                                };
                                for (var analyticViewItemKey in analyticViewContainerDefinition) {
                                    _loop_1(analyticViewItemKey);
                                }
                                return Promise.all(analyticViewPromises).then(function () {
                                    return properties;
                                });
                            }));
                            break;
                        case ObjectHeaderSectionObservable.DETAIL_CONTENT_CONTAINER_PARAM_KEY:
                            var properties = {};
                            properties[key] = true;
                            promises.push(Promise.resolve(properties));
                            break;
                        case ObjectHeaderSectionObservable.TAGS_PARAM_KEY:
                            tagPromises = TypeConverter_1.TypeConverter.toArray(objectHeader[ObjectHeaderSectionObservable.TAGS_PARAM_KEY]).map(function (tag) {
                                return _this._bindValue(_this.binding, ObjectHeaderSectionObservable.TAGS_PARAM_KEY, tag).then(function (value) {
                                    if (value === undefined) {
                                        Logger_1.Logger.instance.ui.warn(Logger_1.Logger.OBSERVABLE_OBJECTHEADERSECTION_BINDING_FAILED, tag);
                                    }
                                    return value;
                                });
                            });
                            Promise.resolve(tagPromises);
                            break;
                        default:
                            Logger_1.Logger.instance.ui.log("Property is not supported in ObjectHeader: " + key);
                    }
                });
                return _super.prototype.bind.call(_this).then(function () {
                    return Promise.all(promises).then(function (properties) {
                        return properties;
                    }).then(function (params) {
                        return Promise.all(tagPromises).then(function (tags) {
                            var properties = {};
                            properties[ObjectHeaderSectionObservable.TAGS_PARAM_KEY] = TypeConverter_1.TypeConverter.reduce(tags).filter(function (tag) {
                                return tag !== undefined && tag !== null && tag !== '';
                            });
                            params.push(properties);
                            return params;
                        });
                    }).then(function (properties) {
                        var paramsObject;
                        if (app.ios) {
                            paramsObject = JSON.stringify(properties);
                        }
                        else {
                            paramsObject = {};
                            for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
                                var item = properties_1[_i];
                                Object.assign(paramsObject, item);
                            }
                        }
                        _this.sectionParameters[ObjectHeaderSectionObservable.ITEMS_PARAM_KEY] = paramsObject;
                    }).then(function () {
                        if (styles) {
                            var stylesArr_2 = [];
                            Object.keys(styles).forEach(function (skey) {
                                var _a;
                                stylesArr_2.push((_a = {}, _a[skey] = styles[skey], _a));
                            });
                            var stylesParam = void 0;
                            if (stylesArr_2) {
                                if (app.ios) {
                                    stylesParam = JSON.stringify(stylesArr_2);
                                }
                                else {
                                    stylesParam = {};
                                    for (var _i = 0, stylesArr_1 = stylesArr_2; _i < stylesArr_1.length; _i++) {
                                        var styleEach = stylesArr_1[_i];
                                        Object.assign(stylesParam, styleEach);
                                    }
                                }
                            }
                            _this.sectionParameters[ObjectHeaderSectionObservable.STYLES_SECTIONPARAM_KEY] = stylesParam;
                        }
                        return _this._sectionParameters;
                    });
                });
            });
        });
    };
    ObjectHeaderSectionObservable.prototype.onAnalyticViewPress = function () {
        var objectHeaderSectionDefinition = this.section.definition;
        var OnAnalyticViewPress = objectHeaderSectionDefinition.onAnalyticViewPress;
        if (OnAnalyticViewPress) {
            var handler = this.buildBaseSectionEventHandler();
            return handler.executeActionOrRule(OnAnalyticViewPress, this.section.context);
        }
        return Promise.resolve();
    };
    ObjectHeaderSectionObservable.prototype.getTargetSpecifier = function () {
        var targetSpecifier;
        if (this._targetSpecifier && this._targetSpecifier.Target) {
            targetSpecifier = this._targetSpecifier;
        }
        else {
            targetSpecifier = { 'Target': undefined };
            if (this.section.definition.ObjectHeader.Target) {
                targetSpecifier.Target = Object.assign({}, this.section.definition.ObjectHeader.Target);
            }
        }
        return targetSpecifier;
    };
    ObjectHeaderSectionObservable.prototype._resolveData = function (definition) {
        var _this = this;
        var targetSpecifier = definition;
        if (this._resolveSectionTarget) {
            targetSpecifier = this.getRuntimeSpecifier(definition);
            this._resolveSectionTarget = false;
        }
        if (targetSpecifier.Target) {
            var targetDefinition = targetSpecifier.Target;
            if (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(targetDefinition) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isBinding(targetDefinition) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isGlobal(targetDefinition) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isRule(targetDefinition)) {
                return ValueResolver_1.ValueResolver.resolveValue(targetDefinition, this.section.context, false).then(function (data) {
                    return Promise.resolve(data || {});
                });
            }
            else {
                return EvaluateTarget_1.asService(targetSpecifier, this.section.context).then(function (service) {
                    return _this._readFromService(service).then(function (result) {
                        return result.length > 0 ? result.getItem(0) : {};
                    });
                });
            }
        }
        else {
            return Promise.resolve(this.section.context.binding);
        }
    };
    ObjectHeaderSectionObservable.BODY_TEXT_PARAM_KEY = 'BodyText';
    ObjectHeaderSectionObservable.DESCRIPTION_TEXT_PARAM_KEY = 'Description';
    ObjectHeaderSectionObservable.DETAIL_CONTENT_CONTAINER_PARAM_KEY = 'DetailContentContainer';
    ObjectHeaderSectionObservable.DETAIL_IMAGE_PARAM_KEY = 'DetailImage';
    ObjectHeaderSectionObservable.DETAIL_IMAGE_IS_CIRCULAR_PARAM_KEY = 'DetailImageIsCircular';
    ObjectHeaderSectionObservable.FOOTNOTE_TEXT_PARAM_KEY = 'Footnote';
    ObjectHeaderSectionObservable.HEADLINE_TEXT_PARAM_KEY = 'HeadlineText';
    ObjectHeaderSectionObservable.ITEMS_PARAM_KEY = 'items';
    ObjectHeaderSectionObservable.STATUS_IMAGE_PARAM_KEY = 'StatusImage';
    ObjectHeaderSectionObservable.STATUS_TEXT_PARAM_KEY = 'StatusText';
    ObjectHeaderSectionObservable.SUBHEADLINE_TEXT_PARAM_KEY = 'Subhead';
    ObjectHeaderSectionObservable.SUBSTATUS_IMAGE_PARAM_KEY = 'SubstatusImage';
    ObjectHeaderSectionObservable.SUBSTATUS_TEXT_PARAM_KEY = 'SubstatusText';
    ObjectHeaderSectionObservable.TAGS_PARAM_KEY = 'Tags';
    ObjectHeaderSectionObservable.STYLES_PARAM_KEY = 'Styles';
    ObjectHeaderSectionObservable.STYLES_SECTIONPARAM_KEY = 'styles';
    ObjectHeaderSectionObservable.ANALYTIC_VIEW_CONTAINER_PARAM_KEY = 'AnalyticView';
    ObjectHeaderSectionObservable.ONPRESS_PARAM_KEY = 'OnPress';
    return ObjectHeaderSectionObservable;
}(BaseSectionObservable_1.BaseSectionObservable));
exports.ObjectHeaderSectionObservable = ObjectHeaderSectionObservable;
