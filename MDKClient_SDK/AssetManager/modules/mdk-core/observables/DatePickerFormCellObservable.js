"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCellObservable_1 = require("./BaseFormCellObservable");
var ClientSettings_1 = require("../storage/ClientSettings");
var mdk_sap_1 = require("mdk-sap");
var Logger_1 = require("../utils/Logger");
var app = require("tns-core-modules/application");
var ValueResolver_1 = require("../utils/ValueResolver");
var DatePickerFormCellObservable = (function (_super) {
    __extends(DatePickerFormCellObservable, _super);
    function DatePickerFormCellObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DatePickerFormCellObservable.prototype.bindValue = function (data) {
        var _this = this;
        if (!this._control || !this._control.definition()) {
            throw new Error('DatePickerFormCellObservable.bindValue invalid call missing required data');
        }
        var utcDate;
        return ValueResolver_1.ValueResolver.resolveValue(data.Value, this._control.context).then(function (dateValue) {
            if (dateValue instanceof Date) {
                utcDate = dateValue.toISOString().substring(0, 19);
            }
            else if (dateValue !== '') {
                try {
                    utcDate = mdk_sap_1.DataConverter.toUTCDate(dateValue, ClientSettings_1.ClientSettings.getServiceTimeZoneAbbreviation());
                }
                catch (e) {
                    Logger_1.Logger.instance.ui.error(Logger_1.Logger.INCORRECT_DATE_INPUT);
                }
            }
            if (!utcDate) {
                utcDate = _this.getDefaultDate();
            }
            return _this.setValue(utcDate, false).then(function (resolvedValue) {
                _this._target = new Date(utcDate + 'Z');
            });
        });
    };
    DatePickerFormCellObservable.prototype.setValue = function (value, notify, isTextValue) {
        var _this = this;
        return _super.prototype.setValue.call(this, value, notify, isTextValue).then(function (resolvedValue) {
            if (app.android) {
                var builder = _this.builder;
                if (resolvedValue instanceof Date) {
                    resolvedValue = resolvedValue.toISOString().split('.')[0];
                }
                builder.setValue(resolvedValue);
            }
        });
    };
    DatePickerFormCellObservable.prototype.getDefaultDate = function () {
        return new Date().toISOString().substring(0, 19);
    };
    return DatePickerFormCellObservable;
}(BaseFormCellObservable_1.BaseFormCellObservable));
exports.DatePickerFormCellObservable = DatePickerFormCellObservable;
