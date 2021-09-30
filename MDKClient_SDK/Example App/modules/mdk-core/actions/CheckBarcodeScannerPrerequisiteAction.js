"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var CheckBarcodeScannerPrerequisiteActionDefinition_1 = require("../definitions/actions/CheckBarcodeScannerPrerequisiteActionDefinition");
var mdk_sap_1 = require("mdk-sap");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var CheckBarcodeScannerPrerequisiteAction = (function (_super) {
    __extends(CheckBarcodeScannerPrerequisiteAction, _super);
    function CheckBarcodeScannerPrerequisiteAction(actionDefinition) {
        var _this = _super.call(this, actionDefinition) || this;
        if (!(actionDefinition instanceof CheckBarcodeScannerPrerequisiteActionDefinition_1.CheckBarcodeScannerPrerequisiteActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_CHECKBARCODESCANNERPREREQUISITEACTION_WITHOUT_DEFINITION);
        }
        _this.params = actionDefinition;
        return _this;
    }
    CheckBarcodeScannerPrerequisiteAction.prototype.execute = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.resolvePromise = resolve;
            new mdk_sap_1.BarcodeScannerBridge().checkPrerequisite(_this.params, _this);
        });
    };
    CheckBarcodeScannerPrerequisiteAction.prototype.finishedCheckingWithResults = function (result) {
        this.resolvePromise(new ActionResultBuilder_1.ActionResultBuilder().data(result).build());
    };
    CheckBarcodeScannerPrerequisiteAction.prototype.failedCheckingWithErrors = function (result) {
        this.resolvePromise(new ActionResultBuilder_1.ActionResultBuilder().error(result).failed().build());
    };
    CheckBarcodeScannerPrerequisiteAction.prototype.finishedCheckingWithErrors = function (newValue) {
        this.resolvePromise(new ActionResultBuilder_1.ActionResultBuilder().error(newValue).valid(false).build());
    };
    CheckBarcodeScannerPrerequisiteAction.prototype.finishedScanningWithResults = function () {
    };
    CheckBarcodeScannerPrerequisiteAction.prototype.finishedScanningWithErrors = function () {
    };
    return CheckBarcodeScannerPrerequisiteAction;
}(BaseAction_1.BaseAction));
exports.CheckBarcodeScannerPrerequisiteAction = CheckBarcodeScannerPrerequisiteAction;
;
