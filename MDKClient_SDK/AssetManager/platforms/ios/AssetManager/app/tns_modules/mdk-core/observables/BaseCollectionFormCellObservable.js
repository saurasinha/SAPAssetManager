"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCellObservable_1 = require("./BaseFormCellObservable");
var ValueResolver_1 = require("../utils/ValueResolver");
var Context_1 = require("../context/Context");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var PropertyTypeChecker_1 = require("../utils/PropertyTypeChecker");
var EventHandler_1 = require("../EventHandler");
var TypeConverter_1 = require("../utils/TypeConverter");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ListPickerDataBuilder_1 = require("../builders/ui/formcell/ListPickerDataBuilder");
var BaseCollectionFormCellObservable = (function (_super) {
    __extends(BaseCollectionFormCellObservable, _super);
    function BaseCollectionFormCellObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._specifierSupportsUniqueIdentifiers = false;
        _this._collection = [];
        _this._resolvedItem = undefined;
        return _this;
    }
    Object.defineProperty(BaseCollectionFormCellObservable.prototype, "specifierSupportsUniqueIdentifiers", {
        get: function () {
            return this._specifierSupportsUniqueIdentifiers;
        },
        enumerable: true,
        configurable: true
    });
    BaseCollectionFormCellObservable.prototype.bindValue = function (data) {
        var _this = this;
        if (!this._control || !this._control.definition()) {
            throw new Error(ErrorMessage_1.ErrorMessage.BASEFORMCELLOBSERVABLE_BINDVALUE_INVALID);
        }
        var value = data.Value || '';
        this.getTargetSpecifier();
        return this._resolveCollection().then(function () {
            var isTargetEmpty = _this._target ? _this._target.length === 0 : true;
            if (isTargetEmpty) {
                if (_this._resolvedItem !== undefined) {
                    return _this.setValue(_this._resolvedItem, false);
                }
                else {
                    return _this.setValue(value, false);
                }
            }
        });
    };
    BaseCollectionFormCellObservable.prototype.getCollection = function () {
        return this._collection;
    };
    BaseCollectionFormCellObservable.prototype.getTargetSpecifier = function () {
        var result = {};
        var setSpecifier = true;
        if (this._specifier) {
            if (this._specifier.Target) {
                setSpecifier = false;
            }
        }
        if (setSpecifier) {
            this.specifier = CollectionSpecifierFactory.Specifer(this._control.definition().data[this._DISPLAYED_ITEMS_KEY]);
        }
        if (this._specifier.Target) {
            result = Object.assign({}, this._specifier);
        }
        return result;
    };
    BaseCollectionFormCellObservable.prototype.buildSpecifier = function (proxySpecifier) {
        return CollectionSpecifierFactory.SpecifierBuilder(proxySpecifier);
    };
    BaseCollectionFormCellObservable.prototype.setTargetSpecifier = function (proxySpecifier) {
        var _this = this;
        this._reset();
        var specifier = this.buildSpecifier(proxySpecifier);
        return this._resolveCollection(specifier).then(function () {
            _this._assignItems();
            _this._assignSelections();
            _this.specifier = specifier;
        });
    };
    BaseCollectionFormCellObservable.prototype._isValueChanged = function (oldValue) {
        if (!oldValue) {
            return true;
        }
        var newValStr = JSON.stringify(this._target.map(function (el) { return JSON.stringify(el); }).sort());
        var oldValStr = JSON.stringify(oldValue.map(function (el) { return JSON.stringify(el); }).sort());
        return (newValStr !== oldValStr);
    };
    BaseCollectionFormCellObservable.prototype._assignItems = function () {
        var builder = this.builder;
        builder.setDisplayedItems([]);
        if (this._collection && this._collection[0]) {
            var displayedItems = this._collection.map(function (item) { return item.DisplayValue; });
            builder.setDisplayedItems(displayedItems);
        }
        return Promise.resolve();
    };
    BaseCollectionFormCellObservable.prototype._assignSelections = function (index) {
        var builder = this.builder;
        builder.setSelectedItems([]);
        if (index === undefined && this._target && this._target[0]) {
            var selectedItems = this._target.map(function (selectedItem) { return selectedItem.SelectedIndex; });
            builder.setSelectedItems(selectedItems);
        }
        else if (this._target && this._target[index]) {
            builder.setSelectedItems(this._target[index].SelectedIndex);
        }
        return Promise.resolve();
    };
    BaseCollectionFormCellObservable.prototype._bindObjectValuesForSpecifierCollection = function (value) {
        var ctx = new Context_1.Context(value);
        return [
            ValueResolver_1.ValueResolver.resolveValue(this._specifier.ReturnValue, ctx),
            ValueResolver_1.ValueResolver.resolveValue(this._specifier.DisplayValue, ctx)
        ];
    };
    BaseCollectionFormCellObservable.prototype._bindSpecifierCollection = function (items) {
        var _this = this;
        var promises = items.map(function (item) {
            return Promise.all(_this._bindObjectValuesForSpecifierCollection(item));
        });
        if (this._specifier.ObjectCell && items.length === 0) {
            var builder = this.builder;
            builder.setUsesObjectCells(true);
        }
        return Promise.all(promises).then(function (results) {
            if (results) {
                return results.map(function (object) {
                    return _this._buildCollectionObject(object);
                });
            }
        });
    };
    BaseCollectionFormCellObservable.prototype._bindObjectValuesForCollection = function (value, firstRow) {
        var innerPromise = [];
        if (value.ReturnValue !== null && value.ReturnValue !== undefined) {
            var ctx = new Context_1.Context(value);
            innerPromise.push(ValueResolver_1.ValueResolver.resolveValue(value.ReturnValue, ctx));
            if (value.DisplayValue) {
                innerPromise.push(ValueResolver_1.ValueResolver.resolveValue(value.DisplayValue, ctx));
            }
        }
        return innerPromise;
    };
    BaseCollectionFormCellObservable.prototype._bindCollection = function (aObservables) {
        var _this = this;
        var promises = [];
        for (var i = 0; aObservables && i < aObservables.length; i++) {
            var value = aObservables.getItem(i);
            if (typeof value === 'object') {
                var innerPromise = this._bindObjectValuesForCollection(value, i === 0);
                if (innerPromise.length > 0) {
                    promises.push(Promise.all(innerPromise));
                }
            }
            else if (typeof value === 'string') {
                if (this.builder instanceof ListPickerDataBuilder_1.ListPickerDataBuilder) {
                    var builder = this.builder;
                    builder.setStaticCollection(true);
                }
                promises.push(Promise.all([ValueResolver_1.ValueResolver.resolveValue(value, new Context_1.Context(aObservables.getItem(i)))]));
            }
        }
        return Promise.all(promises).then(function (results) {
            if (results && results.length > 0) {
                _this._collection = results.map(function (object) {
                    return _this._buildCollectionObject(object);
                });
            }
        });
    };
    BaseCollectionFormCellObservable.prototype._buildSelectionObject = function (returnValues, selectedItem) {
        var promise = Promise.resolve(undefined);
        if (typeof selectedItem === 'string') {
            this._resolvedItem = selectedItem;
            var resolvedIndex = returnValues.indexOf(selectedItem);
            if (resolvedIndex !== -1) {
                this._resolvedItem = undefined;
                promise = Promise.resolve({
                    DisplayValue: this._collection[resolvedIndex].DisplayValue,
                    ReturnValue: selectedItem,
                    SelectedIndex: resolvedIndex,
                });
            }
        }
        else if (typeof selectedItem === 'number') {
            promise = Promise.resolve({
                DisplayValue: this._collection[selectedItem].DisplayValue,
                ReturnValue: returnValues[selectedItem],
                SelectedIndex: selectedItem,
            });
        }
        return promise;
    };
    BaseCollectionFormCellObservable.prototype._readCollection = function (specifier) {
        var _this = this;
        return EvaluateTarget_1.asService(specifier, this._control.context)
            .then(function (service) { return _this._readFromService(service); });
    };
    BaseCollectionFormCellObservable.prototype._resolveCollection = function (specifier) {
        var _this = this;
        this.specifier = specifier || this.specifier;
        var result = Promise.resolve();
        if (this._specifier.Target &&
            (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(this._specifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isBinding(this._specifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isRule(this._specifier.Target))) {
            result = ValueResolver_1.ValueResolver.resolveValue(this._specifier.Target, this._control.context, false).then(function (data) {
                var resolvedData = data instanceof observable_array_1.ObservableArray ? data : new observable_array_1.ObservableArray(data || []);
                return _this._bindSpecifierCollection(resolvedData).then(function (collection) {
                    _this._collection = collection;
                });
            });
        }
        else if (this._specifier.Target) {
            result = this._readCollection(this._specifier).then(function (data) {
                return _this._bindSpecifierCollection(data).then(function (collection) {
                    _this._collection = collection;
                });
            });
        }
        else if (PropertyTypeChecker_1.PropertyTypeChecker.isRule(this._specifier)) {
            result = new EventHandler_1.EventHandler().executeRule(this._specifier, this._control.context).then(function (value) {
                var obs = new observable_array_1.ObservableArray(TypeConverter_1.TypeConverter.toArray(value));
                return _this._bindCollection(obs);
            });
        }
        else if (Array.isArray(this._specifier)) {
            result = this._bindCollection(new observable_array_1.ObservableArray(this._specifier));
        }
        else {
            var obs = new observable_array_1.ObservableArray(this._control.definition().data[this._DISPLAYED_ITEMS_KEY]);
            result = this._bindCollection(obs);
        }
        return result;
    };
    Object.defineProperty(BaseCollectionFormCellObservable.prototype, "specifier", {
        get: function () {
            return this._specifier;
        },
        set: function (specifer) {
            this._specifier = specifer;
        },
        enumerable: true,
        configurable: true
    });
    BaseCollectionFormCellObservable.prototype._updateTarget = function (value) {
        var _this = this;
        if (this._resolvedItem !== value) {
            this._resolvedItem = value;
        }
        if (typeof value === 'string') {
            var isValueEmpty = !value || /^\s*$/.test(value);
            if (isValueEmpty) {
                value = [];
            }
            else {
                value = [value];
            }
        }
        var returnValues = this._collection.map(function (item) {
            return (item.ReturnValue !== null && item.ReturnValue !== undefined) ?
                TypeConverter_1.TypeConverter.toString(item.ReturnValue) :
                TypeConverter_1.TypeConverter.toString(item);
        });
        return this.parseValue(TypeConverter_1.TypeConverter.toArray(value)).then(function (selectedItems) {
            var promises = selectedItems.map(function (selectedItem) {
                return _this._buildSelectionObject(returnValues, selectedItem).then(function (object) {
                    if (_this._DISPLAYED_ITEMS_KEY === 'FilterProperty' && object !== null && object !== undefined && typeof object.ReturnValue === 'string') {
                        object.ReturnValue = object.ReturnValue.replace(/\'/g, "\\'");
                    }
                    return object;
                });
            });
            return Promise.all(promises).then(function (selections) {
                _this._target = selections.filter(function (selection) {
                    return !!selection;
                });
                _this._control.context.clientAPIProps.newControlValue = _this._target;
                if (_this._control.formatRule()) {
                    return _this._resolveDisplayValueFormatRule();
                }
            });
        });
    };
    BaseCollectionFormCellObservable.prototype._reset = function (resetTarget) {
        if (resetTarget === void 0) { resetTarget = true; }
        this._collection = [];
        var builder = this.builder;
        builder.setDisplayedItems([]);
        if (resetTarget) {
            if (Array.isArray(this._target)) {
                this._target = [];
            }
            else {
                this._target = undefined;
            }
        }
    };
    BaseCollectionFormCellObservable.prototype._resolveDisplayValueFormatRule = function () {
        var _this = this;
        return this._resolveRule(this._collection).then(function (valueFromRule) {
            _this._collection = valueFromRule;
            _this._target.map(function (selectedItem) {
                if (selectedItem && selectedItem.SelectedIndex) {
                    selectedItem.DisplayValue = _this._collection[selectedItem.SelectedIndex].DisplayValue;
                    selectedItem.ReturnValue = _this._collection[selectedItem.SelectedIndex].ReturnValue;
                }
                return selectedItem;
            });
            _this._control.context.clientAPIProps.newControlValue = _this._target;
        });
    };
    BaseCollectionFormCellObservable.prototype._setSpecifierSupportsUniqueIdentifiers = function (specifier) {
        specifier = specifier || this.specifier;
        if (!specifier.Target) {
            this._specifierSupportsUniqueIdentifiers = false;
        }
        else {
            this._specifierSupportsUniqueIdentifiers = specifier.ReturnValue ? specifier.ReturnValue.startsWith('{') : true;
        }
        return this._specifierSupportsUniqueIdentifiers;
    };
    BaseCollectionFormCellObservable.prototype._buildCollectionObject = function (object) {
        var returnValue = object[0];
        var displayValue = returnValue;
        if (object.length > 1) {
            displayValue = object[1];
        }
        if (displayValue == null) {
            displayValue = '';
        }
        else if (typeof displayValue !== 'object') {
            displayValue = String(displayValue);
        }
        return {
            DisplayValue: displayValue,
            ReturnValue: returnValue,
        };
    };
    BaseCollectionFormCellObservable.prototype.parseValue = function (value) {
        var _this = this;
        var promises = value.map(function (item) {
            return ValueResolver_1.ValueResolver.resolveValue(item, _this._control.context);
        });
        return Promise.all(promises);
    };
    return BaseCollectionFormCellObservable;
}(BaseFormCellObservable_1.BaseFormCellObservable));
exports.BaseCollectionFormCellObservable = BaseCollectionFormCellObservable;
var CollectionSpecifierFactory = (function () {
    function CollectionSpecifierFactory() {
    }
    CollectionSpecifierFactory.Specifer = function (definition) {
        var specifier = definition;
        if (!specifier.DisplayValue && specifier.ReturnValue) {
            specifier.DisplayValue = specifier.ReturnValue;
        }
        return specifier;
    };
    CollectionSpecifierFactory.SpecifierBuilder = function (collectionSpecifier) {
        var specifier = {
            DisplayValue: collectionSpecifier.getDisplayValue(),
            ReturnValue: collectionSpecifier.getReturnValue(),
            Target: {
                EntitySet: collectionSpecifier.getEntitySet(),
                Function: collectionSpecifier.getFunction(),
                QueryOptions: collectionSpecifier.getQueryOptions(),
                ServerSidePaging: collectionSpecifier.getServerSidePaging(),
                Service: collectionSpecifier.getService(),
            },
        };
        if (!specifier.DisplayValue && specifier.ReturnValue) {
            specifier.DisplayValue = specifier.ReturnValue;
        }
        return specifier;
    };
    return CollectionSpecifierFactory;
}());
exports.CollectionSpecifierFactory = CollectionSpecifierFactory;
