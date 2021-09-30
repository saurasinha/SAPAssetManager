"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var VerifyPasscodeActionDefinition_1 = require("../definitions/actions/VerifyPasscodeActionDefinition");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var VerifyPasscodeDataBuilder_1 = require("../builders/actions/VerifyPasscodeDataBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ClientSettings_1 = require("../storage/ClientSettings");
var WelcomePage_1 = require("../pages/WelcomePage");
var Logger_1 = require("../utils/Logger");
var app = require("tns-core-modules/application");
var VerifyPasscodeAction = (function (_super) {
    __extends(VerifyPasscodeAction, _super);
    function VerifyPasscodeAction(definition) {
        var _this = this;
        if (!(definition instanceof VerifyPasscodeActionDefinition_1.VerifyPasscodeActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_VERIFYPASSCODEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    VerifyPasscodeAction.postExecute = function (execStatus, errMsg) {
        if (errMsg === void 0) { errMsg = undefined; }
        if (execStatus === 'Success') {
            VerifyPasscodeAction.resolvePromise(new ActionResultBuilder_1.ActionResultBuilder().build());
        }
        else if (execStatus === 'Canceled') {
            VerifyPasscodeAction.rejectPromise(new ActionResultBuilder_1.ActionResultBuilder().canceled().build());
        }
        else {
            VerifyPasscodeAction.rejectPromise(new ActionResultBuilder_1.ActionResultBuilder().failed().data(errMsg).build());
        }
    };
    VerifyPasscodeAction.prototype.execute = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            VerifyPasscodeAction.resolvePromise = resolve;
            VerifyPasscodeAction.rejectPromise = reject;
            var definition = _this.definition;
            var builder = new VerifyPasscodeDataBuilder_1.VerifyPasscodeDataBuilder(_this.context());
            builder.setAllowCancel(definition.getAllowCancel());
            return builder.build().then(function (data) {
                if (ClientSettings_1.ClientSettings.isDemoMode()) {
                    VerifyPasscodeAction.postExecute('Success');
                }
                else {
                    ClientSettings_1.ClientSettings.isVerifyingPasscode = true;
                    if (app.ios) {
                        return WelcomePage_1.WelcomePage.verifyPasscode(data).then(function () {
                            VerifyPasscodeAction.postExecute('Success');
                        }).catch(function (err) {
                            Logger_1.Logger.instance.action.error(err);
                            ClientSettings_1.ClientSettings.isVerifyingPasscode = false;
                            if (err.message.includes(':Reset Client')) {
                                VerifyPasscodeAction.postExecute('Canceled', err.message);
                                WelcomePage_1.WelcomePage.resetClientHelper();
                            }
                            else {
                                VerifyPasscodeAction.postExecute('Failure', err.message);
                            }
                        });
                    }
                    else if (app.android) {
                        return WelcomePage_1.WelcomePage.verifyPasscode(data);
                    }
                    else {
                        return WelcomePage_1.WelcomePage.verifyPasscode(data).then(function () {
                            VerifyPasscodeAction.postExecute('Success');
                        });
                    }
                }
            });
        });
    };
    return VerifyPasscodeAction;
}(BaseAction_1.BaseAction));
exports.VerifyPasscodeAction = VerifyPasscodeAction;
