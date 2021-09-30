"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("tns-core-modules/color");
var style_scope_1 = require("tns-core-modules/ui/styling/style-scope");
var ClientSettings_1 = require("../storage/ClientSettings");
var app = require("tns-core-modules/application");
var Selectors;
(function (Selectors) {
    Selectors[Selectors["TypeSelector"] = 0] = "TypeSelector";
    Selectors[Selectors["ClassSelector"] = 1] = "ClassSelector";
    Selectors[Selectors["IdSelector"] = 2] = "IdSelector";
})(Selectors = exports.Selectors || (exports.Selectors = {}));
var CssPropertyParser = (function () {
    function CssPropertyParser() {
    }
    CssPropertyParser.getPropertyFromSelector = function (selectorType, selectorName, propertyName) {
        var _this = this;
        var result;
        if (this.ruleSet === undefined || this.ruleSet.length === 0 || ClientSettings_1.ClientSettings.getUpdateCSSRuleSetFlag()) {
            var styleScope = new style_scope_1.StyleScope();
            styleScope.ensureSelectors();
            if (this.ruleSet === undefined || this.ruleSet.length === 0) {
                this.ruleSet = styleScope._mergedCssSelectors;
            }
            else {
                var newRuleSet = [];
                var i = 0;
                var mergedSelector = void 0;
                var ruleSelector = void 0;
                var isReplaced = false;
                for (var _i = 0, _a = styleScope._mergedCssSelectors; _i < _a.length; _i++) {
                    var mergedCssSelectorEach = _a[_i];
                    isReplaced = false;
                    mergedSelector = mergedCssSelectorEach.selectors[0];
                    for (var j = 0; j < newRuleSet.length; j++) {
                        ruleSelector = newRuleSet[j].selectors[0];
                        if ((ruleSelector.cssClass !== undefined && mergedSelector.cssClass !== undefined &&
                            ruleSelector.cssClass === mergedSelector.cssClass)
                            ||
                                (ruleSelector.cssType !== undefined && mergedSelector.cssType !== undefined &&
                                    ruleSelector.cssType === mergedSelector.cssType)
                            ||
                                (ruleSelector.id !== undefined && mergedSelector.id !== undefined &&
                                    ruleSelector.id === mergedSelector.id)) {
                            newRuleSet[j] = mergedCssSelectorEach;
                            isReplaced = true;
                            break;
                        }
                    }
                    if (!isReplaced) {
                        newRuleSet[i] = mergedCssSelectorEach;
                        i++;
                    }
                }
                this.ruleSet = newRuleSet;
            }
            ClientSettings_1.ClientSettings.setUpdateCSSRuleSetFlag(false);
        }
        if (this.ruleSet !== undefined && selectorName) {
            var firstSelector_1;
            this.ruleSet.forEach(function (rule) {
                firstSelector_1 = rule.selectors[0];
                var foundSelectorName;
                var targetSelectorName;
                switch (selectorType) {
                    case Selectors.ClassSelector:
                        foundSelectorName = firstSelector_1.cssClass;
                        targetSelectorName = selectorName;
                        break;
                    case Selectors.TypeSelector:
                        foundSelectorName = firstSelector_1.cssType;
                        targetSelectorName = selectorName.toLowerCase();
                        break;
                    case Selectors.IdSelector:
                        foundSelectorName = firstSelector_1.id;
                        targetSelectorName = selectorName;
                        break;
                    default:
                        break;
                }
                if (!foundSelectorName) {
                    var selectorFromGroup = _this._checkGroupSelector(firstSelector_1);
                    if (selectorFromGroup) {
                        switch (selectorType) {
                            case Selectors.ClassSelector:
                                foundSelectorName = selectorFromGroup.cssClass;
                                break;
                            case Selectors.TypeSelector:
                                foundSelectorName = selectorFromGroup.cssType;
                                break;
                            case Selectors.IdSelector:
                                foundSelectorName = selectorFromGroup.id;
                                break;
                            default:
                                break;
                        }
                    }
                }
                if (foundSelectorName) {
                    if (targetSelectorName === foundSelectorName) {
                        rule.declarations.some(function (declaration) {
                            if (declaration.property === propertyName) {
                                result = declaration.value;
                                return true;
                            }
                        });
                    }
                }
            });
        }
        return result;
    };
    CssPropertyParser.createColor = function (colorString) {
        return new color_1.Color(colorString);
    };
    CssPropertyParser.createFontSize = function (fontSize) {
        var result = parseInt(fontSize, null);
        return isNaN(result) ? null : result;
    };
    CssPropertyParser.createFontFamily = function (fontFamily) {
        return fontFamily.trim().replace(/['"]+/g, '');
    };
    CssPropertyParser.createFontWeight = function (fontWeight) {
        var result = UIFontWeightRegular;
        switch (fontWeight.trim().toLowerCase()) {
            case '100':
                result = UIFontWeightUltraLight;
                break;
            case '200':
                result = UIFontWeightThin;
                break;
            case '300':
                result = UIFontWeightLight;
                break;
            case '400':
            case 'normal':
            default:
                result = UIFontWeightRegular;
                break;
            case '500':
                result = UIFontWeightMedium;
                break;
            case '600':
                result = UIFontWeightSemibold;
                break;
            case '700':
            case 'bold':
                result = UIFontWeightBold;
                break;
            case '800':
                result = UIFontWeightHeavy;
                break;
            case '900':
                result = UIFontWeightBlack;
                break;
        }
        return result;
    };
    CssPropertyParser._checkGroupSelector = function (firstSelector) {
        var foundSelector;
        if (firstSelector && firstSelector.groups && firstSelector.groups.length >= 2) {
            var darkCssClass = 'ns-dark';
            var lightCssClass = 'ns-light';
            var selectorFromGroup = void 0;
            var useSelectorFromOtherGroup = false;
            for (var _i = 0, _a = firstSelector.groups; _i < _a.length; _i++) {
                var selectorGroup = _a[_i];
                selectorFromGroup = this._getSelectorsFromGroup(selectorGroup);
                if (selectorFromGroup) {
                    if ((app.systemAppearance() === 'dark' && selectorFromGroup.cssClass === darkCssClass) ||
                        (app.systemAppearance() === 'light' && selectorFromGroup.cssClass === lightCssClass)) {
                        useSelectorFromOtherGroup = true;
                        break;
                    }
                }
            }
            if (useSelectorFromOtherGroup) {
                for (var _b = 0, _c = firstSelector.groups; _b < _c.length; _b++) {
                    var selectorGroup = _c[_b];
                    selectorFromGroup = this._getSelectorsFromGroup(selectorGroup);
                    if (selectorFromGroup) {
                        if (selectorFromGroup.cssClass !== darkCssClass && selectorFromGroup.cssClass !== lightCssClass) {
                            foundSelector = selectorFromGroup;
                            break;
                        }
                    }
                }
            }
        }
        return foundSelector;
    };
    CssPropertyParser._getSelectorsFromGroup = function (selectorGroup) {
        if (selectorGroup) {
            return selectorGroup.selectors && selectorGroup.selectors.length >= 1 ? selectorGroup.selectors[0].selectors && selectorGroup.selectors[0].selectors.length >= 1 ?
                selectorGroup.selectors[0].selectors[0] : undefined : undefined;
        }
        return undefined;
    };
    CssPropertyParser.ruleSet = [];
    return CssPropertyParser;
}());
exports.CssPropertyParser = CssPropertyParser;
