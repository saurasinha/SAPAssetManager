"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseTableSection_1 = require("./BaseTableSection");
var FormCellSectionObservable_1 = require("../observables/sections/FormCellSectionObservable");
var ControlFactorySync_1 = require("../controls/ControlFactorySync");
var app = require("tns-core-modules/application");
var FormCellSection = (function (_super) {
    __extends(FormCellSection, _super);
    function FormCellSection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._controls = [];
        _this._models = [];
        return _this;
    }
    Object.defineProperty(FormCellSection.prototype, "controls", {
        get: function () {
            return this._controls;
        },
        enumerable: true,
        configurable: true
    });
    FormCellSection.prototype._createObservable = function () {
        return new FormCellSectionObservable_1.FormCellSectionObservable(this);
    };
    FormCellSection.prototype.initialize = function () {
        var _this = this;
        this._createCells();
        return this._buildCells().then(function (mdkFormCellModels) {
            _this._models = mdkFormCellModels;
            return _super.prototype.initialize.call(_this).then(function (section) {
                _this._sectionBridge.setFormCellSectionItems(_this._models);
                return section;
            });
        });
    };
    FormCellSection.prototype.redraw = function (data) {
        var _this = this;
        if (data != null) {
            return _super.prototype.redraw.call(this, data);
        }
        else {
            return this._buildCells().then(function () {
                return Promise.all(_this.controls.map(function (control) {
                    return control.updateFormCellModel();
                })).then(function (newBuiltData) {
                    _this._sectionBridge.updateCells(newBuiltData);
                    _this.observable().redraw();
                });
            });
        }
    };
    FormCellSection.prototype.redrawFormCells = function (cell) {
        var _this = this;
        return Promise.all(this.controls.map(function (control) {
            if (cell) {
                if (cell.definition().getName() === control.definition().getName()) {
                    return control.updateFormCellModel();
                }
            }
            else {
                return control.updateFormCellModel();
            }
        })).then(function (newBuiltData) {
            _this._sectionBridge.updateCells(newBuiltData);
        });
    };
    FormCellSection.prototype.updateCell = function (control) {
        var _this = this;
        var row = this._getRowIndex(control);
        if (row !== -1) {
            control.updateFormCellModel().then(function (data) {
                _this._sectionBridge.updateCell(data, row);
            });
        }
    };
    FormCellSection.prototype.hideLazyLoadingIndicatorView = function (control) {
        var row = this._getRowIndex(control);
        if (row !== -1) {
            if (app.android) {
            }
            else {
                this._sectionBridge.hideLazyLoadingIndicator(row);
            }
        }
    };
    FormCellSection.prototype.updateCellByProperties = function (control, data) {
        var row = this._getRowIndex(control);
        if (row !== -1) {
            this._sectionBridge.updateCell(data, row);
        }
    };
    FormCellSection.prototype.sectionBridge = function () {
        return this._sectionBridge;
    };
    FormCellSection.prototype.setFocus = function (control, keyboardVisibility) {
        if (!this.visible) {
            return;
        }
        var row = this._getRowIndex(control);
        if (row !== -1) {
            this._sectionBridge.setFocus(this.table.view(), row, keyboardVisibility);
        }
    };
    FormCellSection.prototype._createCells = function () {
        var _this = this;
        this._controls = this.definition.getControlDefs().map(function (definition) {
            return ControlFactorySync_1.ControlFactorySync.Create(_this.page, _this.context, null, definition);
        });
    };
    FormCellSection.prototype._buildCells = function () {
        var _this = this;
        return Promise.all(this.controls.map(function (control) {
            control.parentSection = _this;
            return control.build().then(function () {
                return control.bind();
            });
        })).then(function () {
            return Promise.all(_this.controls.map(function (control) {
                return control.createFormCellModel(control.builder.builtData).then(function (mdkFormCell) {
                    return mdkFormCell;
                });
            }));
        });
    };
    FormCellSection.prototype._getRowIndex = function (control) {
        var name = control.definition().getName();
        var row = this.controls.findIndex(function (ctl) {
            return ctl.definition().getName() === name;
        });
        return row;
    };
    return FormCellSection;
}(BaseTableSection_1.BaseTableSection));
exports.FormCellSection = FormCellSection;
;
