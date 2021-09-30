"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseTableSection_1 = require("./BaseTableSection");
var ObjectTableSectionObservable_1 = require("../observables/sections/ObjectTableSectionObservable");
var ObjectTableSection = (function (_super) {
    __extends(ObjectTableSection, _super);
    function ObjectTableSection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._inNavgiation = false;
        return _this;
    }
    ObjectTableSection.prototype.onNavigatedFrom = function (pageExists) {
        this._inNavgiation = false;
    };
    ObjectTableSection.prototype.onNavigatedTo = function (initialLoading) {
        this._inNavgiation = false;
    };
    ObjectTableSection.prototype.onNavigatingFrom = function (pageExists) {
        this._inNavgiation = true;
    };
    ObjectTableSection.prototype.onNavigatingTo = function (initialLoading) {
        this._inNavgiation = true;
    };
    ObjectTableSection.prototype.isInNavigation = function () {
        return this._inNavgiation;
    };
    ObjectTableSection.prototype._createObservable = function () {
        return new ObjectTableSectionObservable_1.ObjectTableSectionObservable(this);
    };
    ObjectTableSection.prototype.onSelectionChanged = function (param) {
        return _super.prototype.onSelectionChanged.call(this, param);
    };
    ObjectTableSection.prototype.onSelectionModeChanged = function (param) {
        return _super.prototype.onSelectionModeChanged.call(this, param);
    };
    ObjectTableSection.prototype.updateSectionSelectedRows = function (param) {
        return _super.prototype.updateSectionSelectedRows.call(this, param);
    };
    return ObjectTableSection;
}(BaseTableSection_1.BaseTableSection));
exports.ObjectTableSection = ObjectTableSection;
