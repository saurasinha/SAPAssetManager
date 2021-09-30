"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCollectionSectionObservable_1 = require("./BaseCollectionSectionObservable");
var Context_1 = require("../../context/Context");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var PropertyTypeChecker_1 = require("../../utils/PropertyTypeChecker");
var EvaluateTarget_1 = require("../../data/EvaluateTarget");
var EventHandler_1 = require("../../EventHandler");
var Tracer_1 = require("../../utils/Tracer");
var Logger_1 = require("../../utils/Logger");
var ServiceDataLoader_1 = require("../../data/ServiceDataLoader");
var bindings_1 = require("../common/bindings");
var ValueResolver_1 = require("../../utils/ValueResolver");
var DataQueryBuilder_1 = require("../../builders/odata/DataQueryBuilder");
var TabFrame_1 = require("../../pages/TabFrame");
var MDKPage_1 = require("../../pages/MDKPage");
var BaseTableSection_1 = require("../../sections/BaseTableSection");
var FlexibleColumnFrame_1 = require("../../pages/FlexibleColumnFrame");
var platform_1 = require("tns-core-modules/platform");
var BaseControlDefinition_1 = require("../../definitions/controls/BaseControlDefinition");
var app = require("tns-core-modules/application");
var ContextItem_1 = require("../../controls/ContextItem");
var SelectedItem_1 = require("../../controls/SelectedItem");
var DataHelper_1 = require("../../utils/DataHelper");
var SearchMode;
(function (SearchMode) {
    SearchMode["Persistent"] = "Persistent";
    SearchMode["Expandable"] = "Expandable";
})(SearchMode || (SearchMode = {}));
var BaseTableSectionObservable = (function (_super) {
    __extends(BaseTableSectionObservable, _super);
    function BaseTableSectionObservable(section) {
        var _this = _super.call(this, section) || this;
        _this._data = new observable_array_1.ObservableArray();
        _this._dataReadPageSize = 50;
        _this._isDataFromITargetServiceSpecifier = true;
        _this._searchKeys = [];
        _this._usesExtensions = 'Uses_Extensions';
        _this._extensionRatio = 'Extension_Ratio';
        _this._extensionMaxWidth = 'Extension_MaxWidth';
        _this._extensionHeight = 'Extension_Height';
        _this._isAFullPageList = 'isFullPageList';
        _this._highlightSelectedItem = 'highlightSelectedItem';
        _this._isWithinFlexibleColumnLeadingPage = 'isWithinFlexibleColumnLeadingPage';
        _this._isFlexibleColumnLeadingPageActive = 'isFlexibleColumnLeadingPageActive';
        _this._selectionModeKey = 'selectionMode';
        _this._longPressToEnableKey = 'longPressToEnable';
        _this._exitOnLastDeselectKey = 'exitOnLastDeselect';
        _this._dataPaging = 'dataPaging';
        _this._bindingContext = {};
        _this._searchString = '';
        _this._currentFilter = '';
        _this._currentOrderBy = '';
        _this._originalOrderBy = '';
        _this._boundItems = [];
        _this._selectedItem = {};
        _this._pendingRedraw = undefined;
        _this._loadMoreItemsFlag = false;
        _this._readLinks = [];
        _this._insertDeleteFlag = false;
        _this._selectedItems = [];
        _this._selectedRows = undefined;
        _this._selectionMode = undefined;
        _this._searchKeys = _this._getSearchKeys();
        return _this;
    }
    Object.defineProperty(BaseTableSectionObservable.prototype, "searchString", {
        get: function () {
            return this._searchString;
        },
        enumerable: true,
        configurable: true
    });
    BaseTableSectionObservable.prototype.bind = function () {
        var _this = this;
        this._resetData();
        var definition = this.section.definition;
        var pagingPromise = Promise.resolve();
        if (definition.getDataPaging() != null) {
            pagingPromise = this._bindValue(this.binding, this._dataPaging, definition.getDataPaging());
        }
        return pagingPromise.then(function (pagingValue) {
            if (pagingValue) {
                _this._dataPagingObject = pagingValue;
                if (pagingValue.PageSize && pagingValue.PageSize > 0 && (app.ios || app.android)) {
                    _this._dataReadPageSize = pagingValue.PageSize;
                }
            }
            var originalReadPageSize = _this._dataReadPageSize;
            var page = _this._boundItems.length > 0 ? Math.ceil(_this._boundItems.length / _this._dataReadPageSize) : 1;
            _this._dataReadPageSize = page * _this._dataReadPageSize;
            return _this._resolveData(definition).then(function (resolvedData) {
                if (resolvedData && resolvedData.length !== 0 && _this._data.length === 0) {
                    _this._data = resolvedData;
                }
            }).catch(function (error) {
                Logger_1.Logger.instance.ui.error(error + " " + error.stack);
            }).then(function () {
                return _super.prototype.bind.call(_this).then(function () {
                    return _this.bindInitialItems();
                });
            }).finally(function () {
                _this._dataReadPageSize = originalReadPageSize;
            });
        });
    };
    Object.defineProperty(BaseTableSectionObservable.prototype, "binding", {
        get: function () {
            return (this._data && this._data.length) ? this._data : this.section.context.binding;
        },
        enumerable: true,
        configurable: true
    });
    BaseTableSectionObservable.prototype.bindInitialItems = function () {
        var _this = this;
        var definition = this.section.definition;
        this._setMaxItems();
        var initialRows;
        var sectionIndex = this._getSectionIndex();
        var numOfVisibleSections = this._getVisibleSectionCount();
        if (this._isDataFromITargetServiceSpecifier) {
            if (app.android && numOfVisibleSections > 1 && sectionIndex < numOfVisibleSections) {
                initialRows = this._maxItemCount;
            }
            else {
                initialRows = Math.min(this._maxItemCount, this._dataReadPageSize);
            }
        }
        else {
            initialRows = this._maxItemCount;
        }
        var rowBindings = [];
        var tid = Tracer_1.Tracer.startTrace();
        this.sectionParameters[this._isAFullPageList] = this._isFullPageList() ? true : false;
        if (this._dataPagingObject) {
            this.sectionParameters[this._dataPaging] = this._dataPagingObject;
        }
        if (this._selectionMode !== undefined) {
            this.sectionParameters['selectionMode'] = this._selectionMode;
        }
        if (this._selectedRows) {
            this.sectionParameters['selectedRows'] = this._selectedRows;
        }
        if (definition.usesExtensionViews) {
            this.sectionParameters[this._usesExtensions] = true;
            if (definition.data.Extension.DimensionRatio) {
                rowBindings.push(this._bindValue(this.binding, this._extensionRatio, definition.data.Extension.DimensionRatio)
                    .then(function (value) {
                    _this.sectionParameters[_this._extensionRatio] = value;
                }));
            }
            if (definition.data.Extension.MaxWidth) {
                rowBindings.push(this._bindValue(this.binding, this._extensionMaxWidth, definition.data.Extension.MaxWidth)
                    .then(function (value) {
                    _this.sectionParameters[_this._extensionMaxWidth] = value;
                }));
            }
            if (definition.data.Extension.Height) {
                rowBindings.push(this._bindValue(this.binding, this._extensionHeight, definition.data.Extension.Height)
                    .then(function (value) {
                    _this.sectionParameters[_this._extensionHeight] = value;
                }));
            }
        }
        else {
            for (var i = 0; i < initialRows; i++) {
                rowBindings.push(this._bindRow(i, this.getItem(i), this._definitionForRow(i)));
            }
        }
        return Promise.all(rowBindings).then(function (items) {
            _this._boundItems = _this._filterCells(items);
            if (_this._staticCells) {
                _this._maxItemCount = _this._boundItems.length;
            }
            var searchContext = new Context_1.Context(_this.section.context, _this.section);
            return bindings_1.asSearch(definition, searchContext).then(function (searchObject) {
                _this._sectionParameters[bindings_1.SearchBindings.SEARCH_KEY] = searchObject;
                if (_this._sectionParameters.hasOwnProperty(bindings_1.SearchBindings.SEARCH_KEY)) {
                    if (_this._sectionParameters[bindings_1.SearchBindings.SEARCH_KEY]) {
                        _this._sectionParameters[bindings_1.SearchBindings.SEARCH_KEY][bindings_1.SearchBindings.MODE_KEY] = SearchMode.Expandable;
                        if (_this.section.page instanceof MDKPage_1.MDKPage && TabFrame_1.TabFrame.isTabsTabFrame(_this.section.page.frame)) {
                            _this._sectionParameters[bindings_1.SearchBindings.SEARCH_KEY][bindings_1.SearchBindings.MODE_KEY] = SearchMode.Persistent;
                        }
                    }
                }
                Tracer_1.Tracer.commitTrace(tid, "Bound " + initialRows + " initial rows", 'ObjectTable');
                return _this._sectionParameters;
            });
        });
    };
    BaseTableSectionObservable.prototype.getOrderBy = function () {
        return (this._currentOrderBy !== '') ? this._currentOrderBy : this._originalOrderBy;
    };
    BaseTableSectionObservable.prototype.filterUpdated = function (filterQuery) {
        if (filterQuery.filter !== this._currentFilter || filterQuery.sorter !== this._currentOrderBy) {
            this._currentFilter = filterQuery.filter;
            this._currentOrderBy = filterQuery.sorter;
            return this.section.redraw(undefined);
        }
        else {
            return Promise.resolve();
        }
    };
    BaseTableSectionObservable.prototype.getItem = function (index) {
        if (this._data && this._data !== undefined && index <= this._data.length) {
            return this._data.getItem(index);
        }
    };
    BaseTableSectionObservable.prototype.getBoundData = function (row) {
        if (!this._isItemBound(row)) {
            this._bindAdditionalCell(row);
        }
        return this._boundItems[row];
    };
    BaseTableSectionObservable.prototype.isDataBounded = function (row) {
        return this._isItemBound(row);
    };
    Object.defineProperty(BaseTableSectionObservable.prototype, "selectedItem", {
        get: function () {
            return this._selectedItem;
        },
        enumerable: true,
        configurable: true
    });
    BaseTableSectionObservable.prototype.loadMoreItems = function () {
        var _this = this;
        if (this._isFullPageList()) {
            if (this._dataLoader) {
                if (this._loadMoreItemsFlag) {
                    return Promise.resolve(this._loadMoreItemsFlag);
                }
                this._loadMoreItemsFlag = true;
                var bindBegin_1 = this._data.length;
                return this._dataLoader.loadMoreItems(this.section.context).then(function (loadedData) {
                    if (loadedData && loadedData.length) {
                        _this._data = _this._dataLoader.data;
                        var rowBindings = [];
                        for (; bindBegin_1 < _this._data.length; bindBegin_1++) {
                            rowBindings.push(_this._bindRow(bindBegin_1, _this.getItem(bindBegin_1), _this._definitionForRow(bindBegin_1)));
                        }
                        return Promise.all(rowBindings).then(function (boundItems) {
                            _this._boundItems = _this._boundItems.concat(boundItems);
                            _this.section.reloadData(_this._boundItems.length);
                            return _this._loadMoreItemsFlag = false;
                        });
                    }
                    else {
                        if (_this._dataLoader.isAllDataRead()) {
                            var dataPaging = _this.sectionParameters[_this._dataPaging];
                            if (dataPaging && dataPaging.ShowLoadingIndicator && _this.section instanceof BaseTableSection_1.BaseTableSection) {
                                _this.section.hideLazyLoadingIndicator();
                            }
                        }
                        return Promise.resolve(_this._loadMoreItemsFlag);
                    }
                }).catch(function (error) {
                    _this._loadMoreItemsFlag = false;
                    throw error;
                });
            }
        }
        return Promise.resolve();
    };
    BaseTableSectionObservable.prototype.onDataChanged = function (action, result) {
        if (action.type === 'Action.Type.ODataService.UpdateEntity') {
            var updateAction = action;
            var entitySet = updateAction.readLink.split('(')[0];
            var sectionEntitySet = this._dataLoader ? this._dataLoader.service.entitySet : undefined;
            if (entitySet === sectionEntitySet && this._readLinks.indexOf(updateAction.readLink) === -1) {
                this._readLinks.push(updateAction.readLink);
            }
        }
        else if (action.type === 'Action.Type.ODataService.CreateEntity'
            || action.type === 'Action.Type.ODataService.DeleteEntity'
            || action.type === 'Action.Type.ODataService.CreateMedia'
            || action.type === 'Action.Type.ODataService.DeleteMedia') {
            this._insertDeleteFlag = true;
        }
        if (this.isPageVisible) {
            return _super.prototype.redraw.call(this);
        }
        else {
            return Promise.resolve(this.section.page.staleDataListeners.add(this));
        }
    };
    BaseTableSectionObservable.prototype.redraw = function () {
        var _this = this;
        if (!this._pendingRedraw) {
            if (this._readLinks.length > 0 && !this._insertDeleteFlag && (app.ios || app.android)) {
                return this._redrawRows();
            }
            this._insertDeleteFlag = false;
            if (this._readLinks.length > 0) {
                this._readLinks = [];
            }
            this._resetData();
            this._pendingRedraw = _super.prototype.redraw.call(this);
            return this._pendingRedraw.then(function (currSearchString) {
                _this._pendingRedraw = undefined;
                if (currSearchString !== _this._searchString) {
                    _this.section.redraw(undefined);
                }
            });
        }
        else {
            Logger_1.Logger.instance.ui.info('BaseTableSectionObservable - redraw pending');
        }
    };
    BaseTableSectionObservable.prototype.resetDataChangedFlag = function () {
        this._insertDeleteFlag = false;
        this._readLinks = [];
    };
    BaseTableSectionObservable.prototype.onPress = function (row, action) {
        var _this = this;
        if (this._pendingRedraw) {
            return this._pendingRedraw.then(function () {
                return _this._onPressFunc(row, action).then(function () {
                    _this._pendingRedraw = undefined;
                });
            });
        }
        else {
            return this._onPressFunc(row, action);
        }
    };
    BaseTableSectionObservable.prototype.onSwipe = function (row) {
        return this._onSwipeFunc(row);
    };
    BaseTableSectionObservable.prototype.getLeftKey = function (row) {
        return this._getLeftKey(row);
    };
    BaseTableSectionObservable.prototype.getRightKey = function (row) {
        return this._getRightKey(row);
    };
    BaseTableSectionObservable.prototype.searchUpdated = function (searchText) {
        if (searchText !== this._searchString) {
            this._searchString = searchText;
            return this.section.redraw(undefined);
        }
        else {
            return Promise.resolve();
        }
    };
    BaseTableSectionObservable.prototype._createStaticCellsData = function () {
        return Promise.resolve(new observable_array_1.ObservableArray());
    };
    BaseTableSectionObservable.prototype.isSectionEmpty = function () {
        return !this._data || this._data.length === 0;
    };
    BaseTableSectionObservable.prototype._definitionForRow = function (row) {
        if (this._staticCells) {
            return this._data.getItem(row);
        }
        else {
            return this.section.definition;
        }
    };
    BaseTableSectionObservable.prototype._bindValues = function (bindingObject, definition) {
        var _this = this;
        return _super.prototype._bindValues.call(this, bindingObject, definition).then(function (sectionParameters) {
            sectionParameters[_this._isWithinFlexibleColumnLeadingPage] = false;
            sectionParameters[_this._isFlexibleColumnLeadingPageActive] = false;
            if (platform_1.device.deviceType === 'Tablet' && _this.section.page.targetFrameId) {
                if (FlexibleColumnFrame_1.FlexibleColumnFrame.isFlexibleColumnFrame(_this.section.page.targetFrameId)) {
                    if (!FlexibleColumnFrame_1.FlexibleColumnFrame.isEndColumnWithinFlexibleColumnLayout(_this.section.page.targetFrameId)) {
                        sectionParameters[_this._isWithinFlexibleColumnLeadingPage] = true;
                    }
                    if (!FlexibleColumnFrame_1.FlexibleColumnFrame.isLastFrameWithinFlexibleColumnLayout(_this.section.page.targetFrameId)) {
                        sectionParameters[_this._isFlexibleColumnLeadingPageActive] = true;
                    }
                }
            }
            var promises = [];
            if (definition.hasSelection) {
                if (_this._selectionMode !== undefined) {
                    sectionParameters[_this._selectionModeKey] = _this._selectionMode;
                }
                else {
                    promises.push(_this._bindValue(_this.binding, _this._selectionModeKey, definition.selectionMode).then(function (value) {
                        sectionParameters[_this._selectionModeKey] = value;
                        _this._selectionMode = value;
                    }));
                }
                promises.push(_this._bindValue(_this.binding, _this._longPressToEnableKey, definition.longPressToEnable).then(function (value) {
                    sectionParameters[_this._longPressToEnableKey] = value;
                }));
                promises.push(_this._bindValue(_this.binding, _this._exitOnLastDeselectKey, definition.exitOnLastDeselect).then(function (value) {
                    sectionParameters[_this._exitOnLastDeselectKey] = value;
                }));
            }
            return Promise.all(promises).then(function () {
                if (definition.highlightSelectedItem !== undefined) {
                    return _this._bindValue(_this.binding, 'HighlightSelectedItem', definition.highlightSelectedItem)
                        .then(function (value) {
                        sectionParameters[_this._highlightSelectedItem] = value;
                        return sectionParameters;
                    });
                }
                else {
                    sectionParameters[_this._highlightSelectedItem] = false;
                    if (_this.section && _this.section.page) {
                        var pageDef = _this.section.page.definition;
                        var sectionsCount = 0;
                        if (pageDef.getControls().length > 0) {
                            var firstDefinitionControl = pageDef.getControls()[0];
                            if (firstDefinitionControl.getType() === BaseControlDefinition_1.BaseControlDefinition.type.SectionedTable) {
                                sectionsCount = firstDefinitionControl.getSectionCount();
                            }
                        }
                        if (sectionParameters[_this._isWithinFlexibleColumnLeadingPage] && sectionsCount === 1) {
                            sectionParameters[_this._highlightSelectedItem] = true;
                        }
                    }
                    return sectionParameters;
                }
            });
        });
    };
    BaseTableSectionObservable.prototype._resolveData = function (definition) {
        var _this = this;
        var targetSpecifier = this.getRuntimeSpecifier(definition.data);
        if (targetSpecifier.Target) {
            if (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isBinding(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isRule(targetSpecifier.Target)) {
                return ValueResolver_1.ValueResolver.resolveValue(targetSpecifier.Target, this.section.context, false).then(function (data) {
                    var resolvedData = data instanceof observable_array_1.ObservableArray ? data : new observable_array_1.ObservableArray(data || []);
                    _this._isDataFromITargetServiceSpecifier = false;
                    return Promise.resolve(resolvedData);
                });
            }
            else {
                return this.originalService.then(function (service) {
                    _this.section.context.searchContext = {
                        filter: _this._currentFilter,
                        orderBy: _this._currentOrderBy,
                        searchKeys: _this._retrieveSearchKeys,
                        serviceName: targetSpecifier.Target.Service,
                        service: service,
                    };
                    return _this._newServiceWithSearchAndFilterQueryOptions(service).then(function (searchAndFilterService) {
                        var sectionIndex = _this._getSectionIndex();
                        var numOfVisibleSections = _this._getVisibleSectionCount();
                        _this._dataLoader = new ServiceDataLoader_1.ServiceDataLoader(searchAndFilterService, _this._dataReadPageSize, numOfVisibleSections, sectionIndex);
                        return _this._dataLoader.loadMoreItems(_this.section.context).then(function (data) {
                            delete _this.section.context.searchContext;
                            return data;
                        });
                    });
                });
            }
        }
        else if (this._definitionUsesStaticCells()) {
            this._staticCells = true;
            return this._createStaticCellsData();
        }
        else {
            return Promise.resolve(new observable_array_1.ObservableArray());
        }
    };
    BaseTableSectionObservable.prototype._performRedraw = function () {
        var currSearchString = this._searchString;
        return _super.prototype._performRedraw.call(this).then(function () {
            return currSearchString;
        });
    };
    BaseTableSectionObservable.prototype._getVisibleSectionCount = function () {
        var sectionsCount = 0;
        if (this.section && this.section.page) {
            var pageDef = this.section.page.definition;
            if (pageDef.getControls().length > 0) {
                var firstDefinitionControl = pageDef.getControls()[0];
                if (firstDefinitionControl.type === BaseControlDefinition_1.BaseControlDefinition.type.SectionedTable) {
                    sectionsCount = firstDefinitionControl.getVisibleSectionCount();
                }
            }
        }
        return sectionsCount;
    };
    BaseTableSectionObservable.prototype._getSectionIndex = function () {
        var sectionIndex;
        if (this.section) {
            var sectionDefinition = this.section.definition;
            sectionIndex = sectionDefinition.sectionIndex;
        }
        return sectionIndex;
    };
    BaseTableSectionObservable.prototype._onPressFunc = function (row, action) {
        var handler = this.buildBaseSectionEventHandler();
        row = this.adjustForHiddenRows(row);
        this._selectedItem = {
            row: row,
            selectedItem: this.getItem(row),
        };
        this.section.page.context.clientAPIProps.actionBinding = this._selectedItem.selectedItem;
        var onPress = this._getRowOnPressAction(row, action, handler.getEventSource());
        if (onPress) {
            return handler.executeActionOrRule(onPress, this.section.context).catch(function (error) {
                Logger_1.Logger.instance.ui.error(error + " " + error.stack);
            });
        }
        else {
            return Promise.resolve();
        }
    };
    BaseTableSectionObservable.prototype._onSwipeFunc = function (row) {
        var dataIndex = row.index;
        var actionName = row.actionName;
        if (dataIndex === undefined || actionName === undefined) {
            return;
        }
        this._selectedItem = {
            selectedItem: this.getItem(dataIndex),
            boundItem: this.getBoundData(dataIndex),
        };
        this.section.page.context.clientAPIProps.contextItem = new ContextItem_1.ContextItem(this._selectedItem);
        this.section.page.context.clientAPIProps.actionBinding = this._selectedItem.selectedItem;
        var onSwipeAction = this._getOnSwipeAction(dataIndex, actionName);
        if (onSwipeAction) {
            return new EventHandler_1.EventHandler().executeActionOrRule(onSwipeAction['OnSwipe'], this.section.context).catch(function (error) {
                Logger_1.Logger.instance.ui.error(error + " " + error.stack);
            });
        }
        else {
            return Promise.resolve();
        }
    };
    BaseTableSectionObservable.prototype._getOnSwipeAction = function (row, key) {
        var onSwipe;
        var cell = this.getBoundData(row);
        var items = cell.ContextMenu && cell.ContextMenu.Items;
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (item['_Name'] === key) {
                onSwipe = item;
                break;
            }
        }
        return onSwipe;
    };
    BaseTableSectionObservable.prototype._getLeftKey = function (row) {
        var cell = this.getBoundData(row);
        var leadingItems = cell && cell.ContextMenu && cell.ContextMenu.LeadingItems;
        return (leadingItems !== undefined && leadingItems instanceof Array) ? leadingItems : [];
    };
    BaseTableSectionObservable.prototype._getRightKey = function (row) {
        var cell = this.getBoundData(row);
        var trailingItems = cell && cell.ContextMenu && cell.ContextMenu.TrailingItems;
        return (trailingItems !== undefined && trailingItems instanceof Array) ? trailingItems : [];
    };
    BaseTableSectionObservable.prototype.onSelectionChanged = function (param) {
        if (param['row'] === undefined) {
            return;
        }
        var row = param['row'];
        var action = param['action'];
        var item = this.getBoundData(row);
        var selected;
        if (action == 'Select') {
            item['Checked'] = "YES";
            selected = true;
        }
        else {
            item['Checked'] = "NO";
            selected = false;
        }
        var handler = this.buildBaseSectionEventHandler();
        var onSelectionChanged = this.section.definition.onSelectionChanged;
        this._changedItem = new SelectedItem_1.ChangedItem(this.getItem(row), item, selected);
        this.section.page.context.clientAPIProps.actionBinding = this._changedItem.binding;
        if (onSelectionChanged) {
            return handler.executeActionOrRule(onSelectionChanged, this.section.context).catch(function (error) {
                Logger_1.Logger.instance.ui.error(error + " " + error.stack);
            });
        }
        else {
            return Promise.resolve();
        }
    };
    BaseTableSectionObservable.prototype.setSelectionMode = function (mode) {
        if (this._selectionMode !== mode) {
            this._selectionMode = mode;
            this._sectionParameters['selectionMode'] = mode;
        }
    };
    BaseTableSectionObservable.prototype.onSelectionModeChanged = function (param) {
        if (param['selectionMode']) {
            this._selectionMode = param['selectionMode'];
            this._sectionParameters['selectionMode'] = param['selectionMode'];
            if (this._selectionMode === 'None') {
                this._selectedRows = [];
                this._selectedItems = [];
                this._removeCheckedProperty();
            }
            var handler = this.buildBaseSectionEventHandler();
            var onSelectionModeChanged = this.section.definition.onSelectionModeChanged;
            if (onSelectionModeChanged) {
                return handler.executeActionOrRule(onSelectionModeChanged, this.section.context).catch(function (error) {
                    Logger_1.Logger.instance.ui.error(error + " " + error.stack);
                });
            }
            else {
                return Promise.resolve();
            }
        }
    };
    BaseTableSectionObservable.prototype.updateSectionSelectedRows = function (params) {
        if (params['selectedRows']) {
            this._selectedRows = params['selectedRows'];
            this.updateSelectedItems();
        }
    };
    BaseTableSectionObservable.prototype.updateSelectedItems = function () {
        var _this = this;
        var items = [];
        this._selectedRows.forEach(function (item) {
            var cell = _this.getBoundData(item);
            if (cell) {
                items.push(new SelectedItem_1.SelectedItem(_this.getItem(item), cell));
                cell['Checked'] = 'YES';
            }
        });
        this._selectedItems = items;
    };
    BaseTableSectionObservable.prototype._removeCheckedProperty = function () {
        var count = this._maxItemCount;
        var item;
        for (var i = 0; i < count; i++) {
            item = this.getBoundData(i);
            if (item) {
                delete item['Checked'];
            }
        }
    };
    BaseTableSectionObservable.prototype.getSelectionMode = function () {
        return this._selectionMode;
    };
    BaseTableSectionObservable.prototype.getSelectionChangedItem = function () {
        return this._changedItem;
    };
    BaseTableSectionObservable.prototype.getSelectedItems = function () {
        return this._selectedItems;
    };
    BaseTableSectionObservable.prototype._bindAdditionalCell = function (index) {
        var _this = this;
        if (this._definitionForRow(index) !== undefined && index < this._data.length) {
            this._bindRow(index, this.getItem(index), this._definitionForRow(index)).then(function (result) {
                _this._boundItems[index] = result;
                _this.reloadRow(index);
            });
        }
    };
    BaseTableSectionObservable.prototype._bindRow = function (row, bindingObject, definition) {
        bindingObject = this._getValidBindObject(bindingObject);
        return this._bindRowProperties(row, bindingObject, definition).then(function (item) {
            return item;
        });
    };
    Object.defineProperty(BaseTableSectionObservable.prototype, "_filtering", {
        get: function () {
            return (this._currentFilter !== '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseTableSectionObservable.prototype, "_retrieveSearchKeys", {
        get: function () {
            if (this._searchKeys.length === 0) {
                this._searchKeys = this._getSearchKeys();
            }
            return this._searchKeys;
        },
        enumerable: true,
        configurable: true
    });
    BaseTableSectionObservable.prototype._isFullPageList = function () {
        var definition = this.section.definition;
        return !definition.usesExtensionViews && !this._staticCells && !definition.usePreviewMode;
    };
    BaseTableSectionObservable.prototype._isItemBound = function (index) {
        return this._boundItems[index] !== undefined;
    };
    BaseTableSectionObservable.prototype._resetData = function () {
        this._loadMoreItemsFlag = false;
        this._data = new observable_array_1.ObservableArray();
        this._dataLoader = null;
        this._originalService = null;
    };
    Object.defineProperty(BaseTableSectionObservable.prototype, "originalService", {
        get: function () {
            if (!this._originalService) {
                var targetSpecifier = this.getRuntimeSpecifier(this.section.definition.data);
                this._originalService = EvaluateTarget_1.asService(targetSpecifier, this.section.context);
            }
            return this._originalService;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseTableSectionObservable.prototype, "_searching", {
        get: function () {
            return (this._searchString !== '');
        },
        enumerable: true,
        configurable: true
    });
    BaseTableSectionObservable.prototype._setMaxItems = function () {
        var definition = this.section.definition;
        if (definition.usePreviewMode) {
            this._maxItemCount = Math.min(this.sectionParameters[this._maxItemCountParamKey], this._data ? this._data.length : 0);
        }
        else {
            this._maxItemCount = this._data ? this._data.length : 0;
        }
    };
    BaseTableSectionObservable.prototype._newServiceWithSearchAndFilterQueryOptions = function (service) {
        var searchAndFilterService = Object.assign({}, service);
        var queryBuilder;
        if (!searchAndFilterService.queryBuilder) {
            queryBuilder = new DataQueryBuilder_1.DataQueryBuilder(this.section.context, searchAndFilterService.queryOptions);
            if (queryBuilder.hasOrderBy) {
                this._originalOrderBy = queryBuilder.orderByOption.join(',');
            }
            var filterTerm = undefined;
            if (this._filtering) {
                filterTerm = queryBuilder.filter(this._currentFilter);
            }
            if (this._sorting) {
                this._sorterMethod(queryBuilder);
            }
            if (this._searching) {
                filterTerm = filterTerm || queryBuilder.filterOption;
                if (!filterTerm) {
                    filterTerm = queryBuilder.filter(queryBuilder.mdkSearch(this._searchString));
                }
                else {
                    filterTerm.and(queryBuilder.mdkSearch(this._searchString));
                }
            }
        }
        else {
            queryBuilder = searchAndFilterService.queryBuilder;
            if (this._filtering && queryBuilder.hasFilter) {
                queryBuilder.filter().and(this._currentFilter);
            }
            else if (this._filtering) {
                queryBuilder.filter(this._currentFilter);
            }
            if (this._sorting) {
                this._sorterMethod(queryBuilder);
            }
        }
        return queryBuilder.build().then(function (builtQuery) {
            searchAndFilterService.queryOptions = builtQuery;
            return searchAndFilterService;
        });
    };
    Object.defineProperty(BaseTableSectionObservable.prototype, "_sorting", {
        get: function () {
            return (this._currentOrderBy !== '');
        },
        enumerable: true,
        configurable: true
    });
    BaseTableSectionObservable.prototype._sorterMethod = function (queryBuilder) {
        var sorterQueriesArr = this._currentOrderBy.split(',');
        for (var i = 0; i < sorterQueriesArr.length; i++) {
            sorterQueriesArr[i] = encodeURI(sorterQueriesArr[i].trim());
        }
        queryBuilder.orderBy.apply(queryBuilder, sorterQueriesArr);
    };
    BaseTableSectionObservable.prototype._getRowIndexByReadLink = function (readLink) {
        var index = -1;
        for (var i = 0; i < this._data.length; i++) {
            if (this._data.getItem(i)['@odata.readLink'] === readLink) {
                index = i;
                break;
            }
        }
        return index;
    };
    BaseTableSectionObservable.prototype._removeOptionsFromQuery = function (queryOptions, optionKeys) {
        if (!queryOptions) {
            return queryOptions;
        }
        var components = queryOptions.split('&');
        for (var _i = 0, optionKeys_1 = optionKeys; _i < optionKeys_1.length; _i++) {
            var key = optionKeys_1[_i];
            if (components.length > 0) {
                var startIndex = queryOptions.indexOf(key);
                if (startIndex !== -1) {
                    var i = 0;
                    for (i = 0; i < components.length; i++) {
                        if (components[i].startsWith(key)) {
                            break;
                        }
                    }
                    components.splice(i, 1);
                }
            }
            else {
                break;
            }
        }
        queryOptions = components.join('&');
        return queryOptions;
    };
    BaseTableSectionObservable.prototype._redrawRows = function () {
        var _this = this;
        var promiseArray = [];
        var _loop_1 = function (i) {
            var index_1 = this_1._getRowIndexByReadLink(this_1._readLinks[i]);
            if (index_1 !== -1 && this_1._dataLoader != null) {
                var service = Object.assign({}, this_1._dataLoader.service);
                service.entitySet = this_1._readLinks[i];
                if (service.queryOptions) {
                    var removedKeys = ['$filter=', '$orderby=', '$top=', '$skip='];
                    service.queryOptions = this_1._removeOptionsFromQuery(service.queryOptions, removedKeys);
                }
                promiseArray.push(DataHelper_1.DataHelper.readFromService(service).then(function (result) {
                    _this._data.splice(index_1, 1, result.getItem(0));
                    _this._bindRow(index_1, _this.getItem(index_1), _this._definitionForRow(index_1)).then(function (result) {
                        for (var key in result) {
                            if (_this._boundItems[index_1][key] !== result[key]) {
                                _this._boundItems[index_1][key] = result[key];
                            }
                        }
                        Logger_1.Logger.instance.ui.log("Update Row " + index_1);
                        _this.section.updateRow(index_1, result);
                    });
                }));
            }
        };
        var this_1 = this;
        for (var i = 0; i < this._readLinks.length; i++) {
            _loop_1(i);
        }
        return Promise.all(promiseArray).finally(function () {
            _this._readLinks = [];
        });
    };
    return BaseTableSectionObservable;
}(BaseCollectionSectionObservable_1.BaseCollectionSectionObservable));
exports.BaseTableSectionObservable = BaseTableSectionObservable;
