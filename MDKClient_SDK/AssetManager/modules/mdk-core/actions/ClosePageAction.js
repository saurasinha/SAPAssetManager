"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var ClosePageActionDefinition_1 = require("../definitions/actions/ClosePageActionDefinition");
var MDKPage_1 = require("../pages/MDKPage");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var Logger_1 = require("../utils/Logger");
var ModalFrame_1 = require("../pages/ModalFrame");
var ClosePageActionBuilder_1 = require("../builders/actions/ClosePageActionBuilder");
var MDKFrame_1 = require("../pages/MDKFrame");
var ClosePageAction = (function (_super) {
    __extends(ClosePageAction, _super);
    function ClosePageAction(definition) {
        var _this = this;
        if (!(definition instanceof ClosePageActionDefinition_1.ClosePageActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_CLOSEPAGEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        _this.alwaysParentIfChildIsTabs = true;
        return _this;
    }
    ClosePageAction.prototype.execute = function () {
        var _this = this;
        var definition = this.definition;
        var topFrame = MDKFrame_1.MDKFrame.getCorrectTopmostFrame(this._source, this._alwaysParentIfChildIsTabs, this.sourceFrameId);
        var page = topFrame.currentPage;
        if (!page) {
            var reason = "Page '" + page + "' not found for ClosePageAction";
            Logger_1.Logger.instance.action.error(reason);
            return Promise.resolve(new ActionResultBuilder_1.ActionResultBuilder().failed().data(reason).build());
        }
        var builder = new ClosePageActionBuilder_1.ClosePageActionBuilder(this.context());
        builder.setDismissModal(definition.dismissModal).setCancelPendingActions(definition.cancelPendingActions);
        return builder.build().then(function (params) {
            var closeState = _this.closeState(params);
            if (closeState.canceled && closeState.completed) {
                Logger_1.Logger.instance.action.log(_this.name + " conflicting close state: " + closeState + " \n          existing modal will be canceled");
            }
            if (ModalFrame_1.ModalFrame.isModal(page.frame) &&
                (closeState.completed || closeState.canceled || page.frame.backStack.length === 0)) {
                var parentPage = page.frame.parentPage;
                ModalFrame_1.ModalFrame.close(page, closeState.canceled);
                return parentPage.waitUntilModalDismissed().then(function () {
                    Logger_1.Logger.instance.action.log(_this.name + " closed cancelPendingActions:\u00A0" + definition.cancelPendingActions);
                    return Promise.resolve(new ActionResultBuilder_1.ActionResultBuilder().build());
                });
            }
            else {
                if (page.previousPage instanceof MDKPage_1.MDKPage) {
                    page.previousPage.redrawStaleDataListeners();
                }
                topFrame.goBack();
            }
            Logger_1.Logger.instance.action.log(_this.name + " closed cancelPendingActions:\u00A0" + definition.cancelPendingActions);
            return Promise.resolve(new ActionResultBuilder_1.ActionResultBuilder().build());
        });
    };
    ClosePageAction.prototype.closeState = function (params) {
        var canceled = false;
        var completed = false;
        if (params.cancelPendingActions) {
            canceled = params.cancelPendingActions;
        }
        else if (params.dismissModal) {
            canceled = params.dismissModal === ClosePageActionDefinition_1.ClosePageActionDefinition.dismissModalType.Canceled;
        }
        if (params.dismissModal) {
            completed = params.dismissModal === ClosePageActionDefinition_1.ClosePageActionDefinition.dismissModalType.Completed;
        }
        return { canceled: canceled, completed: completed };
    };
    return ClosePageAction;
}(BaseAction_1.BaseAction));
exports.ClosePageAction = ClosePageAction;
;
