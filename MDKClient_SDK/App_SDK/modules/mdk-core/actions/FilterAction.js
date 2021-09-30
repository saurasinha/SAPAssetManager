"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavigationAction_1 = require("./NavigationAction");
var FilterActionDefinition_1 = require("../definitions/actions/FilterActionDefinition");
var PageRenderer_1 = require("../pages/PageRenderer");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var FilterAction = (function (_super) {
    __extends(FilterAction, _super);
    function FilterAction(actionDefinition) {
        var _this = this;
        if (!(actionDefinition instanceof FilterActionDefinition_1.FilterActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_FILTERACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, actionDefinition) || this;
        return _this;
    }
    FilterAction.prototype.execute = function () {
        var _this = this;
        var definition = this.definition;
        return Promise.all([this._resolveValue(definition.getFilterable())]).then(function (result) {
            var filterableObject = result[0];
            if (!filterableObject) {
                throw new Error(ErrorMessage_1.ErrorMessage.UNDEFINED_FILTERABLE);
            }
            if (filterableObject.getFilterCriteria === undefined) {
                throw new Error(ErrorMessage_1.ErrorMessage.MISSING_FILTER_CRITERIA);
            }
            if (filterableObject.setFilterResult === undefined) {
                throw new Error(ErrorMessage_1.ErrorMessage.FILTER_RESULT_CANNOT_SET);
            }
            _this.context().clientAPIProps.filter = filterableObject;
            return _this.executePopover(definition).then(function (executeResult) {
                var filterResultData = filterableObject.setFilterResult(executeResult);
                return new ActionResultBuilder_1.ActionResultBuilder().data(new FilterActionResultData(filterResultData)).build();
            }, function (error) {
                throw error;
            });
        }, function (error) {
            throw error;
        });
    };
    FilterAction.prototype.executePopover = function (definition) {
        var _this = this;
        return this._resolveValue(definition.getPageToOpen()).then(function (result) {
            return PageRenderer_1.PageRenderer.showModalPage(result, true, false, _this.source);
        }, function (error) {
            throw error;
        });
    };
    return FilterAction;
}(NavigationAction_1.NavigationAction));
exports.FilterAction = FilterAction;
var FilterActionResultData = (function () {
    function FilterActionResultData(actionResult) {
        this._filter = '$filter=' + actionResult.filter;
        this._sorter = '$orderBy=' + actionResult.sorter;
    }
    Object.defineProperty(FilterActionResultData.prototype, "filter", {
        get: function () {
            return this._filter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterActionResultData.prototype, "sorter", {
        get: function () {
            return this._sorter;
        },
        enumerable: true,
        configurable: true
    });
    return FilterActionResultData;
}());
exports.FilterActionResultData = FilterActionResultData;
