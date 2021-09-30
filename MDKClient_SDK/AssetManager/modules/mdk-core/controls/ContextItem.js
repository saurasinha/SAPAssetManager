"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContextItem = (function () {
    function ContextItem(item) {
        this.binding = item.selectedItem;
        this.boundItem = item.boundItem;
    }
    ContextItem.prototype.getBinding = function () {
        return this.binding;
    };
    ContextItem.prototype.setLeadingItems = function (items) {
        this.boundItem.ContextMenu.LeadingItems = items;
    };
    ContextItem.prototype.setTrailingItems = function (items) {
        this.boundItem.ContextMenu.TrailingItems = items;
    };
    return ContextItem;
}());
exports.ContextItem = ContextItem;
