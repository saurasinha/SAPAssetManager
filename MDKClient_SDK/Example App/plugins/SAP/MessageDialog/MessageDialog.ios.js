"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var dialogs = require("tns-core-modules/ui/dialogs");
var MessageDialog = (function () {
    function MessageDialog() {
        if (MessageDialog._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.MESSAGEDIALIOG_INSTANTIATION_FAILED);
        }
        MessageDialog._instance = this;
    }
    MessageDialog.getInstance = function () {
        return MessageDialog._instance;
    };
    MessageDialog.prototype.alert = function (arg) {
        return new Promise(function (resolve, reject) {
            try {
                dialogs.alert(arg).then(function () {
                    resolve();
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    MessageDialog.prototype.confirm = function (arg) {
        return new Promise(function (resolve, reject) {
            try {
                dialogs.confirm(arg).then(function (result) {
                    resolve(result);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    MessageDialog.prototype.closeAll = function () {
    };
    MessageDialog._instance = new MessageDialog();
    return MessageDialog;
}());
exports.MessageDialog = MessageDialog;
;
