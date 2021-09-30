"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCellObservable_1 = require("./BaseFormCellObservable");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ValueResolver_1 = require("../utils/ValueResolver");
var DurationPickerFormCellObservable = (function (_super) {
    __extends(DurationPickerFormCellObservable, _super);
    function DurationPickerFormCellObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._durationType = {
            Hour: 'H',
            HourLong: 'HOUR',
            Minute: 'M',
            MinuteLong: 'MIN',
            Sec: 'S',
            SecLong: 'SEC',
        };
        return _this;
    }
    DurationPickerFormCellObservable.prototype.bindValue = function (data) {
        var _this = this;
        if (!this._control || !this._control.definition()) {
            throw new Error(ErrorMessage_1.ErrorMessage.BASEFORMCELLOBSERVABLE_BINDVALUE_INVALID);
        }
        return ValueResolver_1.ValueResolver.resolveValue(data.Value, this._control.context).then(function (dateValue) {
            var seconds = _this._convertUnitToSeconds(dateValue, data.Unit);
            if (seconds) {
                return _this.setValue(seconds, false);
            }
            return Promise.resolve(seconds);
        });
    };
    DurationPickerFormCellObservable.prototype.cellValueChange = function (newValue) {
        var builder = this.builder;
        builder.setUnit('SEC');
        return _super.prototype.cellValueChange.call(this, newValue);
    };
    DurationPickerFormCellObservable.prototype.getDefUnit = function () {
        var builder = this.builder;
        return builder.originalUnit;
    };
    DurationPickerFormCellObservable.prototype.getDurationInSeconds = function (duration, unit) {
        duration = !isNaN(Number(duration)) ? Number(duration) : 0;
        switch (unit) {
            case this._durationType.Hour:
            case this._durationType.HourLong:
                return duration * 60 * 60;
            case this._durationType.Minute:
            case this._durationType.MinuteLong:
                return duration * 60;
            case this._durationType.Sec:
            case this._durationType.SecLong:
                return duration;
            default:
                return 0;
        }
    };
    DurationPickerFormCellObservable.prototype.getDurationInDefUnits = function (duration, unit) {
        switch (unit) {
            case this._durationType.Hour:
            case this._durationType.HourLong:
                return duration / 3600;
            case this._durationType.Minute:
            case this._durationType.MinuteLong:
                return duration / 60;
            case this._durationType.Sec:
            case this._durationType.SecLong:
                return duration;
            default:
                return 0;
        }
    };
    DurationPickerFormCellObservable.prototype._convertUnitToSeconds = function (value, unit) {
        var builder = this.builder;
        if (!unit) {
            return undefined;
        }
        if (!builder.originalUnit) {
            builder.setOriginalUnit(unit);
        }
        builder.setUnit('SEC');
        return this.getDurationInSeconds(value, unit);
    };
    return DurationPickerFormCellObservable;
}(BaseFormCellObservable_1.BaseFormCellObservable));
exports.DurationPickerFormCellObservable = DurationPickerFormCellObservable;
