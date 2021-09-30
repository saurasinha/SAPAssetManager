"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControl_1 = require("./BaseControl");
var mdk_sap_1 = require("mdk-sap");
var ToolBarCollapseActionViewEvent = (function () {
    function ToolBarCollapseActionViewEvent(container) {
        this.container = container;
    }
    ToolBarCollapseActionViewEvent.prototype.collapseToolBarActionView = function () {
        this.container.collapseToolBarActionView();
    };
    return ToolBarCollapseActionViewEvent;
}());
exports.ToolBarCollapseActionViewEvent = ToolBarCollapseActionViewEvent;
var ListPickerFragmentContainer = (function (_super) {
    __extends(ListPickerFragmentContainer, _super);
    function ListPickerFragmentContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._controls = [];
        return _this;
    }
    ListPickerFragmentContainer.prototype.bind = function () {
        var _this = this;
        return this._createListPickerFragmentContainerView().then(function (data) {
            _this.backPressedEvent = new ToolBarCollapseActionViewEvent(_this);
            return Promise.resolve();
        });
    };
    ListPickerFragmentContainer.prototype.getBackPressedEvent = function () {
        return this.backPressedEvent;
    };
    ListPickerFragmentContainer.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
    };
    ListPickerFragmentContainer.prototype.viewIsNative = function () {
        return true;
    };
    ListPickerFragmentContainer.prototype.setStyle = function (style) {
        this.sdkStyleClass = style;
    };
    Object.defineProperty(ListPickerFragmentContainer.prototype, "controls", {
        get: function () {
            return this._controls;
        },
        enumerable: true,
        configurable: true
    });
    ListPickerFragmentContainer.prototype.onNavigatedTo = function (initialLoading) {
        this.view().onFragmentContainerLoaded();
    };
    ListPickerFragmentContainer.prototype.onNavigatingFrom = function () {
        this.view().onNavigatingBack();
    };
    ListPickerFragmentContainer.prototype.collapseToolBarActionView = function () {
        this.view().collapseToolBarActionView();
    };
    ListPickerFragmentContainer.prototype._createListPickerFragmentContainerView = function () {
        var _this = this;
        return this.formcellData.then(function (data) {
            var view = new mdk_sap_1.ListPickerFragmentContainerView(_this.page(), data);
            _this.setView(view);
        });
    };
    Object.defineProperty(ListPickerFragmentContainer.prototype, "formcellData", {
        get: function () {
            return Promise.resolve({
                model: this.definition().data.Model,
            });
        },
        enumerable: true,
        configurable: true
    });
    return ListPickerFragmentContainer;
}(BaseControl_1.BaseControl));
exports.ListPickerFragmentContainer = ListPickerFragmentContainer;
