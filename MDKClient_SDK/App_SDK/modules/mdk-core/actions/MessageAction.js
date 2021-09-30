"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var MessageActionDefinition_1 = require("../definitions/actions/MessageActionDefinition");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var MessageDataBuilder_1 = require("../builders/actions/MessageDataBuilder");
var mdk_sap_1 = require("mdk-sap");
var ClientSettings_1 = require("../storage/ClientSettings");
var app = require("tns-core-modules/application");
var CssPropertyParser_1 = require("../utils/CssPropertyParser");
var MessageAction = (function (_super) {
    __extends(MessageAction, _super);
    function MessageAction(definition) {
        var _this = this;
        if (!(definition instanceof MessageActionDefinition_1.MessageActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_MESSAGEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        _this._dialogButtonStyle = 'DialogButton';
        return _this;
    }
    MessageAction.prototype.execute = function () {
        var _this = this;
        var builder = new MessageDataBuilder_1.MessageDataBuilder(this.context());
        var definition = this.definition;
        builder.setMessage(definition.message)
            .setOkButtonCaption(definition.okCaption)
            .setCancelButtonCaption(definition.cancelCaption)
            .setTitle(definition.title);
        return builder.build().then(function (data) {
            if (app.android) {
                mdk_sap_1.MessageDialog.getInstance().setScreenSharing(ClientSettings_1.ClientSettings.getScreenSharingWithAndroidVersion());
                var buttonStyle = void 0;
                var buttonColor = CssPropertyParser_1.CssPropertyParser.getPropertyFromSelector(CssPropertyParser_1.Selectors.TypeSelector, _this._dialogButtonStyle, 'color');
                if (buttonColor) {
                    if (!buttonStyle) {
                        buttonStyle = {};
                    }
                    buttonStyle.color = (typeof buttonColor === 'string') ? CssPropertyParser_1.CssPropertyParser.createColor(buttonColor) : buttonColor;
                }
                var buttonBackgroundColor = CssPropertyParser_1.CssPropertyParser.getPropertyFromSelector(CssPropertyParser_1.Selectors.TypeSelector, _this._dialogButtonStyle, 'background-color');
                if (buttonBackgroundColor) {
                    if (!buttonStyle) {
                        buttonStyle = {};
                    }
                    buttonStyle.backgroundColor = (typeof buttonBackgroundColor === 'string') ?
                        CssPropertyParser_1.CssPropertyParser.createColor(buttonBackgroundColor) : buttonBackgroundColor;
                }
                if (buttonStyle) {
                    data.buttonStyle = buttonStyle;
                }
            }
            if (definition.cancelCaption) {
                return mdk_sap_1.MessageDialog.getInstance().confirm(data).then(function (result) {
                    if (result) {
                        if (definition.onOK) {
                            _this._executeActionOrRule(definition.onOK);
                        }
                    }
                    else {
                        if (definition.onCancel) {
                            _this._executeActionOrRule(definition.onCancel);
                        }
                    }
                    return new ActionResultBuilder_1.ActionResultBuilder().data(result).build();
                });
            }
            else {
                return mdk_sap_1.MessageDialog.getInstance().alert(data).then(function () {
                    return new ActionResultBuilder_1.ActionResultBuilder().build();
                });
            }
        }).catch(function (error) {
            mdk_sap_1.MessageDialog.getInstance().alert(error.message);
            throw (error);
        });
    };
    ;
    return MessageAction;
}(BaseAction_1.BaseAction));
exports.MessageAction = MessageAction;
;
