"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCollectionSectionObservable_1 = require("./BaseCollectionSectionObservable");
var Logger_1 = require("../../utils/Logger");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var EvaluateTarget_1 = require("../../data/EvaluateTarget");
var PropertyTypeChecker_1 = require("../../utils/PropertyTypeChecker");
var ValueResolver_1 = require("../../utils/ValueResolver");
var AnalyticCardCollectionSectionObservable = (function (_super) {
    __extends(AnalyticCardCollectionSectionObservable, _super);
    function AnalyticCardCollectionSectionObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._data = new observable_array_1.ObservableArray();
        _this._dataReadPageSize = 50;
        _this._boundItems = [];
        _this._resolveSectionTarget = false;
        return _this;
    }
    AnalyticCardCollectionSectionObservable.prototype.onPress = function (row) {
        var selectedItem = this.getBoundData(row);
        this.section.page.context.clientAPIProps.actionBinding = this.getItem(row) || selectedItem;
        var onPress = undefined;
        if (selectedItem.OnPress) {
            onPress = selectedItem.OnPress;
        }
        if (onPress) {
            var handler = this.buildBaseSectionEventHandler();
            return handler.executeActionOrRule(onPress, this.section.context);
        }
        return Promise.resolve();
    };
    AnalyticCardCollectionSectionObservable.prototype.getItem = function (index) {
        if (this._data && this._data !== undefined && index <= this._data.length) {
            return this._data.getItem(index);
        }
    };
    AnalyticCardCollectionSectionObservable.prototype.getBoundData = function (row) {
        return this._boundItems[row];
    };
    AnalyticCardCollectionSectionObservable.prototype.loadMoreItems = function () {
    };
    AnalyticCardCollectionSectionObservable.prototype.bind = function () {
        var _this = this;
        var definition = this.section.definition;
        this._resolveSectionTarget = true;
        return this._resolveData(definition.data).then(function (resolvedData) {
            if (resolvedData && resolvedData.length !== 0) {
                _this._data = resolvedData;
            }
        }).catch(function (error) {
            Logger_1.Logger.instance.ui.error(error + " " + error.stack);
        }).then(function () {
            return _super.prototype.bind.call(_this).then(function () {
                return _this.bindItems();
            });
        });
    };
    AnalyticCardCollectionSectionObservable.prototype._resolveData = function (cardDefinition) {
        var _this = this;
        var targetSpecifier = cardDefinition;
        if (this._resolveSectionTarget) {
            targetSpecifier = this.getRuntimeSpecifier(cardDefinition);
            this._resolveSectionTarget = false;
        }
        if (targetSpecifier.Target) {
            if (PropertyTypeChecker_1.PropertyTypeChecker.isRule(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isBinding(targetSpecifier.Target)) {
                return ValueResolver_1.ValueResolver.resolveValue(targetSpecifier.Target, this.section.context, false).then(function (data) {
                    var resolvedData = data instanceof observable_array_1.ObservableArray ? data : new observable_array_1.ObservableArray(data || []);
                    return Promise.resolve(resolvedData);
                });
            }
            else {
                var origQuery_1 = targetSpecifier.Target.QueryOptions;
                return EvaluateTarget_1.asService(targetSpecifier, this.section.context).then(function (service) {
                    targetSpecifier.Target.QueryOptions = origQuery_1;
                    return _this._readFromService(service)
                        .catch(function (error) {
                        Logger_1.Logger.instance.ui.error(Logger_1.Logger.ERROR, error, error.stack);
                        return undefined;
                    });
                });
            }
        }
        else {
            return Promise.resolve(new observable_array_1.ObservableArray());
        }
    };
    AnalyticCardCollectionSectionObservable.prototype._bindRowProperties = function (row, bindingObject, definition) {
        var _this = this;
        var item = {};
        item[AnalyticCardCollectionSectionObservable._objectID] = row;
        var promises = [];
        var analyticCard;
        if (definition.AnalyticCard) {
            analyticCard = definition.AnalyticCard;
        }
        else {
            var analyticCards = definition.AnalyticCards;
            analyticCard = analyticCards[row];
        }
        return this.resolveDataForCard(analyticCard, bindingObject).then(function (resolvedBindingObject) {
            _this._data.setItem(row, resolvedBindingObject);
            Object.keys(analyticCard).forEach(function (key) {
                if (key === 'OnPress') {
                    item[key] = analyticCard[key];
                    return;
                }
                promises.push(_this._bindValue(resolvedBindingObject, key, analyticCard[key]).then(function (value) {
                    item[key] = value;
                }));
            });
            return Promise.all(promises).then(function () {
                return item;
            }).catch(function (error) {
                Logger_1.Logger.instance.valueResolver.error("Fail to bind row properties: " + error + "\n" + error.stack);
                return item;
            });
        });
    };
    AnalyticCardCollectionSectionObservable.prototype._setMaxItems = function (definition) {
        var numberOfItems;
        var maxNumberOfItems = definition.maxItemCount;
        if (definition.AnalyticCard) {
            numberOfItems = this._data.length;
        }
        else if (definition.AnalyticCards) {
            numberOfItems = definition.AnalyticCards.length;
        }
        if (maxNumberOfItems) {
            this._maxItemCount = Math.min(maxNumberOfItems, numberOfItems);
        }
        else {
            this._maxItemCount = numberOfItems ? numberOfItems : 0;
        }
    };
    AnalyticCardCollectionSectionObservable.prototype._bindRow = function (row, bindingObject, definition) {
        bindingObject = this._getValidBindObject(bindingObject);
        return this._bindRowProperties(row, bindingObject, definition).then(function (item) {
            return item;
        });
    };
    AnalyticCardCollectionSectionObservable.prototype.bindItems = function () {
        var _this = this;
        var definition = this.section.definition;
        this._setMaxItems(definition);
        var initialRows = Math.min(this._maxItemCount, this._dataReadPageSize);
        var rowBindings = [];
        for (var i = 0; i < initialRows; i++) {
            rowBindings.push(this._bindRow(i, this.getItem(i), definition));
        }
        return Promise.all(rowBindings).then(function (items) {
            _this._boundItems = items;
            _this._sectionParameters[AnalyticCardCollectionSectionObservable.ITEMS_PARAM_KEY] = items;
            return _this._sectionParameters;
        });
    };
    AnalyticCardCollectionSectionObservable.prototype.resolveDataForCard = function (analyticCard, bindingObject) {
        if (analyticCard.Target) {
            return this._resolveData(analyticCard).then(function (resolvedData) { return resolvedData.getItem(0); });
        }
        else {
            return Promise.resolve(bindingObject);
        }
    };
    AnalyticCardCollectionSectionObservable.ITEMS_PARAM_KEY = 'items';
    AnalyticCardCollectionSectionObservable._objectID = 'ObjectID';
    return AnalyticCardCollectionSectionObservable;
}(BaseCollectionSectionObservable_1.BaseCollectionSectionObservable));
exports.AnalyticCardCollectionSectionObservable = AnalyticCardCollectionSectionObservable;
