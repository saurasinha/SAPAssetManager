function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
__export(require("../core/view"));
var dateComparer = function (x, y) { return (x <= y && x >= y); };
function getValidTime(picker, hour, minute) {
    if (picker.minuteInterval > 1) {
        var minuteFloor = minute - (minute % picker.minuteInterval);
        minute = minuteFloor + (minute === minuteFloor + 1 ? picker.minuteInterval : 0);
        if (minute === 60) {
            hour++;
            minute = 0;
        }
    }
    var time = { hour: hour, minute: minute };
    if (!isLessThanMaxTime(picker, hour, minute)) {
        time = { hour: picker.maxHour, minute: picker.maxMinute };
    }
    if (!isGreaterThanMinTime(picker, hour, minute)) {
        time = { hour: picker.minHour, minute: picker.minMinute };
    }
    return time;
}
exports.getValidTime = getValidTime;
function isValidTime(picker) {
    return isGreaterThanMinTime(picker) && isLessThanMaxTime(picker);
}
function isHourValid(value) {
    return typeof value === "number" && value >= 0 && value <= 23;
}
function isMinuteValid(value) {
    return typeof value === "number" && value >= 0 && value <= 59;
}
function isMinuteIntervalValid(value) {
    return typeof value === "number" && value >= 1 && value <= 30 && 60 % value === 0;
}
function getMinutes(hour) {
    return hour * 60;
}
function isDefined(value) {
    return value !== undefined;
}
exports.isDefined = isDefined;
function isGreaterThanMinTime(picker, hour, minute) {
    if (picker.minHour === undefined || picker.minMinute === undefined) {
        return true;
    }
    return getMinutes(hour !== undefined ? hour : picker.hour) + (minute !== undefined ? minute : picker.minute) >= getMinutes(picker.minHour) + picker.minMinute;
}
function isLessThanMaxTime(picker, hour, minute) {
    if (!isDefined(picker.maxHour) || !isDefined(picker.maxMinute)) {
        return true;
    }
    return getMinutes(isDefined(hour) ? hour : picker.hour) + (isDefined(minute) ? minute : picker.minute) <= getMinutes(picker.maxHour) + picker.maxMinute;
}
function toString(value) {
    if (value instanceof Date) {
        return value + "";
    }
    return value < 10 ? "0" + value : "" + value;
}
function getMinMaxTimeErrorMessage(picker) {
    return "Min time: (" + toString(picker.minHour) + ":" + toString(picker.minMinute) + "), max time: (" + toString(picker.maxHour) + ":" + toString(picker.maxMinute) + ")";
}
function getErrorMessage(picker, propertyName, newValue) {
    return propertyName + " property value (" + toString(newValue) + ":" + toString(picker.minute) + ") is not valid. " + getMinMaxTimeErrorMessage(picker) + ".";
}
var TimePickerBase = (function (_super) {
    __extends(TimePickerBase, _super);
    function TimePickerBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimePickerBase = __decorate([
        view_1.CSSType("TimePicker")
    ], TimePickerBase);
    return TimePickerBase;
}(view_1.View));
exports.TimePickerBase = TimePickerBase;
TimePickerBase.prototype.recycleNativeView = "auto";
exports.minHourProperty = new view_1.Property({
    name: "minHour", defaultValue: 0, valueChanged: function (picker, oldValue, newValue) {
        if (!isHourValid(newValue) || !isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, "minHour", newValue));
        }
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.minHourProperty.register(TimePickerBase);
exports.maxHourProperty = new view_1.Property({
    name: "maxHour", defaultValue: 23, valueChanged: function (picker, oldValue, newValue) {
        if (!isHourValid(newValue) || !isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, "maxHour", newValue));
        }
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.maxHourProperty.register(TimePickerBase);
exports.minMinuteProperty = new view_1.Property({
    name: "minMinute", defaultValue: 0, valueChanged: function (picker, oldValue, newValue) {
        if (!isMinuteValid(newValue) || !isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, "minMinute", newValue));
        }
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.minMinuteProperty.register(TimePickerBase);
exports.maxMinuteProperty = new view_1.Property({
    name: "maxMinute", defaultValue: 59, valueChanged: function (picker, oldValue, newValue) {
        if (!isMinuteValid(newValue) || !isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, "maxMinute", newValue));
        }
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.maxMinuteProperty.register(TimePickerBase);
exports.minuteIntervalProperty = new view_1.Property({
    name: "minuteInterval", defaultValue: 1, valueChanged: function (picker, oldValue, newValue) {
        if (!isMinuteIntervalValid(newValue)) {
            throw new Error(getErrorMessage(picker, "minuteInterval", newValue));
        }
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.minuteIntervalProperty.register(TimePickerBase);
exports.minuteProperty = new view_1.Property({
    name: "minute", defaultValue: 0, valueChanged: function (picker, oldValue, newValue) {
        if (!isMinuteValid(newValue) || !isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, "minute", newValue));
        }
        picker.time = new Date(0, 0, 0, picker.hour, picker.minute);
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.minuteProperty.register(TimePickerBase);
exports.hourProperty = new view_1.Property({
    name: "hour", defaultValue: 0, valueChanged: function (picker, oldValue, newValue) {
        if (!isHourValid(newValue) || !isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, "Hour", newValue));
        }
        picker.time = new Date(0, 0, 0, picker.hour, picker.minute);
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.hourProperty.register(TimePickerBase);
exports.timeProperty = new view_1.Property({
    name: "time", defaultValue: new Date(), equalityComparer: dateComparer,
    valueChanged: function (picker, oldValue, newValue) {
        if (!isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, "time", newValue));
        }
        picker.hour = newValue.getHours();
        picker.minute = newValue.getMinutes();
    }
});
exports.timeProperty.register(TimePickerBase);
exports.iosPreferredDatePickerStyleProperty = new view_1.Property({
    name: 'iosPreferredDatePickerStyle',
    defaultValue: 0,
    valueConverter: function (v) { return parseInt(v); },
});
exports.iosPreferredDatePickerStyleProperty.register(TimePickerBase);
//# sourceMappingURL=time-picker-common.js.map