"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var Toaster = (function () {
    function Toaster() {
        this.toasterBridge = ToastMessageViewBridge.new();
        if (Toaster._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.TOASTER_INSTANTIATION_FAILED);
        }
        Toaster._instance = this;
    }
    Toaster.getInstance = function () {
        return Toaster._instance;
    };
    Toaster.prototype.display = function (params) {
        this.toasterBridge.displayToastMessage(params);
    };
    Toaster.prototype.relocate = function (frame, bottomOffset) {
    };
    Toaster._instance = new Toaster();
    return Toaster;
}());
exports.Toaster = Toaster;
;
