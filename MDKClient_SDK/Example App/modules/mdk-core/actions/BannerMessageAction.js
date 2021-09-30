"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var BannerMessageActionDefinition_1 = require("../definitions/actions/BannerMessageActionDefinition");
var mdk_sap_1 = require("mdk-sap");
var BannerDataBuilder_1 = require("../builders/ui/BannerDataBuilder");
var IBannerData_1 = require("mdk-sap/BannerMessage/IBannerData");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var MDKFrame_1 = require("../pages/MDKFrame");
var app = require("tns-core-modules/application");
var EventHandler_1 = require("../EventHandler");
var CommonUtil_1 = require("../utils/CommonUtil");
var TabFrame_1 = require("../pages/TabFrame");
var BannerMessageAction = (function (_super) {
    __extends(BannerMessageAction, _super);
    function BannerMessageAction(definition) {
        var _this = this;
        if (!(definition instanceof BannerMessageActionDefinition_1.BannerMessageActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_BANNERMESSAGEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        _this.alwaysParentIfChildIsTabs = true;
        return _this;
    }
    BannerMessageAction.prototype.execute = function () {
        var _this = this;
        var alwaysParentIfChildIsTabs = app.ios ? this._alwaysParentIfChildIsTabs : false;
        var sourceFrameId = this.sourceFrameId;
        var topFrame = MDKFrame_1.MDKFrame.getCorrectTopmostFrame(null, alwaysParentIfChildIsTabs, sourceFrameId, sourceFrameId ? true : false);
        topFrame = TabFrame_1.TabFrame.getBannerTopFrame(topFrame);
        var def = this.definition;
        var builder = new BannerDataBuilder_1.BannerDataBuilder(this.context());
        builder.setMessage(def.Message).setTopFrame(topFrame).setType(IBannerData_1.BannerType.standard)
            .setDuration(def.Duration).setAnimated(def.Animated)
            .setActionLabel(def.ActionLabel)
            .setOnActionLabelPress(def.OnActionLabelPress)
            .setDismissBannerOnAction(def.DismissBannerOnAction);
        return builder.build().then(function (data) {
            mdk_sap_1.Banner.getInstance().display(data, _this);
            return new ActionResultBuilder_1.ActionResultBuilder().build();
        }).catch(function (error) {
            mdk_sap_1.Banner.getInstance().display(builder.buildError(error.message, topFrame, IBannerData_1.BannerType.standard), _this);
            throw (error);
        });
    };
    ;
    BannerMessageAction.prototype.onActionLabelPress = function () {
        var def = this.definition;
        var onActionLabelPressValue = def.OnActionLabelPress;
        var onActionLabelPress = CommonUtil_1.CommonUtil.getJSONObject(onActionLabelPressValue);
        if (onActionLabelPress) {
            return new EventHandler_1.EventHandler().executeActionOrRule(onActionLabelPress, this.context());
        }
        return Promise.resolve();
    };
    return BannerMessageAction;
}(BaseAction_1.BaseAction));
exports.BannerMessageAction = BannerMessageAction;
