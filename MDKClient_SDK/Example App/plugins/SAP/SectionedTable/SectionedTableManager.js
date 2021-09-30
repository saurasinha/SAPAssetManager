"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Section = (function () {
    function Section() {
    }
    Section.prototype.destroy = function () {
    };
    Section.prototype.create = function (params, callback) {
    };
    Section.prototype.createButtonSection = function (params, callback) {
    };
    Section.prototype.createContactTableSection = function (params, callback) {
    };
    Section.prototype.createExtensionSection = function (params, callback) {
    };
    Section.prototype.createGridTableSection = function (params, callback) {
    };
    Section.prototype.createKeyValueSection = function (params, callback) {
    };
    Section.prototype.createObjectCollectionSection = function (params, callback) {
    };
    Section.prototype.createAnalyticCardCollectionSection = function (params, callback) {
    };
    Section.prototype.createChartContentSection = function (params, callback) {
    };
    Section.prototype.createObjectHeaderSection = function (params, callback) {
    };
    Section.prototype.createProfileHeaderSection = function (params, callback) {
    };
    Section.prototype.createKPIHeaderSection = function (params, callback) {
    };
    Section.prototype.createKPISection = function (params, callback) {
    };
    Section.prototype.createObjectTableSection = function (params, callback) {
    };
    Section.prototype.createSimplePropertySection = function (params, callback) {
    };
    Section.prototype.createImageCollectionSection = function (params, callback) {
    };
    ;
    Section.prototype.createFormCellSection = function (params, callback) {
    };
    Section.prototype.setFormCellSectionItems = function (cellItems) {
    };
    Section.prototype.updateCell = function (params, row) {
    };
    Section.prototype.updateCells = function (params) {
    };
    Section.prototype.redraw = function (data) {
    };
    Section.prototype.reloadData = function (itemCount) {
    };
    Section.prototype.reloadRow = function (index) {
    };
    Section.prototype.updateRow = function (index, data) {
    };
    Section.prototype.setIndicatorState = function (params) {
    };
    Section.prototype.setSelectionMode = function (params) {
    };
    Section.prototype.updateSectionSelectionMode = function (mode) {
    };
    Section.prototype.refreshIndicators = function () {
    };
    Section.prototype.redrawLayout = function () {
    };
    Section.prototype.updateProgressBar = function (visible) {
    };
    Section.prototype.setFocus = function (sectionedTable, row, keyboardVisibility) {
    };
    Section.prototype.hideLazyLoadingIndicator = function (row) {
    };
    return Section;
}());
exports.Section = Section;
;
var SectionedTable = (function () {
    function SectionedTable(page, containerCallback) {
        this.page = page;
        this.containerCallback = containerCallback;
    }
    SectionedTable.prototype.create = function (sections) {
    };
    SectionedTable.prototype.destroy = function () {
    };
    SectionedTable.prototype.redraw = function () {
    };
    SectionedTable.prototype.setSearchString = function (searchString) {
        return false;
    };
    SectionedTable.prototype.setFocus = function (nativeSection, row, keyboardVisibility) {
    };
    SectionedTable.prototype.setInEmbeddedFrame = function (embedded) {
    };
    return SectionedTable;
}());
exports.SectionedTable = SectionedTable;
;
