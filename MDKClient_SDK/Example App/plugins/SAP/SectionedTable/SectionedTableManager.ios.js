"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trace_1 = require("tns-core-modules/trace");
var view_1 = require("tns-core-modules/ui/core/view");
var DataConverter_1 = require("../Common/DataConverter");
var ViewWrapper_1 = require("../UI/ViewWrapper/ViewWrapper");
var SectionCallback = (function (_super) {
    __extends(SectionCallback, _super);
    function SectionCallback() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SectionCallback.initWithCallback = function (callback) {
        var bridgeCallback = SectionCallback.new();
        bridgeCallback._callback = callback;
        return bridgeCallback;
    };
    SectionCallback.prototype.footerTapped = function () {
        this._callback.footerTapped();
    };
    SectionCallback.prototype.getView = function (row) {
        return this._callback.getView(row);
    };
    SectionCallback.prototype.getBoundData = function (index) {
        return this._callback.getBoundData(index);
    };
    SectionCallback.prototype.loadMoreItems = function () {
        this._callback.loadMoreItems();
    };
    SectionCallback.prototype.onPress = function (cell, view) {
        this._callback.onPress(cell, DataConverter_1.DataConverter.toViewFacade(view));
    };
    SectionCallback.prototype.onAccessoryButtonPress = function (cell, view) {
        this._callback.onAccessoryButtonPress(cell, DataConverter_1.DataConverter.toViewFacade(view));
    };
    SectionCallback.prototype.onAnalyticViewPress = function () {
        this._callback.onAnalyticViewPress();
    };
    SectionCallback.prototype.onItemPress = function (item) {
        this._callback.onItemPress(item);
    };
    SectionCallback.prototype.searchUpdated = function (searchText) {
        this._callback.searchUpdated(searchText);
    };
    SectionCallback.prototype.viewDidAppear = function () {
        this._callback.viewDidAppear();
    };
    SectionCallback.prototype.setHeaderHeight = function (height) {
        this._callback.setHeaderHeight(height);
    };
    SectionCallback.prototype.onSwipe = function (cell) {
        this._callback.onSwipe(DataConverter_1.DataConverter.fromNSDictToJavascriptObject(cell));
    };
    SectionCallback.prototype.updateSectionSelectedRows = function (params) {
        var jsparams = DataConverter_1.DataConverter.fromNSDictWithNSArrayToJavascriptObject(params);
        this._callback.updateSectionSelectedRows(jsparams);
    };
    SectionCallback.prototype.onSelectionChanged = function (params) {
        this._callback.onSelectionChanged(DataConverter_1.DataConverter.fromNSDictToJavascriptObject(params));
    };
    SectionCallback.prototype.onSelectionModeChanged = function (params) {
        this._callback.onSelectionModeChanged(DataConverter_1.DataConverter.fromNSDictToJavascriptObject(params));
    };
    SectionCallback.ObjCExposedMethods = {
        footerTapped: { params: [interop.types.void], returns: interop.types.void },
        getBoundData: { params: [NSNumber], returns: NSString },
        getView: { params: [NSNumber], returns: UIView },
        loadMoreItems: { params: [interop.types.void], returns: interop.types.void },
        onPress: { params: [NSNumber, UIView], returns: interop.types.void },
        onAccessoryButtonPress: { params: [NSNumber, UIView], returns: interop.types.void },
        onAnalyticViewPress: { params: [interop.types.void], returns: interop.types.void },
        onItemPress: { params: [NSNumber], returns: interop.types.void },
        searchUpdated: { params: [NSString], returns: interop.types.void },
        viewDidAppear: { params: [interop.types.void], returns: interop.types.void },
        setHeaderHeight: { params: [NSNumber], returns: interop.types.void },
        onSwipe: { params: [NSDictionary], returns: interop.types.void },
        updateSectionSelectedRows: { params: [NSDictionary], returns: interop.types.void },
        onSelectionChanged: { params: [NSDictionary], returns: interop.types.void },
        onSelectionModeChanged: { params: [NSDictionary], returns: interop.types.void },
    };
    return SectionCallback;
}(NSObject));
var SectionFormCellInterop = (function (_super) {
    __extends(SectionFormCellInterop, _super);
    function SectionFormCellInterop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SectionFormCellInterop.initWithCallback = function (callback) {
        var cellinterop = SectionFormCellInterop.new();
        cellinterop._callback = callback;
        return cellinterop;
    };
    SectionFormCellInterop.prototype.loadMoreItems = function () {
        this._callback.loadMoreItems();
    };
    SectionFormCellInterop.prototype.searchUpdated = function (searchText) {
        this._callback.searchUpdated(searchText);
    };
    SectionFormCellInterop.prototype.valueChangedWithParams = function (data) {
        this._callback.cellValueChange(DataConverter_1.DataConverter.fromNSDictToMap(data));
    };
    Object.defineProperty(SectionFormCellInterop.prototype, "callback", {
        set: function (callback) {
            this._callback = callback;
        },
        enumerable: true,
        configurable: true
    });
    SectionFormCellInterop.prototype.getView = function () {
        return this._callback.control.getView ? this._callback.control.getView() : null;
    };
    SectionFormCellInterop.prototype.onPress = function (cell, view) {
        var viewWrapper = new ViewWrapper_1.ViewWrapper();
        viewWrapper.setView(view);
        if (this._callback.control.constructor.name === 'ListPickerFormCell') {
            this._callback.control.page().isExternalNavigating = true;
            this._callback.loadMoreItems(true);
        }
        else if (this._callback.control.onPress) {
            this._callback.control.onPress(cell, DataConverter_1.DataConverter.toViewFacade(viewWrapper));
        }
    };
    SectionFormCellInterop.ObjCExposedMethods = {
        loadMoreItems: { params: [interop.types.void], returns: interop.types.void },
        searchUpdated: { params: [NSString], returns: interop.types.void },
        valueChangedWithParams: { params: [NSDictionary], returns: interop.types.void },
        getView: { params: [interop.types.void], returns: NSObject },
        onPress: { params: [NSNumber, UIView], returns: interop.types.void }
    };
    return SectionFormCellInterop;
}(NSObject));
var Section = (function () {
    function Section() {
    }
    Section.prototype.create = function (params, callback) {
        this.myCallback = SectionCallback.initWithCallback(callback);
        this.sectionBridge = SectionBridge.new();
        return this.sectionBridge.createCallback(params, this.myCallback);
    };
    Section.prototype.createButtonSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createContactTableSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createExtensionSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createGridTableSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createKeyValueSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createObjectCollectionSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createObjectHeaderSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createAnalyticCardCollectionSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createChartContentSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createProfileHeaderSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createKPIHeaderSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createKPISection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createObjectTableSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createSimplePropertySection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createImageCollectionSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.createFormCellSection = function (params, callback) {
        return this.create(params, callback);
    };
    Section.prototype.setFormCellSectionItems = function (cellItems) {
        var _this = this;
        cellItems.forEach(function (cell) {
            cell.model.interop = SectionFormCellInterop.initWithCallback(cell.model.callback);
            var model = cell.model;
            _this.sectionBridge.setFormCellSectionItemCallback(model.data, model.interop);
        });
    };
    Section.prototype.updateCell = function (params, row) {
        this.sectionBridge.updateCellRow(params, row);
    };
    Section.prototype.updateCells = function (params) {
        this.sectionBridge.updateCells(params);
    };
    Section.prototype.redraw = function (data) {
        this.sectionBridge.redraw(data);
    };
    Section.prototype.reloadData = function (itemCount) {
        this.sectionBridge.reloadData(itemCount);
    };
    Section.prototype.hideLazyLoadingIndicator = function (row) {
        this.sectionBridge.hideLazyLoadingIndicator(row);
    };
    Section.prototype.reloadRow = function (index) {
        this.sectionBridge.reloadRow(index);
    };
    Section.prototype.updateRow = function (index, data) {
        this.sectionBridge.updateRowData(index, data);
    };
    Section.prototype.setIndicatorState = function (params) {
        return this.sectionBridge.setIndicatorState({
            cell: params.pressedItem.getControlView().ios,
            row: params.row,
            state: params.state,
        });
    };
    Section.prototype.setSelectionMode = function (params) {
        return this.sectionBridge.setSelectionMode({
            selectionMode: params.selectionMode
        });
    };
    Section.prototype.refreshIndicators = function () {
        this.sectionBridge.refreshIndicators();
    };
    Section.prototype.redrawLayout = function () {
    };
    Section.prototype.updateProgressBar = function (visible) {
    };
    Section.prototype.destroy = function () {
        this.myCallback = undefined;
        this.sectionBridge = undefined;
    };
    Section.prototype.setFocus = function (sectionedTable, row, keyboardVisibility) {
        this.sectionBridge.setFocus(row);
    };
    return Section;
}());
exports.Section = Section;
;
var SectionedTable = (function (_super) {
    __extends(SectionedTable, _super);
    function SectionedTable(page, containerCallback) {
        var _this = _super.call(this) || this;
        _this._sections = [];
        _this._inEmbeddedFrame = false;
        _this._page = page;
        _this._containerCallback = containerCallback;
        return _this;
    }
    SectionedTable.prototype.createNativeView = function () {
        try {
            var nativeSections = this._sections.filter(function (section) { return section.visible === true; })
                .map(function (section) { return section.nativeSection; });
            this._controller = this.sectionedTableBridge.create(nativeSections);
            this._page.ios.addChildViewController(this._controller);
            this._controller.isInEmbeddedFrame = this._inEmbeddedFrame;
            return this._controller.view;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    SectionedTable.prototype.initNativeView = function () {
        this.nativeView.owner = this;
        _super.prototype.initNativeView.call(this);
    };
    SectionedTable.prototype.disposeNativeView = function () {
        if (this._controller) {
            this._controller.removeFromParentViewController();
            this._controller = undefined;
        }
        this._page = undefined;
        if (this._sections) {
            this._sections.forEach(function (section) {
                section.disposeNativeSection();
            });
            this._sections = undefined;
        }
        this.sectionedTableBridge = undefined;
        this.nativeView.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    SectionedTable.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._containerCallback.onLoaded();
    };
    SectionedTable.prototype.create = function (sections) {
        this.sectionedTableBridge = SectionedTableBridge.new();
        this._sections = sections;
        return this;
    };
    SectionedTable.prototype.redraw = function () {
        var nativeSections = this._sections.filter(function (section) { return section.visible === true; })
            .map(function (section) { return section.nativeSection; });
        this._controller.redraw(nativeSections);
    };
    SectionedTable.prototype.setSearchString = function (searchString) {
        return this._controller.setSearchString(searchString);
    };
    SectionedTable.prototype.setFocus = function (nativeSection, row, keyboardVisibility) {
    };
    SectionedTable.prototype.setInEmbeddedFrame = function (embedded) {
        this._inEmbeddedFrame = embedded;
    };
    return SectionedTable;
}(view_1.View));
exports.SectionedTable = SectionedTable;
;
