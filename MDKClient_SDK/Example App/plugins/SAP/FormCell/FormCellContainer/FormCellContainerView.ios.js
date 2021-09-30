"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataConverter_1 = require("../../Common/DataConverter");
var ErrorMessage_1 = require("../../ErrorHandling/ErrorMessage");
var view_1 = require("tns-core-modules/ui/core/view");
var ViewWrapper_1 = require("../../UI/ViewWrapper/ViewWrapper");
var FormCellInterop = (function (_super) {
    __extends(FormCellInterop, _super);
    function FormCellInterop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormCellInterop.initWithCallback = function (callback) {
        var cellinterop = FormCellInterop.new();
        cellinterop._callback = callback;
        return cellinterop;
    };
    FormCellInterop.prototype.loadMoreItems = function () {
        this._callback.loadMoreItems();
    };
    FormCellInterop.prototype.searchUpdated = function (searchText) {
        this._callback.searchUpdated(searchText);
    };
    FormCellInterop.prototype.valueChangedWithParams = function (data) {
        this._callback.cellValueChange(DataConverter_1.DataConverter.fromNSDictToMap(data));
    };
    Object.defineProperty(FormCellInterop.prototype, "callback", {
        set: function (callback) {
            this._callback = callback;
        },
        enumerable: true,
        configurable: true
    });
    FormCellInterop.prototype.getView = function () {
        return this._callback.control.getView ? this._callback.control.getView() : null;
    };
    FormCellInterop.prototype.onPress = function (cell, view) {
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
    FormCellInterop.ObjCExposedMethods = {
        loadMoreItems: { params: [interop.types.void], returns: interop.types.void },
        searchUpdated: { params: [NSString], returns: interop.types.void },
        valueChangedWithParams: { params: [NSDictionary], returns: interop.types.void },
        getView: { params: [interop.types.void], returns: NSObject },
        onPress: { params: [NSNumber, UIView], returns: interop.types.void }
    };
    return FormCellInterop;
}(NSObject));
exports.FormCellInterop = FormCellInterop;
var FormCellContainerView = (function (_super) {
    __extends(FormCellContainerView, _super);
    function FormCellContainerView(page, containerCallback, params) {
        var _this = _super.call(this) || this;
        _this._formcells = [];
        _this._inEmbeddedFrame = false;
        _this._page = page;
        _this._containerCallback = containerCallback;
        _this._params = params;
        _this.controllerinterop = FormCellContainerBridge.new();
        _this._controller = _this.controllerinterop.createWithParams(_this._params);
        return _this;
    }
    FormCellContainerView.prototype.addFormCell = function (formcell) {
        if (!formcell.model.data || !formcell.model.callback) {
            throw new Error(ErrorMessage_1.ErrorMessage.FORMCELL_CONTAINER_MANAGER_ADD_FORM_CELL_FAILED);
        }
        this._formcells.push(formcell);
    };
    FormCellContainerView.prototype.createNativeView = function () {
        var _this = this;
        this._controller.isInEmbeddedFrame = this._inEmbeddedFrame;
        this._page.ios.addChildViewController(this._controller);
        this._formcells.forEach(function (formcell) {
            formcell.model.interop = FormCellInterop.initWithCallback(formcell.model.callback);
            var model = formcell.model;
            _this.controllerinterop.populateControllerWithParamsAndBridge(_this._controller, model.data, model.interop);
        });
        return this._controller.view;
    };
    FormCellContainerView.prototype.disposeNativeView = function () {
        if (this._controller) {
            this._controller.removeFromParentViewController();
            this._controller = undefined;
        }
        this._page = undefined;
        if (this._formcells) {
            this._formcells.forEach(function (formcell) {
                formcell.model.interop = undefined;
            });
            this._formcells = undefined;
        }
        this.controllerinterop = undefined;
        this.nativeView.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    FormCellContainerView.prototype.initNativeView = function () {
        this.nativeView.owner = this;
        _super.prototype.initNativeView.call(this);
    };
    FormCellContainerView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._containerCallback.onLoaded();
    };
    FormCellContainerView.prototype.updateCell = function (params, row, section) {
        this.controllerinterop.updateCellWithParamsRowSection(this._controller, params, row, section);
    };
    FormCellContainerView.prototype.updateCells = function (params, style) {
        if (!params) {
            throw new Error(ErrorMessage_1.ErrorMessage.FORMCELL_CONTAINER_MANAGER_UPDATE_CELLS_INVALID_PARAMS);
        }
        this.controllerinterop.updateCellsWithParamsAndStyle(this._controller, params, style);
    };
    FormCellContainerView.prototype.setFocus = function (row, section, keyboardVisibility) {
        this.controllerinterop.setFocusWithRowAndSection(this._controller, row, section);
    };
    FormCellContainerView.prototype.hideLazyLoadingIndicator = function (row, section) {
        this.controllerinterop.hideLazyLoadingIndicatorWithRowAndSection(this._controller, row, section);
    };
    FormCellContainerView.prototype.setInEmbeddedFrame = function (embedded) {
        this._inEmbeddedFrame = embedded;
    };
    return FormCellContainerView;
}(view_1.View));
exports.FormCellContainerView = FormCellContainerView;
;
