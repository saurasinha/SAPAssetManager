"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var ToastMessageActionDefinition_1 = require("../definitions/actions/ToastMessageActionDefinition");
var mdk_sap_1 = require("mdk-sap");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ToastDataBuilder_1 = require("../builders/ui/ToastDataBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var IMDKPage_1 = require("../pages/IMDKPage");
var TabFrame_1 = require("../pages/TabFrame");
var ToastMessageAction = (function (_super) {
    __extends(ToastMessageAction, _super);
    function ToastMessageAction(definition) {
        var _this = this;
        if (!(definition instanceof ToastMessageActionDefinition_1.ToastMessageActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_TOASTMESSAGEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        _this.alwaysParentIfChildIsTabs = true;
        return _this;
    }
    ToastMessageAction.prototype.execute = function () {
        var builder = new ToastDataBuilder_1.ToastDataBuilder(this.context());
        var def = this.definition;
        var background = TabFrame_1.TabFrame.getCorrectTopmostFrame(this._source, this._alwaysParentIfChildIsTabs);
        var getToolbarHeight;
        if (background) {
            var wrapper = background.currentPage;
            if (IMDKPage_1.isMDKPage(wrapper)) {
                getToolbarHeight = background.currentPage.getToolbar().then(function (toolbar) {
                    return toolbar ? toolbar.view().getMeasuredHeight() : 0;
                });
            }
        }
        if (!getToolbarHeight) {
            getToolbarHeight = Promise.resolve(0);
        }
        return getToolbarHeight.then(function (toolbarHeight) {
            builder.setBackground(background)
                .setMessage(def.message)
                .setIcon(def.icon)
                .setIsIconHidden(def.isIconHidden)
                .setMaxNumberOfLines(def.maxNumberOfLines)
                .setDuration(def.duration)
                .setAnimated(def.animated)
                .setBottomOffset(toolbarHeight);
            return builder.build().then(function (data) {
                mdk_sap_1.Toaster.getInstance().display(data);
                return new ActionResultBuilder_1.ActionResultBuilder().build();
            }).catch(function (error) {
                var message = error.message;
                mdk_sap_1.Toaster.getInstance().display({ message: message, background: background, bottomOffset: toolbarHeight });
                throw (error);
            });
        });
    };
    return ToastMessageAction;
}(BaseAction_1.BaseAction));
exports.ToastMessageAction = ToastMessageAction;
;
