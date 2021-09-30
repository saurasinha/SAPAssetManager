"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCell_1 = require("./BaseFormCell");
var DurationPickerFormCell = (function (_super) {
    __extends(DurationPickerFormCell, _super);
    function DurationPickerFormCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DurationPickerFormCell.prototype.setValue = function (value, notify, isTextValue) {
        var durationNumber = new RegExp('^\\d+(.\\d+)?$', 'i');
        if (durationNumber.test(value)) {
            var obs = this.observable();
            var defUnit = obs.getDefUnit();
            var secValue = obs.getDurationInSeconds(value, defUnit);
            return _super.prototype.setValue.call(this, secValue, notify, isTextValue);
        }
        else {
            return _super.prototype.setValue.call(this, 0, notify, isTextValue);
        }
    };
    DurationPickerFormCell.prototype.getValue = function () {
        var obs = this.observable();
        var defUnit = obs.getDefUnit();
        var retVal = obs.getDurationInDefUnits(_super.prototype.getValue.call(this), defUnit);
        return retVal;
    };
    return DurationPickerFormCell;
}(BaseFormCell_1.BaseFormCell));
exports.DurationPickerFormCell = DurationPickerFormCell;
