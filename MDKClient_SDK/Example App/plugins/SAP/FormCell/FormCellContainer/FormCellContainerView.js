"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellContainerView = (function () {
    function FormCellContainerView(page, containerCallback, params) {
        this.page = page;
        this.containerCallback = containerCallback;
        this.params = params;
    }
    FormCellContainerView.prototype.addFormCell = function (model) {
    };
    FormCellContainerView.prototype.createNativeView = function () {
        return undefined;
    };
    FormCellContainerView.prototype.disposeNativeView = function () {
    };
    FormCellContainerView.prototype.initNativeView = function () {
    };
    FormCellContainerView.prototype.updateCell = function (params, row, section) {
    };
    FormCellContainerView.prototype.updateCells = function (params, style) {
    };
    FormCellContainerView.prototype.setFocus = function (row, section, keyboardVisibility) {
    };
    FormCellContainerView.prototype.hideLazyLoadingIndicator = function (row, section) {
    };
    FormCellContainerView.prototype.setInEmbeddedFrame = function (embedded) {
    };
    return FormCellContainerView;
}());
exports.FormCellContainerView = FormCellContainerView;
;
