"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Application_1 = require("../Application");
var BaseAction_1 = require("./BaseAction");
var ChangeUserPasscodeActionDefinition_1 = require("../definitions/actions/ChangeUserPasscodeActionDefinition");
var ClientSettings_1 = require("../storage/ClientSettings");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var WelcomePage_1 = require("../pages/WelcomePage");
var Logger_1 = require("../utils/Logger");
var app = require("tns-core-modules/application");
var ChangeUserPasscodeAction = (function (_super) {
    __extends(ChangeUserPasscodeAction, _super);
    function ChangeUserPasscodeAction(definition) {
        var _this = this;
        if (!(definition instanceof ChangeUserPasscodeActionDefinition_1.ChangeUserPasscodeActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_CHANGEUSERPASSCODEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    ChangeUserPasscodeAction.postExecute = function (execStatus, errMsg) {
        if (errMsg === void 0) { errMsg = undefined; }
        if (execStatus === 'Success') {
            ChangeUserPasscodeAction.resolvePromise(new ActionResultBuilder_1.ActionResultBuilder().build());
        }
        else if (execStatus === 'Canceled') {
            ChangeUserPasscodeAction.rejectPromise(new ActionResultBuilder_1.ActionResultBuilder().canceled().build());
        }
        else {
            ChangeUserPasscodeAction.rejectPromise(new ActionResultBuilder_1.ActionResultBuilder().failed().data(errMsg).build());
        }
    };
    ChangeUserPasscodeAction.prototype.execute = function () {
        return new Promise(function (resolve, reject) {
            ChangeUserPasscodeAction.resolvePromise = resolve;
            ChangeUserPasscodeAction.rejectPromise = reject;
            if (!ClientSettings_1.ClientSettings.isDemoMode()) {
                ClientSettings_1.ClientSettings.isUserChangingPasscode = true;
                Application_1.Application.setResumeEventDelayed(true);
                if (app.ios) {
                    return WelcomePage_1.WelcomePage.changeUserPasscode().then(function () {
                        Logger_1.Logger.instance.action.info('Change passcode success');
                        ChangeUserPasscodeAction.postExecute('Success');
                    }).catch(function (err) {
                        Logger_1.Logger.instance.action.error(err);
                        if (err.message.includes('PASSCODE_CHANGE_CANCELED')) {
                            ChangeUserPasscodeAction.postExecute('Canceled', err.message);
                        }
                        else {
                            if (err.message.includes(':Reset Client')) {
                                ChangeUserPasscodeAction.postExecute('Canceled', err.message);
                                WelcomePage_1.WelcomePage.resetClientHelper();
                            }
                            else {
                                ChangeUserPasscodeAction.postExecute('Failure', err.message);
                            }
                        }
                    }).then(function () {
                        ClientSettings_1.ClientSettings.isUserChangingPasscode = false;
                        Application_1.Application.setResumeEventDelayed(false);
                        var resumeEventData = Application_1.Application.getPendingResumeEventData();
                        if (resumeEventData !== null || resumeEventData !== undefined) {
                            Application_1.Application.onResume(resumeEventData);
                            Application_1.Application.setPendingResumeEventData(null);
                        }
                    });
                }
                else if (app.android) {
                    if (ClientSettings_1.ClientSettings.getPasscodeSource() === ClientSettings_1.PasscodeSource.UserOnboardedWithoutPasscode) {
                        throw new Error('Cannot change passcode. No user passcode was set at onboarding.');
                    }
                    return WelcomePage_1.WelcomePage.changeUserPasscode();
                }
                else {
                    return WelcomePage_1.WelcomePage.changeUserPasscode().then(function () {
                        ChangeUserPasscodeAction.postExecute('Failure');
                    });
                }
            }
            else {
                throw new Error('Cannot change passcode in demo mode.');
            }
        });
    };
    return ChangeUserPasscodeAction;
}(BaseAction_1.BaseAction));
exports.ChangeUserPasscodeAction = ChangeUserPasscodeAction;
;
