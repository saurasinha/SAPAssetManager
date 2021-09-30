"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSection_1 = require("./BaseSection");
var PressedItem_1 = require("../controls/PressedItem");
var BaseTableSection = (function (_super) {
    __extends(BaseTableSection, _super);
    function BaseTableSection(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(BaseTableSection.prototype, "searchString", {
        get: function () {
            return this.observable().searchString;
        },
        enumerable: true,
        configurable: true
    });
    BaseTableSection.prototype.filterUpdated = function (filter) {
        return this.observable().filterUpdated(filter);
    };
    BaseTableSection.prototype.getOrderBy = function () {
        return this.observable().getOrderBy();
    };
    BaseTableSection.prototype.getBoundData = function (row) {
        return this.observable().getBoundData(row);
    };
    BaseTableSection.prototype.isDataBounded = function (row) {
        return this.observable().isDataBounded(row);
    };
    BaseTableSection.prototype.onPageUnloaded = function (pageExists) {
        this.observable().onPageUnloaded(pageExists);
    };
    BaseTableSection.prototype.loadMoreItems = function () {
        return this.observable().loadMoreItems();
    };
    BaseTableSection.prototype.onPress = function (cell, viewFacade) {
        this._onPress(cell, viewFacade, 'OnPress');
    };
    BaseTableSection.prototype.onAccessoryButtonPress = function (cell, viewFacade) {
        this._onPress(cell, viewFacade, 'OnAccessoryButtonPress');
    };
    BaseTableSection.prototype.getLeftKey = function (row) {
        return this._getLeftKey(row);
    };
    BaseTableSection.prototype.getRightKey = function (row) {
        return this._getRightKey(row);
    };
    BaseTableSection.prototype.onSwipe = function (cell) {
        this._onSwipe(cell);
    };
    BaseTableSection.prototype.onSelectionChanged = function (param) {
        this._onSelectionChanged(param);
    };
    BaseTableSection.prototype.onSelectionModeChanged = function (param) {
        this._onSelectionModeChanged(param);
    };
    BaseTableSection.prototype.updateSectionSelectedRows = function (params) {
        this._updateSectionSelectedRows(params);
    };
    BaseTableSection.prototype.setIndicatorState = function (newState, pressedItem) {
        var params = {
            pressedItem: pressedItem,
            row: this.observable().selectedItem.row,
            state: newState,
        };
        this._sectionBridge.setIndicatorState(params);
    };
    BaseTableSection.prototype.setSelectionMode = function (mode) {
        var params = {
            selectionMode: mode
        };
        this._sectionBridge.setSelectionMode(params);
        this.observable().setSelectionMode(mode);
    };
    BaseTableSection.prototype.getSelectionMode = function () {
        return this.observable().getSelectionMode();
    };
    BaseTableSection.prototype.getSelectionChangedItem = function () {
        return this.observable().getSelectionChangedItem();
    };
    BaseTableSection.prototype.getSelectedItems = function () {
        return this.observable().getSelectedItems();
    };
    BaseTableSection.prototype.onPageLoaded = function (initialLoading) {
        if (!initialLoading && this._sectionBridge) {
            this._sectionBridge.refreshIndicators();
            this._sectionBridge.redrawLayout();
        }
    };
    BaseTableSection.prototype.searchUpdated = function (searchText) {
        return this.observable().searchUpdated(searchText);
    };
    BaseTableSection.prototype.viewDidAppear = function () {
        var currentBounds = this.page._getCurrentLayoutBounds();
        if (currentBounds.top === 0) {
            this.page.onLayout(currentBounds.left, currentBounds.top, currentBounds.right, currentBounds.bottom);
        }
    };
    BaseTableSection.prototype._onPress = function (cell, viewFacade, action) {
        this.page.context.clientAPIProps.pressedItem = PressedItem_1.PressedItem.WithControlView(viewFacade);
        if (this.page.searchField) {
            this.page.searchField.dismissSoftInput();
        }
        return this.observable().onPress(cell, action);
    };
    BaseTableSection.prototype.hideLazyLoadingIndicator = function () {
        this._sectionBridge.hideLazyLoadingIndicator();
    };
    BaseTableSection.prototype._onSwipe = function (cell) {
        return this.observable().onSwipe(cell);
    };
    BaseTableSection.prototype._getLeftKey = function (cell) {
        return this.observable().getLeftKey(cell);
    };
    BaseTableSection.prototype._getRightKey = function (cell) {
        return this.observable().getRightKey(cell);
    };
    BaseTableSection.prototype._onSelectionChanged = function (param) {
        return this.observable().onSelectionChanged(param);
    };
    BaseTableSection.prototype._onSelectionModeChanged = function (param) {
        return this.observable().onSelectionModeChanged(param);
    };
    BaseTableSection.prototype._updateSectionSelectedRows = function (params) {
        return this.observable().updateSectionSelectedRows(params);
    };
    return BaseTableSection;
}(BaseSection_1.BaseSection));
exports.BaseTableSection = BaseTableSection;
;
