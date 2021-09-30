"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionObservable_1 = require("./BaseSectionObservable");
var ValueResolver_1 = require("../../utils/ValueResolver");
var EvaluateTarget_1 = require("../../data/EvaluateTarget");
var PropertyTypeChecker_1 = require("../../utils/PropertyTypeChecker");
var app = require("tns-core-modules/application");
var ProfileHeaderSectionObservable = (function (_super) {
    __extends(ProfileHeaderSectionObservable, _super);
    function ProfileHeaderSectionObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProfileHeaderSectionObservable.prototype.bind = function () {
        var _this = this;
        var definition = this.section.definition;
        var profileHeader = definition.ProfileHeader;
        var promises = [];
        return this._resolveData(definition).then(function (data) {
            _this.binding = data;
            return _this._bindStyles(profileHeader, _this.binding).then(function (styles) {
                var paramsObject;
                if (styles) {
                    paramsObject = {};
                    paramsObject[ProfileHeaderSectionObservable._stylesKey] = styles;
                }
                Object.keys(profileHeader).forEach(function (key) {
                    switch (key) {
                        case ProfileHeaderSectionObservable._headlineKey:
                        case ProfileHeaderSectionObservable._subheadlineKey:
                        case ProfileHeaderSectionObservable._descriptionKey:
                        case ProfileHeaderSectionObservable._detailImageKey:
                        case ProfileHeaderSectionObservable._detailImageIsCircular:
                            promises.push(_this._bindValue(_this.binding, key, profileHeader[key], styles && styles.hasOwnProperty(key) ? styles[key] : null).then(function (value) {
                                var properties = {};
                                properties[key] = value;
                                return properties;
                            }));
                            break;
                        case ProfileHeaderSectionObservable._activityItemsKey:
                            promises.push(Promise.all(profileHeader[key].map(function (activityItem) {
                                return _this._bindValue(_this.binding, key, activityItem[ProfileHeaderSectionObservable._avKey]).
                                    then(function (value) {
                                    var retItem = Object.assign({}, activityItem);
                                    retItem[ProfileHeaderSectionObservable._avKey] = value;
                                    return retItem;
                                });
                            })).then(function (activityItemsResult) {
                                var properties = {};
                                properties[key] = activityItemsResult;
                                return properties;
                            }));
                            break;
                        default: break;
                    }
                });
                return _super.prototype.bind.call(_this).then(function () {
                    return Promise.all(promises).then(function (items) {
                        var finalParams;
                        if (app.ios) {
                            if (paramsObject) {
                                items.push(paramsObject);
                            }
                            finalParams = JSON.stringify(items);
                        }
                        else {
                            if (!paramsObject) {
                                paramsObject = {};
                            }
                            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                                var item = items_1[_i];
                                Object.assign(paramsObject, item);
                            }
                            finalParams = paramsObject;
                        }
                        _this.sectionParameters[ProfileHeaderSectionObservable.ITEMS_PARAM_KEY] = finalParams;
                        return _this.sectionParameters;
                    });
                });
            });
        });
    };
    ;
    ProfileHeaderSectionObservable.prototype.getTargetSpecifier = function () {
        var targetSpecifier;
        if (this._targetSpecifier && this._targetSpecifier.Target) {
            targetSpecifier = this._targetSpecifier;
        }
        else {
            targetSpecifier = { 'Target': undefined };
            if (this.section.definition.ProfileHeader.Target) {
                targetSpecifier.Target = Object.assign({}, this.section.definition.ProfileHeader.Target);
            }
        }
        return targetSpecifier;
    };
    ProfileHeaderSectionObservable.prototype._resolveData = function (definition) {
        var _this = this;
        var targetSpecifier = this.getRuntimeSpecifier(definition.data.ProfileHeader);
        if (targetSpecifier.Target) {
            if (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isBinding(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isRule(targetSpecifier.Target)) {
                return ValueResolver_1.ValueResolver.resolveValue(targetSpecifier.Target, this.section.context, false).then(function (data) {
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
    ProfileHeaderSectionObservable.ITEMS_PARAM_KEY = 'items';
    ProfileHeaderSectionObservable._descriptionKey = 'Description';
    ProfileHeaderSectionObservable._detailImageKey = 'DetailImage';
    ProfileHeaderSectionObservable._headlineKey = 'Headline';
    ProfileHeaderSectionObservable._subheadlineKey = 'Subheadline';
    ProfileHeaderSectionObservable._activityItemsKey = 'ActivityItems';
    ProfileHeaderSectionObservable._avKey = 'ActivityValue';
    ProfileHeaderSectionObservable._detailImageIsCircular = 'DetailImageIsCircular';
    return ProfileHeaderSectionObservable;
}(BaseSectionObservable_1.BaseSectionObservable));
exports.ProfileHeaderSectionObservable = ProfileHeaderSectionObservable;
