"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../../BaseDataBuilder");
var BaseFormCellDataBuilder_1 = require("./BaseFormCellDataBuilder");
var JSONCheckSum_1 = require("../../../utils/JSONCheckSum");
var Logger_1 = require("../../../utils/Logger");
var ValidationPropertiesBuilder = (function (_super) {
    __extends(ValidationPropertiesBuilder, _super);
    function ValidationPropertiesBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.data.validationProperties = {};
        return _this;
    }
    ValidationPropertiesBuilder.prototype.setMessage = function (message) {
        this.data.validationProperties.ValidationMessage = message;
        return this;
    };
    ValidationPropertiesBuilder.prototype.setMessageColor = function (color) {
        this.data.validationProperties.ValidationMessageColor = color;
        return this;
    };
    ValidationPropertiesBuilder.prototype.setSeparatorBackgroundColor = function (color) {
        this.data.validationProperties.SeparatorBackgroundColor = color;
        return this;
    };
    ValidationPropertiesBuilder.prototype.setSeparatorIsHidden = function (state) {
        this.data.validationProperties.SeparatorIsHidden = state;
        return this;
    };
    ValidationPropertiesBuilder.prototype.setValidationViewBackgroundColor = function (color) {
        this.data.validationProperties.ValidationViewBackgroundColor = color;
        return this;
    };
    ValidationPropertiesBuilder.prototype.setValidationViewIsHidden = function (state) {
        this.data.validationProperties.ValidationViewIsHidden = state;
        return this;
    };
    return ValidationPropertiesBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.ValidationPropertiesBuilder = ValidationPropertiesBuilder;
var FormCellDataBuilder = (function (_super) {
    __extends(FormCellDataBuilder, _super);
    function FormCellDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this._builtData = undefined;
        _this.doNotResolveKeys = {
            Value: true,
        };
        return _this;
    }
    FormCellDataBuilder.prototype.build = function () {
        var _this = this;
        if (!this._builtData) {
            this.fromJSON(this.definition);
            return _super.prototype.build.call(this).then(function (builtData) {
                _this._builtData = builtData;
                var nameKey = '_Name';
                if (!_this._builtData.hasOwnProperty(nameKey)) {
                    _this._builtData[nameKey] = _this.definition.getName();
                }
                return _this._builtData;
            });
        }
        else {
            var requiresRedraw = this._builtData._redraw;
            delete this._builtData._redraw;
            var checksum = void 0;
            if (this._builtData.PickerItems) {
                var clonedObj = Object.assign({}, this._builtData);
                delete clonedObj.PickerItems;
                checksum = JSONCheckSum_1.JSONCheckSum.sha256(clonedObj);
            }
            else {
                checksum = JSONCheckSum_1.JSONCheckSum.sha256(this._builtData);
            }
            if (!this._checksum) {
                this._checksum = checksum;
            }
            else if (checksum !== this._checksum) {
                var control = "for control '" + this.definition.name + "'";
                var previous = "previous checksum: " + this._checksum;
                var current = "current checksum: " + checksum;
                var msg_1 = "FormCellDataBuilder detected a checksum change, " + control + " " + previous + " " + current;
                Logger_1.Logger.instance.formCell.info(msg_1);
                this._checksum = checksum;
                this._builtData._redraw = true;
            }
            else {
                var control = "for control '" + this.definition.name + "'";
                var msg_2 = "FormCellDataBuilder no checksum change, " + control + " " + this._checksum;
                Logger_1.Logger.instance.ui.info(msg_2);
                if (requiresRedraw) {
                    this._builtData._redraw = requiresRedraw;
                }
            }
            return Promise.resolve(this._builtData);
        }
    };
    FormCellDataBuilder.prototype.fromJSON = function (definition) {
        var _this = this;
        Object.keys(definition.data).forEach(function (key) {
            var value = definition.data[key];
            if (Array.isArray(value)) {
                _this.data[key] = value;
            }
            else if (typeof value === 'object') {
                _this.data[key] = {};
                Object.keys(value).forEach(function (objectKey) {
                    _this.data[key][objectKey] = value[objectKey];
                });
            }
            else {
                _this.data[key] = value;
            }
        });
        return this;
    };
    FormCellDataBuilder.prototype.setCaption = function (caption) {
        this.builtData.Caption = caption;
        return this;
    };
    FormCellDataBuilder.prototype.setEditable = function (state) {
        this.builtData.IsEditable = state;
        return this;
    };
    FormCellDataBuilder.prototype.setOnValueChange = function (handler) {
        this.builtData.OnValueChange = handler;
        return this;
    };
    FormCellDataBuilder.prototype.setName = function (name) {
        this.builtData._Name = name;
        return this;
    };
    FormCellDataBuilder.prototype.setStyle = function (style, target) {
        var styles = this.builtData.Styles || {};
        styles[target] = style;
        this.builtData.Styles = styles;
        return this;
    };
    FormCellDataBuilder.prototype.setValue = function (value) {
        return this.setBuildDataPropertyValue('Value', value);
    };
    FormCellDataBuilder.prototype.setBuildDataPropertyValue = function (prop, value) {
        if (value !== undefined && value !== null) {
            this.builtData[prop] = value;
        }
        else {
            delete this.builtData[prop];
        }
        return this;
    };
    FormCellDataBuilder.prototype.setValidationProperties = function (validationProperties) {
        this.builtData.validationProperties = this.builtData.validationProperties || {};
        Object.assign(this.builtData.validationProperties, validationProperties);
        return this;
    };
    FormCellDataBuilder.prototype.setVisible = function (state) {
        this.builtData.IsVisible = state;
        return this;
    };
    Object.defineProperty(FormCellDataBuilder.prototype, "builtData", {
        get: function () {
            return this._builtData ? this._builtData : this.data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormCellDataBuilder.prototype, "validationProperties", {
        get: function () {
            if (!this.data.validationProperties) {
                this.data.validationProperties = new ValidationPropertiesBuilder(this._context);
            }
            return this.data.validationProperties;
        },
        enumerable: true,
        configurable: true
    });
    return FormCellDataBuilder;
}(BaseFormCellDataBuilder_1.BaseFormCellDataBuilder));
exports.FormCellDataBuilder = FormCellDataBuilder;
