"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCell_1 = require("./BaseFormCell");
var ListFormCellObservable_1 = require("../../observables/ListFormCellObservable");
var ListPickerFragmentContainer_1 = require("../ListPickerFragmentContainer");
var FormCellContainer_1 = require("../FormCellContainer");
var FormCellSection_1 = require("../../sections/FormCellSection");
var TabFrame_1 = require("../../pages/TabFrame");
var PageRenderer_1 = require("../../pages/PageRenderer");
var PageDefinition_1 = require("../../definitions/PageDefinition");
var IFilterable_1 = require("../IFilterable");
var ValueResolver_1 = require("../../utils/ValueResolver");
var app = require("tns-core-modules/application");
var ListPickerFormCell = (function (_super) {
    __extends(ListPickerFormCell, _super);
    function ListPickerFormCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListPickerFormCell.prototype.setSearchEnabled = function (isSearchEnabled) {
        this.observable().setSearchEnabled(isSearchEnabled);
    };
    ListPickerFormCell.prototype.setBarcodeScanEnabled = function (isBarcodeScanEnabled) {
        this.observable().setBarcodeScanEnabled(isBarcodeScanEnabled);
    };
    ListPickerFormCell.prototype.getValue = function () {
        return this.observable().getValue();
    };
    ListPickerFormCell.prototype.hideLazyLoadingIndicator = function () {
        if (app.android) {
            _super.prototype.hideLazyLoadingIndicator.call(this);
        }
        else {
            var builder = this.builder;
            var isLazyLoadingIndicatorEnabled = builder.isLazyLoadingIndicatorEnabled;
            if (isLazyLoadingIndicatorEnabled) {
                if (this.parent instanceof FormCellContainer_1.FormCellContainer) {
                    return this.parent.hideLazyLoadingIndicator(this);
                }
                else if (this.parentSection instanceof FormCellSection_1.FormCellSection) {
                    return this.parentSection.hideLazyLoadingIndicatorView(this);
                }
            }
        }
    };
    ListPickerFormCell.prototype.getCollection = function () {
        return this.observable().getCollection();
    };
    ListPickerFormCell.prototype.setTargetSpecifier = function (specifier, redraw) {
        var _this = this;
        if (redraw === void 0) { redraw = true; }
        return this.observable().setTargetSpecifier(specifier).then(function () {
            if (redraw) {
                _this.redraw();
            }
            else {
                _this.updateCell();
            }
        });
    };
    ListPickerFormCell.prototype.webCreateListPickerDialog = function (model) {
        if (!app.ios && model) {
            var pageData = {
                Caption: model.caption(),
                Controls: [{
                        Model: model,
                        _Name: 'ListPickerFragmentContainer',
                        _Type: 'Control.Type.ListPickerFragmentContainer',
                    }],
                _Name: 'ListPickerFragment',
                _Type: 'Page',
            };
            PageRenderer_1.PageRenderer.showModalPageByDefinition(new PageDefinition_1.PageDefinition(null, pageData), true);
        }
    };
    ListPickerFormCell.prototype.androidCreateListPickerFragmentPage = function (model) {
        if (!app.ios && model) {
            this.page().isExternalNavigating = true;
            var pageData = {
                Caption: model.caption(),
                Controls: [{
                        Model: model,
                        _Name: 'ListPickerFragmentContainer',
                        _Type: 'Control.Type.ListPickerFragmentContainer',
                    }],
                _Name: 'ListPickerFragment',
                _Type: 'Page',
            };
            PageRenderer_1.PageRenderer.showPageByDefinition(new PageDefinition_1.PageDefinition(null, pageData));
        }
    };
    ListPickerFormCell.prototype.androidCloseListPickerFragmentPage = function () {
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        var currentPage = topFrame.currentPage;
        if (app.android && currentPage.definition.name === 'ListPickerFragment') {
            topFrame.goBack();
        }
    };
    ListPickerFormCell.prototype.androidGetModalFrameTag = function () {
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        if (topFrame._dialogFragment) {
            return topFrame._dialogFragment.getTag();
        }
        else {
            return "";
        }
    };
    ListPickerFormCell.prototype.androidUpdateActionViewExpandedStatus = function (isActive) {
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        var currentPage = topFrame.currentPage;
        if (app.android && currentPage.definition.name === 'ListPickerFragment') {
            if (isActive) {
                for (var _i = 0, _a = currentPage.controls; _i < _a.length; _i++) {
                    var control = _a[_i];
                    if (control instanceof ListPickerFragmentContainer_1.ListPickerFragmentContainer) {
                        currentPage.definition.data.OnActivityBackPressed = control.getBackPressedEvent();
                    }
                }
            }
            else {
                currentPage.definition.data.OnActivityBackPressed = null;
            }
        }
    };
    ListPickerFormCell.prototype.androidRefreshForSelections = function () {
        if (app.android) {
            if (this.parent instanceof FormCellContainer_1.FormCellContainer) {
                return this.parent.view().updateCells();
            }
            else if (this.parentSection instanceof FormCellSection_1.FormCellSection) {
                return this.parentSection.sectionBridge().updateCells();
            }
        }
    };
    ListPickerFormCell.prototype.triggerOnValueChangeEventForOneItemSelected = function () {
        var ob = this.observable();
        ob.triggerOnValueChangeEventForOneItemSelected();
    };
    ListPickerFormCell.prototype.getFilterValue = function () {
        if (this._filterProperty) {
            var ob = this.observable();
            var selected = ob.getValue();
            var filterItems = [];
            for (var _i = 0, selected_1 = selected; _i < selected_1.length; _i++) {
                var item = selected_1[_i];
                filterItems.push(item.ReturnValue);
            }
            if (this._filterProperty instanceof Object) {
                return new IFilterable_1.FilterCriteria(IFilterable_1.FilterType.Filter, this._filterProperty.name, this._filterProperty.caption, filterItems);
            }
            else {
                return new IFilterable_1.FilterCriteria(IFilterable_1.FilterType.Filter, this._filterProperty, this._filterProperty, filterItems);
            }
        }
    };
    ListPickerFormCell.prototype.setFilterCriteria = function (filterable) {
        var _this = this;
        var promises = [];
        promises.push(ValueResolver_1.ValueResolver.resolveValue(this.definition().data.FilterProperty, this.context).then(function (result) {
            _this._filterProperty = result;
        }));
        promises.push(ValueResolver_1.ValueResolver.resolveValue(this.definition().data.Caption, this.context).then(function (result) {
            _this._caption = result;
        }));
        return Promise.all(promises).then(function () {
            if (_this._filterProperty) {
                var filterItem = void 0;
                var nameOfColumn = void 0;
                if (_this._filterProperty instanceof Object) {
                    nameOfColumn = _this._filterProperty.name;
                    filterItem = filterable.getFilterCriteria(nameOfColumn, _this._filterProperty.values);
                }
                else {
                    nameOfColumn = _this._filterProperty;
                    filterItem = filterable.getFilterCriteria(nameOfColumn, null);
                }
                if (filterItem) {
                    var ob = _this.observable();
                    if (_this._caption) {
                        ob.setFilterCaption(_this._caption);
                    }
                    else if (filterItem.caption) {
                        ob.setFilterCaption(filterItem.caption);
                    }
                    var previous = filterable.getSelectedValues();
                    if (previous) {
                        for (var _i = 0, previous_1 = previous; _i < previous_1.length; _i++) {
                            var prevValue = previous_1[_i];
                            if (prevValue.isFilter() && prevValue.name === nameOfColumn) {
                                return ob.updateSelectedValues(prevValue.filterItems);
                            }
                        }
                    }
                }
            }
        });
    };
    ListPickerFormCell.prototype.onLoaded = function () {
        var _this = this;
        if (this.page().filter && !this._filterProperty) {
            return this.setFilterCriteria(this.page().filter).then(function () {
                _this.updateFormCellModel();
                return true;
            });
        }
        return Promise.resolve(null);
    };
    ListPickerFormCell.prototype.createObservable = function () {
        return new ListFormCellObservable_1.ListFormCellObservable(this, this.definition(), this.page());
    };
    return ListPickerFormCell;
}(BaseFormCell_1.BaseFormCell));
exports.ListPickerFormCell = ListPickerFormCell;
