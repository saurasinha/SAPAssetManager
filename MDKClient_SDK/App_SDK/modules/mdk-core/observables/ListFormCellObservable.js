"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCollectionFormCellObservable_1 = require("./BaseCollectionFormCellObservable");
var Context_1 = require("../context/Context");
var ServiceDataLoader_1 = require("../data/ServiceDataLoader");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var ValueResolver_1 = require("../utils/ValueResolver");
var TypeConverter_1 = require("../utils/TypeConverter");
var CellUtil_1 = require("./common/CellUtil");
var UniqueIdType_1 = require("../common/UniqueIdType");
var UniqueIdType_2 = require("../common/UniqueIdType");
var DataQueryBuilder_1 = require("../builders/odata/DataQueryBuilder");
var PropertyTypeChecker_1 = require("../utils/PropertyTypeChecker");
var DataHelper_1 = require("../utils/DataHelper");
var app = require("tns-core-modules/application");
var ListFormCellObservable = (function (_super) {
    __extends(ListFormCellObservable, _super);
    function ListFormCellObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._DISPLAYED_ITEMS_KEY = 'PickerItems';
        _this._searchString = '';
        _this._inSearching = false;
        _this._ruleAlteredSearchObject = {};
        _this._oldValue = null;
        _this._uniqueId = 0;
        _this._defaultValueIfOneItemSelected = false;
        _this._pendingSearchString = undefined;
        return _this;
    }
    Object.defineProperty(ListFormCellObservable.prototype, "searchingIsActive", {
        get: function () {
            return this._searchString !== '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListFormCellObservable.prototype, "searchString", {
        get: function () {
            return this._searchString;
        },
        enumerable: true,
        configurable: true
    });
    ListFormCellObservable.prototype.cellValueChange = function (newValue) {
        var _this = this;
        return _super.prototype.cellValueChange.call(this, newValue).then(function () {
            return _this.control.updateCell();
        });
    };
    ListFormCellObservable.prototype.loadMoreItems = function (onListPickerPress) {
        var _this = this;
        if (this._inSearching) {
            return;
        }
        if (this._dataLoader) {
            if (onListPickerPress && this._collection.length > 0) {
                this.control.updateCell();
                return;
            }
            if (!this._defaultValueIfOneItemSelected) {
                this._dataLoader.loadMoreItems(this.context).then(function (data) {
                    if (data && data.length) {
                        return _this._bindSpecifierCollection(data).then(function (collection) {
                            _this._collection = _this._collection.concat(collection);
                            _this._assignItems();
                            _this.control.updateCell();
                        });
                    }
                    if (_this._dataLoader.isAllDataRead()) {
                        _this.control.hideLazyLoadingIndicator();
                    }
                });
            }
        }
    };
    ListFormCellObservable.prototype.searchUpdated = function (searchText) {
        var _this = this;
        if (searchText === this._searchString) {
            this._inSearching = false;
            return;
        }
        if (this._inSearching) {
            this._pendingSearchString = searchText;
            return;
        }
        else {
            this._inSearching = true;
        }
        this._searchString = searchText;
        if (!this._oldValue) {
            this._oldValue = this._target;
        }
        this._reset(false);
        return this._resolveCollection(undefined, true).then(function () {
            if (searchText === _this._searchString) {
                _this._assignItems();
                _this.control.updateCell();
                _this._inSearching = false;
            }
            if (_this._pendingSearchString) {
                var pendingSearchText = _this._pendingSearchString.slice();
                _this._pendingSearchString = undefined;
                _this.searchUpdated(pendingSearchText);
            }
        });
    };
    ListFormCellObservable.prototype.webCreateListPickerDialog = function (model) {
        return this.control.webCreateListPickerDialog(model);
    };
    ListFormCellObservable.prototype.androidCreateListPickerFragmentPage = function (model) {
        return this.control.androidCreateListPickerFragmentPage(model);
    };
    ListFormCellObservable.prototype.androidCloseListPickerFragmentPage = function () {
        return this.control.androidCloseListPickerFragmentPage();
    };
    ListFormCellObservable.prototype.androidGetModalFrameTag = function () {
        return this.control.androidGetModalFrameTag();
    };
    ListFormCellObservable.prototype.androidUpdateActionViewExpandedStatus = function (isActive) {
        return this.control.androidUpdateActionViewExpandedStatus(isActive);
    };
    ListFormCellObservable.prototype.androidRefreshForSelections = function (newValue) {
        var _this = this;
        return this.setValue(newValue.get('Value'), true, true).then(function () {
            return _this._control.updateFormCellModel();
        }).then(function () {
            _this.control.androidRefreshForSelections();
        });
    };
    ListFormCellObservable.prototype.setValue = function (value, notify, isTextValue) {
        var _this = this;
        var oldValue = this._oldValue ? this._oldValue : this._target;
        this._oldValue = null;
        this._valueChanged = false;
        return ValueResolver_1.ValueResolver.resolveValue(value, this._control.context).then(function (resolvedValue) {
            return _this._updateTarget(resolvedValue).then(function () {
                _this._assignItems();
                _this._assignSelections();
                if (_this._isValueChanged(oldValue)) {
                    _this._valueChanged = true;
                    return _this.onValueChange(notify);
                }
                else {
                    return Promise.resolve();
                }
            });
        });
    };
    ListFormCellObservable.prototype.setSearchEnabled = function (isSearchEnabled) {
        var builder = this.builder;
        builder.setSearchEnabled(isSearchEnabled);
    };
    ListFormCellObservable.prototype.setBarcodeScanEnabled = function (isBarcodeScanEnabled) {
        var builder = this.builder;
        builder.setBarcodeScanEnabled(isBarcodeScanEnabled);
    };
    ListFormCellObservable.prototype.buildSpecifier = function (proxySpecifier) {
        var specifier = _super.prototype.buildSpecifier.call(this, proxySpecifier);
        var lpSpecifier = proxySpecifier;
        if (proxySpecifier && lpSpecifier.getObjectCell && lpSpecifier.getObjectCell()) {
            specifier.ObjectCell = lpSpecifier.getObjectCell();
            specifier.DisplayValue = undefined;
        }
        return specifier;
    };
    ListFormCellObservable.prototype.setTargetSpecifier = function (specifier) {
        var _this = this;
        this._dataService = undefined;
        return _super.prototype.setTargetSpecifier.call(this, specifier).then(function () {
            if (_this._resolvedItem !== undefined) {
                return _this.setValue(_this._resolvedItem, false);
            }
            return Promise.resolve();
        });
    };
    ListFormCellObservable.prototype.triggerOnValueChangeEventForOneItemSelected = function () {
        if (this._collection.length === 1 && this._defaultValueIfOneItemSelected) {
            return this.onValueChange(true);
        }
    };
    ListFormCellObservable.prototype.setFilterCaption = function (caption) {
        var builder = this.builder;
        builder.setCaption(caption);
    };
    ListFormCellObservable.prototype.updateSelectedValues = function (values) {
        var builder = this.builder;
        builder.setValue(values);
        return this.setValue(values, true);
    };
    ListFormCellObservable.prototype._resolveCollection = function (specifier, loadData) {
        var _this = this;
        specifier = specifier || this.specifier;
        var builder = this.builder;
        var allowDefaultValueIfOneItem = builder.allowDefaultValueIfOneItem;
        this._defaultValueIfOneItemSelected = false;
        if (this._setSpecifierSupportsUniqueIdentifiers(specifier)) {
            this.specifier = specifier;
            builder.setUniqueIdentifiers(true);
            return this.dataService(specifier).then(function (service) {
                var serviceName = '';
                if (_this.specifier.Target) {
                    serviceName = _this.specifier.Target.Service;
                }
                _this.context.searchContext = {
                    searchKeys: _this._getValidSearchProperty(),
                    serviceName: serviceName,
                    service: service,
                };
                return _this._newServiceWithSearchQueryOptions(service).then(function (searchService) {
                    var pageSize = (app.android || app.ios) ? builder.pageSize : 50;
                    _this._dataLoader = new ServiceDataLoader_1.ServiceDataLoader(searchService, pageSize);
                    var filteredDataPromise = Promise.resolve(new observable_array_1.ObservableArray());
                    if (allowDefaultValueIfOneItem) {
                        filteredDataPromise = _this._filterListPickerItemsDataByCount(searchService, 2);
                    }
                    return filteredDataPromise.then(function (filteredData) {
                        var count = filteredData.length;
                        if (allowDefaultValueIfOneItem && count === 1) {
                            return _this._buildCollection(filteredData, allowDefaultValueIfOneItem);
                        }
                        else if (loadData) {
                            return _this._dataLoader.loadMoreItems(_this.context).then(function (data) {
                                return _this._buildCollection(data, allowDefaultValueIfOneItem);
                            });
                        }
                        else {
                            if (_this.specifier.ObjectCell) {
                                builder.setUsesObjectCells(true);
                            }
                            return _this._bindSpecifierCollection(new observable_array_1.ObservableArray([])).then(function (collection) {
                                _this._collection = collection;
                            });
                        }
                    });
                });
            });
        }
        else {
            return _super.prototype._resolveCollection.call(this, specifier).then(function () {
                _this._setResolvedItem(allowDefaultValueIfOneItem);
            });
        }
    };
    ListFormCellObservable.prototype._buildCollection = function (data, allowDefaultValueIfOneItem) {
        var _this = this;
        delete this.context.searchContext;
        return this._bindSpecifierCollection(data).then(function (collection) {
            _this._collection = collection;
            _this._assignItems();
            _this._setResolvedItem(allowDefaultValueIfOneItem);
        });
    };
    ListFormCellObservable.prototype._filterListPickerItemsDataByCount = function (service, count) {
        var dataLoader = new ServiceDataLoader_1.ServiceDataLoader(service, count);
        return dataLoader.loadMoreItems(this.context).then(function (result) {
            if (result === undefined) {
                return new observable_array_1.ObservableArray();
            }
            else {
                return result;
            }
        });
    };
    ListFormCellObservable.prototype._setResolvedItem = function (allowDefaultValueIfOneItem) {
        if (allowDefaultValueIfOneItem === void 0) { allowDefaultValueIfOneItem = false; }
        var count = this._collection.length;
        if (allowDefaultValueIfOneItem && count === 1) {
            this._resolvedItem = (typeof this._collection[0].ReturnValue === 'string') ? this._collection[0].ReturnValue : 0;
            this._defaultValueIfOneItemSelected = true;
        }
    };
    ListFormCellObservable.prototype._bindObjectValuesForCollection = function (value, firstRow) {
        var promises = [];
        if (value.ReturnValue) {
            var builder = this.builder;
            var ctx = new Context_1.Context(value);
            promises.push(ValueResolver_1.ValueResolver.resolveValue(value.ReturnValue, ctx));
            if (value.DisplayValue) {
                promises.push(ValueResolver_1.ValueResolver.resolveValue(value.DisplayValue, ctx));
            }
            else if (value.ObjectCell) {
                builder.setUsesObjectCells(true);
                promises.push(this._resolveObjectCell(value.ObjectCell, ctx));
            }
            if (firstRow) {
                builder.setStaticCollection(true);
            }
        }
        return promises;
    };
    ListFormCellObservable.prototype._bindObjectValuesForSpecifierCollection = function (value) {
        if (this._specifier.ObjectCell) {
            var builder = this.builder;
            builder.setUsesObjectCells(true);
            var ctx = new Context_1.Context(value);
            return [ValueResolver_1.ValueResolver.resolveValue(this._specifier.ReturnValue, ctx),
                this._resolveObjectCell(this._specifier.ObjectCell, ctx)];
        }
        return _super.prototype._bindObjectValuesForSpecifierCollection.call(this, value);
    };
    ListFormCellObservable.prototype._bindItemValue = function (bindingObject, bindingProperty, bindingValue) {
        var bindingContext = new Context_1.Context(bindingObject, this.control);
        bindingContext.clientAPIProps.bindingProperty = bindingProperty;
        return ValueResolver_1.ValueResolver.resolveValue(bindingValue, bindingContext);
    };
    ListFormCellObservable.prototype._resolveObjectCell = function (objectCellDef, ctx) {
        return this._getResolvedObjectCell(objectCellDef, ctx).then(function (r) {
            return ValueResolver_1.ValueResolver.resolveValue(r, ctx);
        });
    };
    ListFormCellObservable.prototype._getResolvedObjectCell = function (objectCellDef, ctx) {
        var _this = this;
        var promises = [];
        var item = {};
        Object.keys(objectCellDef).forEach(function (key) {
            if (key === 'Icons') {
                promises.push(ValueResolver_1.ValueResolver.resolveValue(objectCellDef[key], ctx).then(function (result) {
                    var aIcons = TypeConverter_1.TypeConverter.toArray(result);
                    return Promise.all(aIcons.map(function (image, index) {
                        return _this._bindItemValue(objectCellDef, key + index, image);
                    })).then(function (images) {
                        var validImages = images.filter(function (imageString) {
                            return imageString.length > 0;
                        });
                        if (validImages.length) {
                            item[key] = validImages;
                        }
                    });
                }));
            }
            else if (key === 'Styles') {
                item[key] = item[key] || {};
                promises.push(ValueResolver_1.ValueResolver.resolveValue(objectCellDef[key], ctx).then(function (styles) {
                    var stylePromises = [];
                    Object.keys(styles).map(function (target, id) {
                        stylePromises.push(_this._bindItemValue(objectCellDef, target + 'Style', styles[target]).then(function (newStyle) {
                            item[key][target] = newStyle;
                        }));
                    });
                    return Promise.all(stylePromises);
                }));
            }
            else {
                promises.push(ValueResolver_1.ValueResolver.resolveValue(objectCellDef[key], ctx).then(function (r) {
                    item[key] = r;
                }));
            }
        });
        return Promise.all(promises).then(function () {
            return item;
        });
    };
    ListFormCellObservable.prototype._assignItems = function () {
        var _this = this;
        var builder = this.builder;
        if (builder.requiresUniqueIdentifiers) {
            builder.setDisplayedItems([]);
            if (this._collection) {
                var displayedItems = this._collection.map(function (object) {
                    return _this._buildUniqueIdObject(object);
                });
                builder.setDisplayedItems(displayedItems);
            }
        }
        else if (builder.staticCollection) {
            builder.setDisplayedItems([]);
            if (this._collection) {
                var displayedItems = this._collection.map(function (object) {
                    return object;
                });
                builder.setDisplayedItems(displayedItems);
            }
        }
        else {
            return _super.prototype._assignItems.call(this);
        }
    };
    ListFormCellObservable.prototype._assignSelections = function (index) {
        var _this = this;
        var builder = this.builder;
        if (builder.requiresUniqueIdentifiers) {
            builder.setSelectedItems([]);
            if (index === undefined && this._target && this._target[0]) {
                var selectedItems = this._target.map(function (selection) {
                    return _this._buildUniqueIdObject(selection);
                });
                builder.setSelectedItems(selectedItems);
            }
        }
        else {
            return _super.prototype._assignSelections.call(this, index);
        }
    };
    ListFormCellObservable.prototype._buildSelectionObject = function (returnValues, selection) {
        var _this = this;
        if (this._defaultValueIfOneItemSelected) {
            return _super.prototype._buildSelectionObject.call(this, returnValues, selection);
        }
        else {
            var servicePromise = Promise.resolve();
            if (this.specifierSupportsUniqueIdentifiers) {
                servicePromise = this.dataService();
            }
            return servicePromise.then(function (service) {
                if (_this.specifierSupportsUniqueIdentifiers && service && (UniqueIdType_1.isUniqueIdTypeString(service.uniqueIdType) ||
                    UniqueIdType_2.isUniqueIdTypeInteger(service.uniqueIdType)) && !DataHelper_1.DataHelper.isCallFunctionTarget(service)) {
                    if (selection && ((typeof selection === 'string' && selection.length) || typeof selection === 'number')) {
                        return _this._getItemWithUniqueId(selection);
                    }
                }
                else {
                    return _super.prototype._buildSelectionObject.call(_this, returnValues, selection);
                }
                return Promise.resolve(undefined);
            });
        }
    };
    ListFormCellObservable.prototype._reset = function (resetTarget) {
        _super.prototype._reset.call(this, resetTarget);
        this._dataService = undefined;
    };
    ListFormCellObservable.prototype._buildUniqueIdObject = function (object) {
        if (object && this._isValidUniqueIdObject(object)) {
            return {
                DisplayValue: object.DisplayValue,
                UniqueId: TypeConverter_1.TypeConverter.toString(object.ReturnValue),
            };
        }
        else {
            console.dir("ListFormCellObservable._buildUniqueIdObject unable to convert object " + object);
            return {
                DisplayValue: object.DisplayValue,
                UniqueId: TypeConverter_1.TypeConverter.toString(this._uniqueId++),
            };
        }
    };
    ListFormCellObservable.prototype.dataService = function (specifier) {
        if (!this._dataService) {
            this._dataService = EvaluateTarget_1.asService(specifier || this._specifier, this._control.context);
        }
        return this._dataService;
    };
    ListFormCellObservable.prototype._getItemWithUniqueId = function (uniqueId) {
        var _this = this;
        if (!this.specifierSupportsUniqueIdentifiers) {
            return Promise.resolve();
        }
        return this.dataService().then(function (service) {
            return _this._newServiceWithUidQueryOptions(service, uniqueId).then(function (uniqueIdService) {
                return _this._readFromService(uniqueIdService).then(function (data) {
                    return _this._bindSpecifierCollection(data).then(function (collection) {
                        if (collection && collection[0]) {
                            return Promise.resolve(collection[0]);
                        }
                    });
                });
            });
        });
    };
    ListFormCellObservable.prototype._isValidUniqueIdObject = function (object) {
        return object.DisplayValue !== undefined && object.ReturnValue !== undefined;
    };
    ListFormCellObservable.prototype._getValidSearchProperty = function () {
        var specifier = this.getTargetSpecifier();
        if (specifier.ObjectCell) {
            var result = [];
            var service = void 0;
            var entitySet = void 0;
            var isTargetResolvable = false;
            if (specifier.Target) {
                service = specifier.Target.Service;
                entitySet = specifier.Target.EntitySet;
                isTargetResolvable = ValueResolver_1.ValueResolver.canResolve(entitySet) || ValueResolver_1.ValueResolver.canResolve(service);
            }
            for (var _i = 0, _a = CellUtil_1.CellUtil.objectCellSearchKeys; _i < _a.length; _i++) {
                var key = _a[_i];
                var prop = specifier.ObjectCell[key];
                if (prop) {
                    if (PropertyTypeChecker_1.PropertyTypeChecker.isDynamicTargetPath(prop)
                        || PropertyTypeChecker_1.PropertyTypeChecker.isNewDynamicTargetPath(prop)
                        || PropertyTypeChecker_1.PropertyTypeChecker.isBinding(prop)
                        || PropertyTypeChecker_1.PropertyTypeChecker.isNewBinding(prop)
                        || PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(prop)) {
                        var r = CellUtil_1.CellUtil.parsePropertyName(prop);
                        if (r && r.length > 0) {
                            for (var _b = 0, r_1 = r; _b < r_1.length; _b++) {
                                var item = r_1[_b];
                                if (result.indexOf(item) === -1 && item.indexOf('/#') === -1 && (isTargetResolvable || DataHelper_1.DataHelper.isSearchableProperty(specifier.Target, item))) {
                                    result.push(item);
                                }
                            }
                        }
                    }
                }
            }
            return result;
        }
        else {
            var propertyKey = 'DisplayValue';
            var prop = specifier[propertyKey];
            return CellUtil_1.CellUtil.parsePropertyName(prop);
        }
    };
    ListFormCellObservable.prototype._newServiceWithSearchQueryOptions = function (service) {
        var searchService = Object.assign({}, service);
        var queryBuilder;
        if (!searchService.queryBuilder) {
            queryBuilder = new DataQueryBuilder_1.DataQueryBuilder(this.context, searchService.queryOptions);
            if (this.searchingIsActive) {
                if (queryBuilder.hasFilter) {
                    queryBuilder.filter().and(queryBuilder.mdkSearch(this._searchString));
                }
                else {
                    queryBuilder.filter(queryBuilder.mdkSearch(this._searchString));
                }
            }
        }
        else {
            queryBuilder = searchService.queryBuilder;
        }
        return queryBuilder.build().then(function (builtQuery) {
            searchService.queryOptions = builtQuery;
            return searchService;
        });
    };
    ListFormCellObservable.prototype._newServiceWithUidQueryOptions = function (service, uniqueId) {
        var uniqueIdService = Object.assign({}, service);
        var specifier = this.getTargetSpecifier();
        if (specifier.ReturnValue === '{@odata.readLink}') {
            uniqueIdService.entitySet = uniqueId;
            if (uniqueIdService.queryOptions !== '') {
                var queryBuilder = void 0;
                if (!uniqueIdService.queryBuilder) {
                    queryBuilder = new DataQueryBuilder_1.DataQueryBuilder(this.context, uniqueIdService.queryOptions);
                }
                else {
                    queryBuilder = uniqueIdService.queryBuilder;
                }
                queryBuilder.updateQueryOptionsForUniqueRecord();
                return queryBuilder.build().then(function (builtQuery) {
                    uniqueIdService.queryOptions = builtQuery;
                    uniqueIdService.queryBuilder = undefined;
                    return uniqueIdService;
                });
            }
            return Promise.resolve(uniqueIdService);
        }
        else {
            var uniqueIdPropName = specifier.ReturnValue.slice(1, -1);
            var uniqueFilter = uniqueIdPropName + " eq '" + uniqueId + "'";
            var propType = DataHelper_1.DataHelper.getPropertyType(specifier.Target.Service, uniqueIdService.entitySet, uniqueIdPropName);
            if (propType !== '' && propType !== 'string') {
                uniqueFilter = uniqueIdPropName + " eq " + uniqueId;
            }
            var queryBuilder = void 0;
            if (!uniqueIdService.queryBuilder) {
                queryBuilder = new DataQueryBuilder_1.DataQueryBuilder(this.context, uniqueIdService.queryOptions);
            }
            else {
                queryBuilder = uniqueIdService.queryBuilder;
                queryBuilder.updateQueryOptionsForUniqueRecord();
            }
            if (queryBuilder.hasFilter) {
                queryBuilder.filter().and(uniqueFilter);
            }
            else {
                queryBuilder.filter(uniqueFilter);
            }
            return queryBuilder.build().then(function (builtQuery) {
                uniqueIdService.queryOptions = builtQuery;
                return uniqueIdService;
            });
        }
    };
    return ListFormCellObservable;
}(BaseCollectionFormCellObservable_1.BaseCollectionFormCellObservable));
exports.ListFormCellObservable = ListFormCellObservable;
