"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SelectedItem = (function () {
    function SelectedItem(bindingData, cellData) {
        this.binding = bindingData;
        this.cell = cellData;
    }
    return SelectedItem;
}());
exports.SelectedItem = SelectedItem;
var ChangedItem = (function (_super) {
    __extends(ChangedItem, _super);
    function ChangedItem(bindingData, cellData, selected) {
        var _this = _super.call(this, bindingData, cellData) || this;
        _this.selected = selected;
        return _this;
    }
    return ChangedItem;
}(SelectedItem));
exports.ChangedItem = ChangedItem;
