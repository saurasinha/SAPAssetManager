"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var CheckRequiredFieldsActionDefinition_1 = require("../definitions/actions/CheckRequiredFieldsActionDefinition");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var app = require("tns-core-modules/application");
var CheckRequiredFieldsAction = (function (_super) {
    __extends(CheckRequiredFieldsAction, _super);
    function CheckRequiredFieldsAction(definition) {
        var _this = this;
        if (!(definition instanceof CheckRequiredFieldsActionDefinition_1.CheckRequiredFieldsActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_CHECKREQUIREDFIELDACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    CheckRequiredFieldsAction.prototype.execute = function () {
        var _this = this;
        var oContext = this.context();
        var page = oContext.element;
        var aMissingRequiredControls = [];
        var errorMessage = 'The following required fields are missing: ';
        var resultMessage = 'All required fields validation success';
        var succeeded = true;
        var oFormCellContainer = page.findFormCellContainerOnPage();
        if (!oFormCellContainer) {
            throw new Error(ErrorMessage_1.ErrorMessage.FORMCELL_NOT_FOUND);
        }
        return this.getRequiredFieldsArray().then(function (aRequiredFields) {
            if (aRequiredFields.length === 0) {
                return new ActionResultBuilder_1.ActionResultBuilder().build();
            }
            if (aRequiredFields.length > 0) {
                var aFormCellControls = oFormCellContainer.controls;
                for (var _i = 0, aFormCellControls_1 = aFormCellControls; _i < aFormCellControls_1.length; _i++) {
                    var control = aFormCellControls_1[_i];
                    var controlName = control.definition().getName();
                    var result = aRequiredFields.indexOf(controlName);
                    if (result >= 0) {
                        var value = control.observable().getValue();
                        if ((app.ios && value instanceof NSArray && value.count === 0)
                            ||
                                (value === null || value === undefined
                                    || (typeof value === 'string' && value.trim() === '')
                                    || (Array.isArray(value) && (value.length === 0 || !value[0])))) {
                            aMissingRequiredControls.push(control);
                            errorMessage += controlName + ' ';
                        }
                    }
                }
                if (aMissingRequiredControls.length > 0) {
                    resultMessage = errorMessage;
                    succeeded = false;
                    _this.context().clientAPIProps.missingRequiredControls = aMissingRequiredControls;
                }
                _this._debugLog(resultMessage);
                if (succeeded) {
                    return new ActionResultBuilder_1.ActionResultBuilder().build();
                }
                return new ActionResultBuilder_1.ActionResultBuilder().failed().data(aMissingRequiredControls).build();
            }
        });
    };
    CheckRequiredFieldsAction.prototype.getRequiredFieldsArray = function () {
        var definition = this.definition;
        var aRequiredFields = definition.getRequiredFields();
        if (Array.isArray(aRequiredFields)) {
            return Promise.resolve(aRequiredFields);
        }
        else if (typeof (aRequiredFields) === 'string') {
            return this._resolveValue(aRequiredFields).then(function (result) {
                if (Array.isArray(result)) {
                    return Promise.resolve(result);
                }
                else {
                    return result.split(',');
                }
            });
        }
        return Promise.resolve([]);
    };
    return CheckRequiredFieldsAction;
}(BaseAction_1.BaseAction));
exports.CheckRequiredFieldsAction = CheckRequiredFieldsAction;
;
