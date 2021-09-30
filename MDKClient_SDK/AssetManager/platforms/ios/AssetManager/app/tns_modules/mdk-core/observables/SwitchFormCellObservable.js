"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCellObservable_1 = require("./BaseFormCellObservable");
var SwitchFormCellObservable = (function (_super) {
    __extends(SwitchFormCellObservable, _super);
    function SwitchFormCellObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwitchFormCellObservable.prototype.cellValueChange = function (newValue) {
        return _super.prototype.cellValueChange.call(this, newValue);
    };
    SwitchFormCellObservable.prototype.getValue = function () {
        return !!_super.prototype.getValue.call(this);
    };
    return SwitchFormCellObservable;
}(BaseFormCellObservable_1.BaseFormCellObservable));
exports.SwitchFormCellObservable = SwitchFormCellObservable;
