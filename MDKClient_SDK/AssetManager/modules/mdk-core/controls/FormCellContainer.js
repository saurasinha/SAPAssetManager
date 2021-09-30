"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mdk_sap_1 = require("mdk-sap");
var ControlFactorySync_1 = require("./ControlFactorySync");
var ClientSettings_1 = require("../storage/ClientSettings");
var ValueResolver_1 = require("../utils/ValueResolver");
var app = require("tns-core-modules/application");
var ListPickerFormCell_1 = require("./formCell/ListPickerFormCell");
var BaseContainer_1 = require("./BaseContainer");
var FlexibleColumnFrame_1 = require("../pages/FlexibleColumnFrame");
var FormCellContainer = (function (_super) {
    __extends(FormCellContainer, _super);
    function FormCellContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._controls = [];
        _this._triggerListPickerOnValueChangeEvent = false;
        return _this;
    }
    FormCellContainer.prototype.bind = function () {
        var _this = this;
        this._resolveLoadingIndicator().then(function (value) {
            if (value != null) {
                _this._setLoadingIndicatorData(value);
            }
        });
        return this._createFormCellContainerView().then(function (data) {
            _this.allControlsAreBuilt = _this._buildCells();
            return _this.allControlsAreBuilt;
        }).finally(function () {
            _this._dismissLoadingIndicator();
        });
    };
    FormCellContainer.prototype.initialize = function (controlData) {
        this._triggerListPickerOnValueChangeEvent = true;
        _super.prototype.initialize.call(this, controlData);
    };
    FormCellContainer.prototype.viewIsNative = function () {
        return true;
    };
    FormCellContainer.prototype.setStyle = function (style) {
        this.sdkStyleClass = style;
    };
    FormCellContainer.prototype.redraw = function (builtData, cell) {
        var _this = this;
        if (builtData === void 0) { builtData = undefined; }
        this._showLoadingIndicator();
        if (builtData) {
            this.view().updateCells(builtData, this.sdkStyleClass);
            this._dismissLoadingIndicator();
        }
        else {
            return this.allControlsAreBuilt.then(function () {
                return Promise.all(_this.controls.map(function (control) {
                    if (cell) {
                        if (cell.definition().getName() === control.definition().getName()) {
                            return control.updateFormCellModel();
                        }
                    }
                    else {
                        return control.updateFormCellModel();
                    }
                })).then(function (newBuiltData) {
                    _this.view().updateCells(newBuiltData, _this.sdkStyleClass);
                }).finally(function () {
                    _this._dismissLoadingIndicator();
                });
            });
        }
    };
    Object.defineProperty(FormCellContainer.prototype, "controls", {
        get: function () {
            return this._controls;
        },
        enumerable: true,
        configurable: true
    });
    FormCellContainer.prototype.updateCell = function (control) {
        var _this = this;
        var indexPath = this.definition().indexPath(control.definition().getName());
        if (this._isValidIndexPath(indexPath)) {
            if (app.android) {
                control.updateFormCellModel();
            }
            else {
                control.build().then(function (data) {
                    _this.view().updateCell(data, indexPath.row, indexPath.section);
                });
            }
        }
    };
    FormCellContainer.prototype.setFocus = function (control, keyboardVisibility) {
        var indexPath = this.definition().indexPath(control.definition().getName());
        if (this._isValidIndexPath(indexPath)) {
            this.view().setFocus(indexPath.row, indexPath.section, keyboardVisibility);
        }
    };
    FormCellContainer.prototype.hideLazyLoadingIndicator = function (control) {
        var indexPath = this.definition().indexPath(control.definition().getName());
        if (this._isValidIndexPath(indexPath)) {
            if (app.android) {
                control.hideLazyLoadingIndicator();
            }
            else {
                this.view().hideLazyLoadingIndicator(indexPath.row, indexPath.section);
            }
        }
    };
    FormCellContainer.prototype.updateCellByProperties = function (control, data) {
        var indexPath = this.definition().indexPath(control.definition().getName());
        if (this._isValidIndexPath(indexPath)) {
            if (app.ios) {
                this.view().updateCell(data, indexPath.row, indexPath.section);
            }
            else {
                control.redraw();
            }
        }
    };
    FormCellContainer.prototype._triggerOnValueChangeEventForOneItemSelected = function () {
        for (var _i = 0, _a = this.controls; _i < _a.length; _i++) {
            var formcell = _a[_i];
            if (formcell instanceof ListPickerFormCell_1.ListPickerFormCell) {
                formcell.triggerOnValueChangeEventForOneItemSelected();
            }
        }
    };
    FormCellContainer.prototype.onLoaded = function () {
        var _this = this;
        var formcellOnLoadedPromises = [];
        for (var _i = 0, _a = this.controls; _i < _a.length; _i++) {
            var formcell = _a[_i];
            var promise = formcell.onLoaded();
            formcellOnLoadedPromises.push(promise);
        }
        Promise.all(formcellOnLoadedPromises).then(function (onLoadedResults) {
            var redrawNeeded = false;
            for (var _i = 0, onLoadedResults_1 = onLoadedResults; _i < onLoadedResults_1.length; _i++) {
                var onLoadedResult = onLoadedResults_1[_i];
                if (onLoadedResult) {
                    redrawNeeded = true;
                    break;
                }
            }
            if (redrawNeeded) {
                _this.redraw();
            }
            if (_this._triggerListPickerOnValueChangeEvent) {
                _this._triggerOnValueChangeEventForOneItemSelected();
                _this._triggerListPickerOnValueChangeEvent = false;
            }
        });
        this.page().runOnLoadedEvent();
    };
    FormCellContainer.prototype._resolveLoadingIndicator = function () {
        var loadingIndicator = this.definition().getLoadingIndicator();
        if (loadingIndicator != null) {
            return ValueResolver_1.ValueResolver.resolveValue(loadingIndicator, this.context);
        }
        else {
            return Promise.resolve(null);
        }
    };
    FormCellContainer.prototype._buildCells = function () {
        var _this = this;
        return Promise.all(this.controls.map(function (control) {
            control.parent = _this;
            return control.build().then(function () {
                return control.bind();
            });
        })).then(function () {
            return Promise.all(_this.controls.map(function (control) {
                return control.createFormCellModel(control.builder.builtData).then(function (mdkFormCell) {
                    _this.view().addFormCell(mdkFormCell);
                    return control.builder.builtData;
                });
            }));
        });
    };
    FormCellContainer.prototype._createFormCellContainerView = function () {
        var _this = this;
        return this.formcellData.then(function (data) {
            var page = _this.page();
            var view = new mdk_sap_1.FormCellContainerView(page, _this, data);
            var inEmbeddedFrame = false;
            if ((page.targetFrameId && page.targetFrameId.indexOf(FlexibleColumnFrame_1.FlexibleColumnFrame.COLUMN_TAG) !== -1) ||
                (page.isTabsTabPage && page.actionBarHidden)) {
                inEmbeddedFrame = true;
            }
            view.setInEmbeddedFrame(inEmbeddedFrame);
            _this.setView(view);
            _this._createCells();
        });
    };
    FormCellContainer.prototype._createCells = function () {
        var _this = this;
        this._controls = this.definition().getVisibleControlDefs().map(function (definition) {
            return ControlFactorySync_1.ControlFactorySync.Create(_this.page(), _this.context, null, definition);
        });
    };
    FormCellContainer.prototype._isValidIndexPath = function (indexPath) {
        return indexPath.row !== -1 && indexPath.section !== -1;
    };
    FormCellContainer.prototype._resolveSectionsInfo = function () {
        return ValueResolver_1.ValueResolver.resolveArrayOfKeyValues(this.definition().
            getSectionsInformation(), this.context).then(function (resolvedSecionInfo) {
            return resolvedSecionInfo;
        });
    };
    Object.defineProperty(FormCellContainer.prototype, "formcellData", {
        get: function () {
            var _this = this;
            var isInPopover = this._props.page.isPopover ? this._props.page.isPopover : false;
            var visibleSectionNames = [];
            var rowsInSection = [];
            var visibleSectionsIndex = [];
            return this._resolveSectionsInfo().then(function (resolvedSecionsInfo) {
                var index = 0;
                var visible;
                for (var _i = 0, resolvedSecionsInfo_1 = resolvedSecionsInfo; _i < resolvedSecionsInfo_1.length; _i++) {
                    var sectionInfo = resolvedSecionsInfo_1[_i];
                    visible = JSON.parse(sectionInfo.Visible);
                    visibleSectionsIndex.push(visible);
                    if (visible) {
                        visibleSectionNames.push(sectionInfo.Caption);
                        rowsInSection.push(sectionInfo.NumberOfRows);
                    }
                    index++;
                }
                _this.definition().visibleSectionsIndex = visibleSectionsIndex;
                return {
                    isInPopover: isInPopover,
                    locale: ClientSettings_1.ClientSettings.getAppLocale(),
                    numberOfRowsInSection: rowsInSection,
                    numberOfSections: visibleSectionNames.length,
                    sectionNames: visibleSectionNames,
                };
            });
        },
        enumerable: true,
        configurable: true
    });
    return FormCellContainer;
}(BaseContainer_1.BaseContainer));
exports.FormCellContainer = FormCellContainer;
