"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var PopoverActionDefinition_1 = require("../definitions/actions/PopoverActionDefinition");
var mdk_sap_1 = require("mdk-sap");
var PopoverDataBuilder_1 = require("../builders/ui/PopoverDataBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ClientSettings_1 = require("../storage/ClientSettings");
var app = require("tns-core-modules/application");
var MDKFrame_1 = require("../pages/MDKFrame");
var PopoverAction = (function (_super) {
    __extends(PopoverAction, _super);
    function PopoverAction(definition) {
        var _this = this;
        if (!(definition instanceof PopoverActionDefinition_1.PopoverActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_POPOVERACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    PopoverAction.prototype.execute = function () {
        var _this = this;
        var topFrame = MDKFrame_1.MDKFrame.getCorrectTopmostFrame(this._source, this._alwaysParentIfChildIsTabs, this.sourceFrameId);
        var currentPage = topFrame.currentPage ? topFrame.currentPage : null;
        var definition = this.definition;
        var context = this.context();
        var builder = new PopoverDataBuilder_1.PopoverDataBuilder(context);
        builder.setTitle(definition.title)
            .setMessage(definition.message)
            .setPage(currentPage)
            .setPressedItem(context.clientAPIProps.pressedItem);
        definition.items.forEach(function (item) {
            builder.newItem
                .setEnabled(item.enabled)
                .setIcon(item.icon)
                .setOnPress(item.onPress)
                .setTitle(item.title)
                .setVisible(item.visible);
        });
        return builder.build().then(function (data) {
            var showingData = data;
            if (app.android) {
                showingData.screenSharing = ClientSettings_1.ClientSettings.getScreenSharingWithAndroidVersion();
            }
            var instance = mdk_sap_1.Popover.getInstance();
            return instance.show(showingData).then(function (onPress) {
                if (onPress) {
                    return _this._executeActionOrRule(onPress).then(function (actionResult) {
                        return actionResult;
                    });
                }
            });
        });
    };
    return PopoverAction;
}(BaseAction_1.BaseAction));
exports.PopoverAction = PopoverAction;
