"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var OpenBarcodeScannerActionDefinition_1 = require("../definitions/actions/OpenBarcodeScannerActionDefinition");
var mdk_sap_1 = require("mdk-sap");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var OpenBarcodeScannerAction = (function (_super) {
    __extends(OpenBarcodeScannerAction, _super);
    function OpenBarcodeScannerAction(actionDefinition) {
        var _this = _super.call(this, actionDefinition) || this;
        _this.finishedScanningWithResults = function (results) {
            _this.resolveScanning(new ActionResultBuilder_1.ActionResultBuilder().data(results).build());
        };
        _this.failedScanningWithMessage = function (message) {
            _this.resolveScanning(new ActionResultBuilder_1.ActionResultBuilder().error(message).failed().build());
        };
        _this.errorScanningWithMessage = function (message) {
            _this.resolveScanning(new ActionResultBuilder_1.ActionResultBuilder().error(message).valid(false).build());
        };
        if (!(actionDefinition instanceof OpenBarcodeScannerActionDefinition_1.OpenBarcodeScannerActionDefinition)) {
            throw new Error('Cannot instantiate OpenBarcodeScannerAction without OpenBarcodeScannerActionDefinition');
        }
        _this.params = actionDefinition;
        return _this;
    }
    OpenBarcodeScannerAction.prototype.execute = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.resolveScanning = resolve;
            new mdk_sap_1.BarcodeScannerBridge().open(_this.params, _this);
        });
    };
    return OpenBarcodeScannerAction;
}(BaseAction_1.BaseAction));
exports.OpenBarcodeScannerAction = OpenBarcodeScannerAction;
;
