"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mdk_sap_1 = require("mdk-sap");
var FormCellBuilderFactory_1 = require("../../builders/ui/formcell/FormCellBuilderFactory");
var TitleDataBuilder_1 = require("../../builders/ui/formcell/TitleDataBuilder");
var BaseControlDefinition_1 = require("../../definitions/controls/BaseControlDefinition");
var BaseFormCellObservable_1 = require("../../observables/BaseFormCellObservable");
var ButtonFormCellObservable_1 = require("../../observables/ButtonFormCellObservable");
var DatePickerFormCellObservable_1 = require("../../observables/DatePickerFormCellObservable");
var DurationPickerFormCellObservable_1 = require("../../observables/DurationPickerFormCellObservable");
var SwitchFormCellObservable_1 = require("../../observables/SwitchFormCellObservable");
var SignatureCaptureFormCellObservable_1 = require("../../observables/SignatureCaptureFormCellObservable");
var Logger_1 = require("../../utils/Logger");
var BaseControl_1 = require("../BaseControl");
var FormCellContainer_1 = require("../FormCellContainer");
var FormCellSection_1 = require("../../sections/FormCellSection");
var app = require("tns-core-modules/application");
var BaseFormCell = (function (_super) {
    __extends(BaseFormCell, _super);
    function BaseFormCell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._validationProperties = {};
        return _this;
    }
    Object.defineProperty(BaseFormCell.prototype, "builder", {
        get: function () {
            return this._builder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFormCell.prototype, "isBindable", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFormCell.prototype, "isFormCell", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFormCell.prototype, "searchString", {
        get: function () {
            return this.observable().searchString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFormCell.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFormCell.prototype, "parentSection", {
        get: function () {
            return this._parentSection;
        },
        set: function (parentSection) {
            this._parentSection = parentSection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFormCell.prototype, "visible", {
        get: function () {
            var builder = this.builder;
            return builder.builtData.IsVisible;
        },
        set: function (visible) {
            this.setVisible(visible, true);
        },
        enumerable: true,
        configurable: true
    });
    BaseFormCell.prototype.createFormCellModel = function (builtData) {
        var _this = this;
        if (!this._model) {
            var formCellFactory_1 = mdk_sap_1.FormCellFactory.getInstance();
            switch (this.definition().type) {
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellAttachment:
                    this._model = formCellFactory_1.createAttachmentFormCell(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellButton:
                    this._model = formCellFactory_1.createButtonFormCell(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellDatePicker:
                    this._model =
                        mdk_sap_1.FormCellFactory.getInstance().createDateFormCell(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellDurationPicker:
                    this._model =
                        mdk_sap_1.FormCellFactory.getInstance().createDurationFormCell(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellExtension:
                    this._model =
                        mdk_sap_1.FormCellFactory.getInstance().createExtensionFormCell(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellFilter:
                    this._model = mdk_sap_1.FormCellFactory.getInstance().createFilterFormCell(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellListPicker:
                    this._model =
                        mdk_sap_1.FormCellFactory.getInstance().createListPicker(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellNote:
                    this._model =
                        mdk_sap_1.FormCellFactory.getInstance().createNoteFormCell(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSegmentedControl:
                    this._model =
                        mdk_sap_1.FormCellFactory.getInstance().createSegmentedFormCell(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSignatureCapture:
                    this._model =
                        mdk_sap_1.FormCellFactory.getInstance().createSignatureCaptureFormCell(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSimpleProperty:
                    this._model =
                        mdk_sap_1.FormCellFactory.getInstance().createSimplePropertyFormCell(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSorter:
                    this._model = mdk_sap_1.FormCellFactory.getInstance().createSorterFormCell(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSwitch:
                    this._model =
                        mdk_sap_1.FormCellFactory.getInstance().createSwitchFormCell(builtData, this.observable());
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellTitle:
                    this._model =
                        mdk_sap_1.FormCellFactory.getInstance().createTitleFormCell(builtData, this.observable());
                    break;
                default:
                    Logger_1.Logger.instance.formCell.log("Replacing " + this.definition().type + " with Control.Type.FormCell.Title");
                    var builder = new TitleDataBuilder_1.TitleDataBuilder(this.context, this.definition());
                    return builder.setName(builtData._Name)
                        .setValue('')
                        .setEditable(false)
                        .setPlaceHolder(this.definition().type)
                        .build().then(function (data) {
                        _this._model = formCellFactory_1.createTitleFormCell(data, _this.observable());
                        return _this._model;
                    });
            }
        }
        return Promise.resolve(this._model);
    };
    BaseFormCell.prototype.getTargetSpecifier = function () {
        var observable = this.observable();
        return observable.getTargetSpecifier();
    };
    BaseFormCell.prototype.build = function () {
        var context = this.context;
        var definition = this.definition();
        this._builder = this._builder || FormCellBuilderFactory_1.FormCellBuilderFactory.Create(context, definition);
        if (!this._builder) {
            throw new Error("you can't do that!");
        }
        var builder = this._builder;
        return builder.build();
    };
    BaseFormCell.prototype.bind = function () {
        var _this = this;
        var observable = this.observable();
        return observable.bindValue(this.builder.builtData).then(function () {
            return _this.builder.build().then(function (builtData) {
                return builtData;
            });
        });
    };
    BaseFormCell.prototype.redraw = function () {
        var _this = this;
        return this.updateFormCellModel().then(function (data) {
            if (app.ios) {
                return _this.updateCellByProperties(data);
            }
            else {
                return _this.redrawFromParent();
            }
        });
    };
    BaseFormCell.prototype.redrawFromParent = function () {
        if (this.parent instanceof FormCellContainer_1.FormCellContainer) {
            return this.parent.redraw(undefined, this);
        }
        else if (this.parentSection instanceof FormCellSection_1.FormCellSection) {
            return this.parentSection.redrawFormCells(this);
        }
    };
    BaseFormCell.prototype.updateCell = function () {
        if (this.parent instanceof FormCellContainer_1.FormCellContainer) {
            this.parent.updateCell(this);
        }
        else if (this.parentSection instanceof FormCellSection_1.FormCellSection) {
            this.parentSection.updateCell(this);
        }
    };
    BaseFormCell.prototype.updateCellByProperties = function (data) {
        if (this.parent instanceof FormCellContainer_1.FormCellContainer) {
            this.parent.updateCellByProperties(this, data);
        }
        else if (this.parentSection instanceof FormCellSection_1.FormCellSection) {
            this.parentSection.updateCellByProperties(this, data);
        }
    };
    BaseFormCell.prototype.updateFormCellModel = function (redraw) {
        var _this = this;
        if (redraw === void 0) { redraw = true; }
        return this.build().then(function (data) {
            if (_this._model) {
                if (!redraw) {
                    delete data._redraw;
                }
                data._redraw = redraw;
                _this._model.update(data);
                delete data._redraw;
            }
            return data;
        });
    };
    BaseFormCell.prototype.setEditable = function (isEditable) {
        var observable = this.observable();
        observable.setEditable(isEditable);
        this.redraw();
    };
    BaseFormCell.prototype.setStyle = function (style, target) {
        if (target && typeof target === 'string') {
            var observable = this.observable();
            observable.setStyle(style, target);
            this.updateFormCellModel();
        }
        else {
            _super.prototype.setStyle.call(this, style);
        }
    };
    BaseFormCell.prototype.setValidationProperty = function (key, value) {
        var observable = this.observable();
        this.setupValidationProperties(key.toLowerCase(), value);
        observable.setValidationProperties(this._validationProperties);
    };
    BaseFormCell.prototype.clearValidation = function () {
        var observable = this.observable();
        this.setupValidationProperties('ValidationViewIsHidden'.toLowerCase(), true);
        observable.setValidationProperties(this._validationProperties);
        this.redraw();
    };
    BaseFormCell.prototype.clearValidationOnValueChange = function () {
        if (app.ios) {
            var observable = this.observable();
            this.setupValidationProperties('ValidationViewIsHidden'.toLowerCase(), true);
            observable.setValidationProperties(this._validationProperties);
            var data = {
                validationProperties: {
                    ValidationViewIsHidden: true,
                },
            };
            this.updateCellByProperties(data);
        }
    };
    BaseFormCell.prototype.setTargetSpecifier = function (specifier, redraw) {
        var _this = this;
        if (redraw === void 0) { redraw = true; }
        return this.observable().setTargetSpecifier(specifier).then(function () {
            if (redraw) {
                _this.redraw();
            }
        });
    };
    BaseFormCell.prototype.setValue = function (value, notify, isTextValue) {
        var _this = this;
        return this.observable().setValue(value, notify, isTextValue).then(function () {
            if (_this.observable().valueChanged) {
                return _this.redraw();
            }
        });
    };
    BaseFormCell.prototype.setVisible = function (isVisible, redraw) {
        if (redraw === void 0) { redraw = true; }
        var builder = this.builder;
        builder.setVisible(isVisible);
        if (redraw) {
            this.redrawFromParent();
        }
    };
    BaseFormCell.prototype.onLoaded = function () {
        return Promise.resolve(null);
    };
    BaseFormCell.prototype.setFocus = function (keyboardVisibility) {
        if (this.parent instanceof FormCellContainer_1.FormCellContainer) {
            this.parent.setFocus(this, keyboardVisibility);
        }
        else if (this.parentSection instanceof FormCellSection_1.FormCellSection) {
            this.parentSection.setFocus(this, keyboardVisibility);
        }
    };
    BaseFormCell.prototype.hideLazyLoadingIndicator = function () {
        this._model.hideLazyLoadingIndicator();
    };
    BaseFormCell.prototype.createObservable = function () {
        switch (this.definition().getType()) {
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellDurationPicker:
                return new DurationPickerFormCellObservable_1.DurationPickerFormCellObservable(this, this.definition(), this.page());
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSwitch:
                return new SwitchFormCellObservable_1.SwitchFormCellObservable(this, this.definition(), this.page());
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellButton:
                return new ButtonFormCellObservable_1.ButtonFormCellObservable(this, this.definition(), this.page());
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellDatePicker:
                return new DatePickerFormCellObservable_1.DatePickerFormCellObservable(this, this.definition(), this.page());
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSignatureCapture:
                return new SignatureCaptureFormCellObservable_1.SignatureCaptureFormCellObservable(this, this.definition(), this.page());
            default:
                return new BaseFormCellObservable_1.BaseFormCellObservable(this, this.definition(), this.page());
        }
    };
    BaseFormCell.prototype.setupValidationProperties = function (key, value) {
        var ValidationKeys;
        (function (ValidationKeys) {
            ValidationKeys[ValidationKeys["SeparatorBackgroundColor"] = 0] = "SeparatorBackgroundColor";
            ValidationKeys[ValidationKeys["SeparatorIsHidden"] = 1] = "SeparatorIsHidden";
            ValidationKeys[ValidationKeys["ValidationMessage"] = 2] = "ValidationMessage";
            ValidationKeys[ValidationKeys["ValidationMessageColor"] = 3] = "ValidationMessageColor";
            ValidationKeys[ValidationKeys["ValidationViewBackgroundColor"] = 4] = "ValidationViewBackgroundColor";
            ValidationKeys[ValidationKeys["ValidationViewIsHidden"] = 5] = "ValidationViewIsHidden";
        })(ValidationKeys || (ValidationKeys = {}));
        switch (key) {
            case ValidationKeys[ValidationKeys.SeparatorBackgroundColor].toLowerCase():
                if (typeof value === 'string' && this.isHexColor(value)) {
                    this._validationProperties[ValidationKeys[ValidationKeys.SeparatorBackgroundColor]] = value;
                }
                else {
                    Logger_1.Logger.instance.validation.log(Logger_1.Logger.VALIDATION_NOT_VALID_HEX_COLOR, value, key);
                }
                break;
            case ValidationKeys[ValidationKeys.SeparatorIsHidden].toLowerCase():
                if (typeof value === 'boolean') {
                    this._validationProperties[ValidationKeys[ValidationKeys.SeparatorIsHidden]] = value;
                }
                else {
                    Logger_1.Logger.instance.validation.log(Logger_1.Logger.VALIDATION_NOT_BOOLEAN, value, key);
                }
                break;
            case ValidationKeys[ValidationKeys.ValidationMessage].toLowerCase():
                if (typeof value === 'string') {
                    this._validationProperties[ValidationKeys[ValidationKeys.ValidationMessage]] = value;
                    this._validationProperties[ValidationKeys[ValidationKeys.ValidationViewIsHidden]] = false;
                }
                else {
                    Logger_1.Logger.instance.validation.log(Logger_1.Logger.VALIDATION_NOT_STRING, value, key);
                }
                break;
            case ValidationKeys[ValidationKeys.ValidationMessageColor].toLowerCase():
                if (typeof value === 'string' && this.isHexColor(value)) {
                    this._validationProperties[ValidationKeys[ValidationKeys.ValidationMessageColor]] = value;
                }
                else {
                    Logger_1.Logger.instance.validation.log(Logger_1.Logger.VALIDATION_NOT_VALID_HEX_COLOR, value, key);
                }
                break;
            case ValidationKeys[ValidationKeys.ValidationViewBackgroundColor].toLowerCase():
                if (typeof value === 'string' && this.isHexColor(value)) {
                    this._validationProperties[ValidationKeys[ValidationKeys.ValidationViewBackgroundColor]] = value;
                }
                else {
                    Logger_1.Logger.instance.validation.log(Logger_1.Logger.VALIDATION_NOT_VALID_HEX_COLOR, value, key);
                }
                break;
            case ValidationKeys[ValidationKeys.ValidationViewIsHidden].toLowerCase():
                if (typeof value === 'boolean') {
                    this._validationProperties[ValidationKeys[ValidationKeys.ValidationViewIsHidden]] = value;
                }
                else {
                    Logger_1.Logger.instance.validation.log(Logger_1.Logger.VALIDATION_NOT_BOOLEAN, value, key);
                }
                break;
            default:
                Logger_1.Logger.instance.validation.log(Logger_1.Logger.VALIDATION_NOT_SUPPORTED_PROPERTY, key);
                break;
        }
    };
    BaseFormCell.prototype.isHexColor = function (color) {
        return /^[0-9A-F]{6}$/i.test(color);
    };
    return BaseFormCell;
}(BaseControl_1.BaseControl));
exports.BaseFormCell = BaseFormCell;
