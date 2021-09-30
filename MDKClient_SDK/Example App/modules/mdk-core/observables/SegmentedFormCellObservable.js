"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCollectionFormCellObservable_1 = require("./BaseCollectionFormCellObservable");
var ValueResolver_1 = require("../utils/ValueResolver");
var SegmentedFormCellObservable = (function (_super) {
    __extends(SegmentedFormCellObservable, _super);
    function SegmentedFormCellObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._DISPLAYED_ITEMS_KEY = 'Segments';
        return _this;
    }
    SegmentedFormCellObservable.prototype.setValue = function (value, notify, isTextValue) {
        var _this = this;
        var oldValue = this._target;
        this._valueChanged = false;
        return ValueResolver_1.ValueResolver.resolveValue(value, this._control.context).then(function (dateValue) {
            return _this._updateTarget(dateValue).then(function () {
                _this._assignItems();
                _this._assignSelections(0);
                if (_this._isValueChanged(oldValue)) {
                    _this._valueChanged = true;
                    return _this.onValueChange(notify);
                }
                else {
                    return Promise.resolve();
                }
            });
        });
    };
    return SegmentedFormCellObservable;
}(BaseCollectionFormCellObservable_1.BaseCollectionFormCellObservable));
exports.SegmentedFormCellObservable = SegmentedFormCellObservable;
