"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientEnums_1 = require("../../ClientEnums");
var ActionResultBuilder = (function () {
    function ActionResultBuilder() {
        this._actionResult = { data: undefined, error: undefined, status: ClientEnums_1.ActionExecutionStatus.Success, enabled: true };
    }
    ActionResultBuilder.implementsIActionResult = function (obj) {
        if (obj !== undefined && obj !== null && typeof (obj) !== 'string') {
            var actionResult = obj;
            return ('data' in actionResult && 'error' in actionResult &&
                'status' in actionResult && 'enabled' in actionResult);
        }
        else {
            return false;
        }
    };
    ActionResultBuilder.prototype.build = function () {
        return this._actionResult;
    };
    ActionResultBuilder.prototype.canceled = function () {
        this.status(ClientEnums_1.ActionExecutionStatus.Canceled);
        return this;
    };
    ActionResultBuilder.prototype.data = function (data) {
        this._actionResult.data = data;
        return this;
    };
    ActionResultBuilder.prototype.error = function (error) {
        this._actionResult.error = error;
        return this;
    };
    ActionResultBuilder.prototype.enabled = function (enabled) {
        this._actionResult.enabled = enabled;
        return this;
    };
    ActionResultBuilder.prototype.failed = function () {
        this.status(ClientEnums_1.ActionExecutionStatus.Failed);
        return this;
    };
    ActionResultBuilder.prototype.status = function (status) {
        this._actionResult.status = status;
        return this;
    };
    ActionResultBuilder.prototype.valid = function (valid) {
        this._actionResult.status = valid ? ClientEnums_1.ActionExecutionStatus.Valid : ClientEnums_1.ActionExecutionStatus.Invalid;
        return this;
    };
    ActionResultBuilder.prototype.pending = function () {
        this._actionResult.status = ClientEnums_1.ActionExecutionStatus.Pending;
        return this;
    };
    return ActionResultBuilder;
}());
exports.ActionResultBuilder = ActionResultBuilder;
