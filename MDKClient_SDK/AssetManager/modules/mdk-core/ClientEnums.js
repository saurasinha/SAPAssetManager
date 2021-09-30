"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionExecutionStatus;
(function (ActionExecutionStatus) {
    ActionExecutionStatus[ActionExecutionStatus["Failed"] = -1] = "Failed";
    ActionExecutionStatus[ActionExecutionStatus["Success"] = 0] = "Success";
    ActionExecutionStatus[ActionExecutionStatus["Invalid"] = 1] = "Invalid";
    ActionExecutionStatus[ActionExecutionStatus["Valid"] = 2] = "Valid";
    ActionExecutionStatus[ActionExecutionStatus["Pending"] = 3] = "Pending";
    ActionExecutionStatus[ActionExecutionStatus["Canceled"] = 4] = "Canceled";
})(ActionExecutionStatus = exports.ActionExecutionStatus || (exports.ActionExecutionStatus = {}));
