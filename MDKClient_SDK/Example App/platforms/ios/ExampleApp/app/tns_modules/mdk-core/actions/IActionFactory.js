"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var IActionFactory = (function () {
    function IActionFactory() {
    }
    IActionFactory.setCreateFunction = function (func) {
        this._Create = func;
    };
    IActionFactory.setCreateActionRunnerFunction = function (func) {
        this._CreateActionRunner = func;
    };
    IActionFactory.Create = function (definition) {
        if (!this._Create) {
            throw new Error(ErrorMessage_1.ErrorMessage.IACTIONFACTORY_CREATE_INVOKED_NOT_ASSIGNED);
        }
        return this._Create(definition);
    };
    IActionFactory.CreateActionRunner = function (definition) {
        if (!this._CreateActionRunner) {
            throw new Error(ErrorMessage_1.ErrorMessage.IACTIONFACTORY_CREATEACTIONRUNNER_INVOKED_NOT_ASSIGNED);
        }
        return this._CreateActionRunner(definition);
    };
    return IActionFactory;
}());
exports.IActionFactory = IActionFactory;
