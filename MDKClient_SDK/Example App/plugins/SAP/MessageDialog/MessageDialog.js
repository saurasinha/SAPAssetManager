"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageDialog = (function () {
    function MessageDialog() {
    }
    MessageDialog.getInstance = function () {
        return MessageDialog._instance;
    };
    MessageDialog.prototype.alert = function (arg) {
        return Promise.resolve();
    };
    MessageDialog.prototype.confirm = function (arg) {
        return Promise.resolve(false);
    };
    MessageDialog.prototype.setScreenSharing = function (screenSharing) {
    };
    MessageDialog.prototype.closeAll = function () {
    };
    MessageDialog._instance = new MessageDialog();
    return MessageDialog;
}());
exports.MessageDialog = MessageDialog;
;
