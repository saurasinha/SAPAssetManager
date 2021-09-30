"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var Logger_1 = require("../../utils/Logger");
var DefaultTargetPathErrorHandler = (function () {
    function DefaultTargetPathErrorHandler() {
        if (DefaultTargetPathErrorHandler.instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.INITIALIZE_FAIL_SHOULD_USE_GETINSTANCE);
        }
        DefaultTargetPathErrorHandler.instance = this;
    }
    DefaultTargetPathErrorHandler.getInstance = function () {
        return DefaultTargetPathErrorHandler.instance;
    };
    DefaultTargetPathErrorHandler.prototype.error = function (message) {
        Logger_1.Logger.instance.targetPath.error(message);
    };
    DefaultTargetPathErrorHandler.instance = new DefaultTargetPathErrorHandler();
    return DefaultTargetPathErrorHandler;
}());
exports.DefaultTargetPathErrorHandler = DefaultTargetPathErrorHandler;
