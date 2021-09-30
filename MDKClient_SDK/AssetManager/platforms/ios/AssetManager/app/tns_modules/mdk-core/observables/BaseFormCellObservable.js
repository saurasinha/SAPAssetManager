"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellContainer_1 = require("../controls/FormCellContainer");
var FormCellDataBuilder_1 = require("../builders/ui/formcell/FormCellDataBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var BaseObservable_1 = require("./BaseObservable");
var app = require("tns-core-modules/application");
var BaseFormCellObservable = (function (_super) {
    __extends(BaseFormCellObservable, _super);
    function BaseFormCellObservable(oControl, oControlDef, oPage) {
        var _this = _super.call(this, oControl, oControlDef, oPage) || this;
        _this.on('propertyChange', function (eventData) {
            if (_this.builder instanceof FormCellDataBuilder_1.FormCellDataBuilder) {
                _this.builder.setValue(eventData.value);
            }
        });
        return _this;
    }
    Object.defineProperty(BaseFormCellObservable.prototype, "builder", {
        get: function () {
            return this.control.builder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFormCellObservable.prototype, "searchString", {
        get: function () {
            return '';
        },
        enumerable: true,
        configurable: true
    });
    BaseFormCellObservable.prototype.bindValue = function (data) {
        if (!this._control || !this._control.definition()) {
            throw new Error(ErrorMessage_1.ErrorMessage.BASEFORMCELLOBSERVABLE_BINDVALUE_INVALID);
        }
        if (data.Value !== undefined && data.Value !== null) {
            return this.setValue(data.Value, false);
        }
        return Promise.resolve(data.Value);
    };
    BaseFormCellObservable.prototype.cellValueChange = function (newValue) {
        var _this = this;
        return this.setValue(newValue.get('Value'), true, true).then(function () {
            _this._control.updateFormCellModel(_this._valueChangedByRuleOrAction);
            if (_this.parent instanceof FormCellContainer_1.FormCellContainer && _this._control.formatRule()) {
                _this.parent.updateCell(_this._control);
                if (app.android) {
                    _this.parent.redraw();
                }
            }
            _this._valueChangedByRuleOrAction = false;
        });
    };
    BaseFormCellObservable.prototype.loadMoreItems = function () {
        throw new Error(ErrorMessage_1.ErrorMessage.INVALID_CALL_BASEFORMCELLOBSERVABLE_LOADMOREITEMS);
    };
    BaseFormCellObservable.prototype.searchUpdated = function (searchText) {
        throw new Error(ErrorMessage_1.ErrorMessage.INVALID_CALL_BASEFORMCELLOBSERVABLE_SEARCHUPDATED);
    };
    BaseFormCellObservable.prototype.setValue = function (value, notify, isTextValue) {
        return _super.prototype.setValue.call(this, value, notify, isTextValue);
    };
    BaseFormCellObservable.prototype.getTargetSpecifier = function () {
        return undefined;
    };
    BaseFormCellObservable.prototype.setTargetSpecifier = function (specifier) {
        return Promise.resolve();
    };
    BaseFormCellObservable.prototype.setEditable = function (isEditable) {
        var builder = this.builder;
        builder.setEditable(isEditable);
    };
    BaseFormCellObservable.prototype.setStyle = function (style, target) {
        var builder = this.builder;
        builder.setStyle(style, target);
    };
    BaseFormCellObservable.prototype.setValidationProperties = function (validationProperties) {
        var builder = this.builder;
        builder.setValidationProperties(validationProperties);
    };
    return BaseFormCellObservable;
}(BaseObservable_1.BaseObservable));
exports.BaseFormCellObservable = BaseFormCellObservable;
