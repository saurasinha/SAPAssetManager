"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trace_1 = require("tns-core-modules/trace");
var view_1 = require("tns-core-modules/ui/core/view");
var DataConverter_1 = require("../Common/DataConverter");
var Util_1 = require("../Common/Util");
var Section = (function () {
    function Section() {
    }
    Section.prototype.bridge = function () {
        return this._sectionBridge;
    };
    Section.prototype.createCallback = function (callback) {
        return new com.sap.mdk.client.ui.fiori.sections.ISectionCallback({
            footerPressed: function () {
                callback.footerTapped();
            },
            getBoundData: function (row) {
                return DataConverter_1.DataConverter.toJavaObject(callback.getBoundData(row));
            },
            getView: function (row) {
                if (row < 0) {
                    return callback.getView();
                }
                else {
                    return callback.getView(row);
                }
            },
            isDataBounded: function (row) {
                return callback.isDataBounded(row);
            },
            loadMoreItems: function () {
                callback.loadMoreItems();
            },
            onAccessoryPress: function (row, view) {
                callback.onAccessoryButtonPress(row, DataConverter_1.DataConverter.toViewFacade(view));
            },
            onPress: function (row, view) {
                callback.onPress(row, DataConverter_1.DataConverter.toViewFacade(view));
            },
            onAnalyticViewPress: function () {
                callback.onAnalyticViewPress();
            },
            onItemPress: function (item) {
                callback.onItemPress(item);
            },
            searchUpdated: function (searchText) {
                callback.searchUpdated(searchText);
            },
            updateActionBarElevation: function (on) {
                callback.updateActionBarElevation(on);
            },
            onSwipe: function (cell) {
                callback.onSwipe(DataConverter_1.DataConverter.toJavaScriptObject(cell));
            },
            getLeftKey: function (row) {
                var leftKeys = callback.getLeftKey(row);
                var stringArr = Array.create(java.lang.String, leftKeys.length);
                for (var i = 0; i < leftKeys.length; i++) {
                    stringArr[i] = leftKeys[i];
                }
                return stringArr;
            },
            getRightKey: function (row) {
                var rightKeys = callback.getRightKey(row);
                var stringArr = Array.create(java.lang.String, rightKeys.length);
                for (var i = 0; i < rightKeys.length; i++) {
                    stringArr[i] = rightKeys[i];
                }
                return stringArr;
            },
            onSelectionChanged: function (param) {
                callback.onSelectionChanged(DataConverter_1.DataConverter.javaJsonObjectToJavascriptObject(param));
            },
            updateSectionSelectedRows: function (params) {
                callback.updateSectionSelectedRows(DataConverter_1.DataConverter.javaJsonObjectToJavascriptObject(params));
            },
            onSelectionModeChanged: function (params) {
                callback.onSelectionModeChanged(DataConverter_1.DataConverter.javaJsonObjectToJavascriptObject(params));
            }
        });
    };
    Section.prototype.create = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.BaseModel();
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createButtonSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ButtonSectionModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createContactTableSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ContactTableModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createExtensionSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ExtensionSectionModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createGridTableSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.GridTableModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createKeyValueSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.KeyValueModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createObjectCollectionSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ObjectCollectionModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createAnalyticCardCollectionSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.AnalyticCardCollectionModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createChartContentSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ChartContentSectionModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createObjectHeaderSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ObjectHeaderModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createImageCollectionSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ImageCollectionModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createProfileHeaderSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ProfileHeaderModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createObjectTableSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ObjectTableModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createSimplePropertySection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.SimplePropertySectionModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createKPIHeaderSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.KPIHeaderModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createKPISection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.KPISectionModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.createFormCellSection = function (params, callback) {
        try {
            this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.FormCellSectionModel(DataConverter_1.DataConverter.toJavaObject(params), this.createCallback(callback));
            return this._sectionBridge;
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    Section.prototype.setFormCellSectionItems = function (cellItems) {
        var _this = this;
        cellItems.forEach(function (cell) {
            _this._sectionBridge.setFormCellSectionItem(cell.model);
        });
    };
    Section.prototype.updateCell = function (params, row) {
    };
    Section.prototype.updateCells = function (params) {
        this._sectionBridge.updateFormCells();
    };
    Section.prototype.redraw = function (data) {
        this._sectionBridge.redraw(DataConverter_1.DataConverter.toJavaObject(data));
    };
    Section.prototype.reloadData = function (itemCount) {
        this._sectionBridge.reloadData(itemCount);
    };
    Section.prototype.reloadRow = function (index) {
        this._sectionBridge.reloadRow(index);
    };
    Section.prototype.updateRow = function (index, data) {
        this._sectionBridge.updateRow(index, DataConverter_1.DataConverter.toJavaObject(data));
    };
    Section.prototype.setIndicatorState = function (params) {
        this._sectionBridge.setIndicatorState(DataConverter_1.DataConverter.toJavaObject(params));
    };
    Section.prototype.refreshIndicators = function () {
        this._sectionBridge.refreshIndicators();
    };
    Section.prototype.redrawLayout = function () {
        this._sectionBridge.redrawLayout();
    };
    Section.prototype.updateProgressBar = function (visible) {
        this._sectionBridge.updateProgressBar(visible);
    };
    Section.prototype.destroy = function () {
        this._sectionBridge.destroy();
        this._sectionBridge = undefined;
    };
    Section.prototype.setFocus = function (sectionedTable, row, keyboardVisibility) {
        if (typeof (this._sectionBridge.setFocus) !== undefined) {
            sectionedTable.setFocus(this._sectionBridge, row, keyboardVisibility);
        }
    };
    Section.prototype.hideLazyLoadingIndicator = function () {
        this._sectionBridge.hideLazyLoadingIndicator();
    };
    Section.prototype.setSelectionMode = function (params) {
        return this._sectionBridge.setSelectionMode(params.selectionMode);
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
        _this._sectionedTableBridge = new com.sap.mdk.client.ui.fiori.sections.views.SectionedTable();
        _this._containerCallback = containerCallback;
        return _this;
    }
    SectionedTable.prototype.createNativeView = function () {
        try {
            var nativeSections = this._sections.filter(function (section) { return section.visible === true; })
                .map(function (section) { return section.nativeSection; });
            return this._sectionedTableBridge.create(nativeSections, this._context, this.parent.android);
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
        if (this._sections) {
            this._sections.forEach(function (section) {
                section.disposeNativeSection();
            });
            this._sections = undefined;
        }
        this._sectionedTableBridge = undefined;
        if (this.nativeView) {
            this.nativeView.owner = null;
        }
        _super.prototype.disposeNativeView.call(this);
    };
    SectionedTable.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._containerCallback.onLoaded();
    };
    SectionedTable.prototype.create = function (sections) {
        this._sections = sections;
        return this;
    };
    SectionedTable.prototype.destroy = function () {
    };
    SectionedTable.prototype.redraw = function () {
        var nativeSections = this._sections.filter(function (section) { return section.visible === true; })
            .map(function (section) { return section.nativeSection; });
        this._sectionedTableBridge.redraw(nativeSections, this._context, this.parent.android);
    };
    SectionedTable.prototype.setFocus = function (nativeSection, row, keyboardVisibility) {
        this._sectionedTableBridge.setFocus(nativeSection, row, Util_1.Util.toSoftKeyboardType(keyboardVisibility));
    };
    SectionedTable.prototype.setInEmbeddedFrame = function (embedded) {
    };
    return SectionedTable;
}(view_1.View));
exports.SectionedTable = SectionedTable;
;
