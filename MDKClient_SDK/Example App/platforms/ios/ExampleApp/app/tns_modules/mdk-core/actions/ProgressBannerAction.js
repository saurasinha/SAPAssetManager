"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var BaseAction_1 = require("./BaseAction");
var mdk_sap_1 = require("mdk-sap");
var BannerDataBuilder_1 = require("../builders/ui/BannerDataBuilder");
var IBannerData_1 = require("mdk-sap/BannerMessage/IBannerData");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ProgressBannerActionDefinition_1 = require("../definitions/actions/ProgressBannerActionDefinition");
var MDKPage_1 = require("../pages/MDKPage");
var MDKFrame_1 = require("../pages/MDKFrame");
var app = require("tns-core-modules/application");
var ClientEnums_1 = require("../ClientEnums");
var EventHandler_1 = require("../EventHandler");
var CommonUtil_1 = require("../utils/CommonUtil");
var TabFrame_1 = require("../pages/TabFrame");
var ProgressBannerAction = (function (_super) {
    __extends(ProgressBannerAction, _super);
    function ProgressBannerAction(definition) {
        var _this = this;
        if (!(definition instanceof ProgressBannerActionDefinition_1.ProgressBannerActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_BANNERMESSAGEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        _this.alwaysParentIfChildIsTabs = true;
        return _this;
    }
    ProgressBannerAction.activeProgressBannerAction = function () {
        return ProgressBannerAction._activeInstance;
    };
    ProgressBannerAction.prototype.execute = function () {
        ProgressBannerAction._activeInstance = this;
        return this._displayProgressBanner();
    };
    ;
    ProgressBannerAction.prototype.onCompletion = function (result) {
        var _this = this;
        ProgressBannerAction._activeInstance = undefined;
        var def = this.definition;
        var bannerTypeOnCompletion = null;
        if (result.status === ClientEnums_1.ActionExecutionStatus.Failed || !def.completionMessage
            || def.completionMessage === '') {
            bannerTypeOnCompletion = IBannerData_1.BannerType.progress;
        }
        else {
            bannerTypeOnCompletion = IBannerData_1.BannerType.progressCompletion;
        }
        var alwaysParentIfChildIsTabs = app.ios ? this._alwaysParentIfChildIsTabs : false;
        var sourceFrameId = this.sourceFrameId;
        var topFrame = MDKFrame_1.MDKFrame.getCorrectTopmostFrame(null, alwaysParentIfChildIsTabs, sourceFrameId, sourceFrameId ? true : false);
        if (this.anchoredFrame) {
            topFrame = this.anchoredFrame;
        }
        this.anchoredFrame = null;
        var builder = new BannerDataBuilder_1.BannerDataBuilder(this.context());
        var bannerPromise;
        if (bannerTypeOnCompletion === IBannerData_1.BannerType.progress) {
            builder.setType(IBannerData_1.BannerType.progress);
            bannerPromise = builder.build().then(function (data) {
                mdk_sap_1.Banner.getInstance().dismiss(data);
            });
        }
        else if (bannerTypeOnCompletion === IBannerData_1.BannerType.progressCompletion) {
            var duration = def.completionTimeout;
            builder.setMessage(def.completionMessage)
                .setTopFrame(topFrame)
                .setType(IBannerData_1.BannerType.progressCompletion)
                .setDuration(duration)
                .setAnimated(def.animated)
                .setCompletionActionLabel(def.completionActionLabel)
                .setOnCompletionActionLabelPress(def.onCompletionActionLabelPress)
                .setDismissBannerOnAction(def.dismissBannerOnAction);
            bannerPromise = builder.build().then(function (data) {
                mdk_sap_1.Banner.getInstance().display(data, _this);
            });
        }
        else {
            bannerPromise = Promise.resolve();
        }
        return bannerPromise.then(function () {
            return new ActionResultBuilder_1.ActionResultBuilder().build();
        }).catch(function (error) {
            mdk_sap_1.Banner.getInstance().display(builder.buildError(error.message, topFrame, IBannerData_1.BannerType.progressCompletion), _this);
            throw (error);
        });
    };
    ProgressBannerAction.prototype.updateProgressBanner = function (message) {
        var alwaysParentIfChildIsTabs = app.ios ? this._alwaysParentIfChildIsTabs : false;
        var sourceFrameId = this.source && this.source.frameId ? this.source.frameId : null;
        var topFrame = MDKFrame_1.MDKFrame.getCorrectTopmostFrame(null, alwaysParentIfChildIsTabs, sourceFrameId, sourceFrameId ? true : false);
        if (this.anchoredFrame) {
            topFrame = this.anchoredFrame;
        }
        mdk_sap_1.Banner.getInstance().updateText(message, topFrame);
    };
    ProgressBannerAction.updateAnchoredFrame = function (frame) {
        if (ProgressBannerAction.activeProgressBannerAction()) {
            ProgressBannerAction.activeProgressBannerAction().anchoredFrame = frame;
        }
    };
    ProgressBannerAction.prototype._displayProgressBanner = function (message) {
        var _this = this;
        ProgressBannerAction._activeInstance = this;
        var alwaysParentIfChildIsTabs = app.ios ? this._alwaysParentIfChildIsTabs : false;
        var sourceFrameId = this.source && this.source.frameId ? this.source.frameId : null;
        var topFrame = MDKFrame_1.MDKFrame.getCorrectTopmostFrame(null, alwaysParentIfChildIsTabs, sourceFrameId, sourceFrameId ? true : false);
        topFrame = TabFrame_1.TabFrame.getBannerTopFrame(topFrame);
        if (this.anchoredFrame) {
            topFrame = this.anchoredFrame;
        }
        else {
            this.anchoredFrame = topFrame;
        }
        var def = this.definition;
        var builder = new BannerDataBuilder_1.BannerDataBuilder(this.context());
        builder.setMessage(message ? message : def.message)
            .setTopFrame(topFrame)
            .setType(IBannerData_1.BannerType.progress)
            .setAnimated(def.animated)
            .setActionLabel(def.actionLabel)
            .setOnActionLabelPress(def.onActionLabelPress)
            .setDismissBannerOnAction(def.dismissBannerOnAction);
        return builder.build().then(function (data) {
            mdk_sap_1.Banner.getInstance().display(data, _this);
            return new ActionResultBuilder_1.ActionResultBuilder().build();
        }).catch(function (error) {
            ProgressBannerAction._activeInstance = undefined;
            _this.anchoredFrame = null;
            mdk_sap_1.Banner.getInstance().display(builder.buildError(error.message, topFrame, IBannerData_1.BannerType.standard), _this);
            _this._updateProgressBar(topFrame);
            throw (error);
        });
    };
    ProgressBannerAction.prototype._updateProgressBar = function (topFrame) {
        var mdkPage = topFrame.currentPage instanceof MDKPage_1.MDKPage ? topFrame.currentPage : null;
        if (mdkPage) {
            mdkPage.updateProgressBar();
        }
    };
    ProgressBannerAction.prototype.onActionLabelPress = function () {
        var def = this.definition;
        var onActionLabelPressValue = def.onActionLabelPress;
        var onActionLabelPress = CommonUtil_1.CommonUtil.getJSONObject(onActionLabelPressValue);
        if (onActionLabelPress) {
            return new EventHandler_1.EventHandler().executeActionOrRule(onActionLabelPress, this.context());
        }
        return Promise.resolve();
    };
    ProgressBannerAction.prototype.onCompletionActionLabelPress = function () {
        var def = this.definition;
        var onCompletionActionLabelPressValue = def.onCompletionActionLabelPress;
        var onCompletionActionLabelPress = CommonUtil_1.CommonUtil.getJSONObject(onCompletionActionLabelPressValue);
        if (onCompletionActionLabelPress) {
            return new EventHandler_1.EventHandler().executeActionOrRule(onCompletionActionLabelPress, this.context());
        }
        return Promise.resolve();
    };
    return ProgressBannerAction;
}(BaseAction_1.BaseAction));
exports.ProgressBannerAction = ProgressBannerAction;
;
