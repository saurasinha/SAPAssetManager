"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var application_1 = require("tns-core-modules/application");
var dialogs_common_1 = require("tns-core-modules/ui/dialogs/dialogs-common");
var enums_1 = require("tns-core-modules/ui/enums");
var platform_1 = require("tns-core-modules/platform");
var utils = require("tns-core-modules/utils/utils");
var nativeHelper = require("tns-core-modules/utils/native-helper");
var application = require("tns-core-modules/application");
var trace_1 = require("tns-core-modules/trace");
__export(require("tns-core-modules/ui/dialogs/dialogs-common"));
var fioriFontPkg = com.sap.cloud.mobile.fiori.font;
var MessageDialog = (function () {
    function MessageDialog() {
        this._dialogs = [];
        if (MessageDialog._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.MESSAGEDIALIOG_INSTANTIATION_FAILED);
        }
        MessageDialog._instance = this;
    }
    MessageDialog.getInstance = function () {
        return MessageDialog._instance;
    };
    MessageDialog.prototype.alert = function (arg) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var options = !dialogs_common_1.isDialogOptions(arg) ? { title: dialogs_common_1.ALERT, okButtonText: dialogs_common_1.OK, message: arg + '' } : arg;
                _this._buttonStyle = options.buttonStyle;
                var alert_1 = _this.createAlertDialog(options);
                alert_1.setPositiveButton(options.okButtonText, new android.content.DialogInterface.OnClickListener({
                    onClick: function (dialog, id) {
                        dialog.cancel();
                        resolve();
                    },
                }));
                alert_1.setOnDismissListener(new android.content.DialogInterface.OnDismissListener({
                    onDismiss: function () {
                        resolve();
                    },
                }));
                _this.showDialog(alert_1);
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    MessageDialog.prototype.confirm = function (arg) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var confirmOption = { title: dialogs_common_1.CONFIRM, okButtonText: dialogs_common_1.OK, cancelButtonText: dialogs_common_1.CANCEL, message: arg + '' };
                var options = !dialogs_common_1.isDialogOptions(arg) ? confirmOption : arg;
                _this._buttonStyle = options.buttonStyle;
                var alert_2 = _this.createAlertDialog(options);
                _this.addButtons(alert_2, options, function (result) { resolve(result); });
                _this.showDialog(alert_2);
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    MessageDialog.prototype.setScreenSharing = function (screenSharing) {
        this._screenSharing = screenSharing;
    };
    MessageDialog.prototype.closeAll = function () {
        if (this._dialogs) {
            this._dialogs.forEach(function (dialog) {
                if (dialog instanceof android.app.AlertDialog) {
                    if (dialog.isShowing()) {
                        dialog.dismiss();
                    }
                }
            });
            this._dialogs = [];
        }
    };
    MessageDialog.prototype.isString = function (value) {
        return typeof value === 'string';
    };
    MessageDialog.prototype.cleanUpDialogs = function () {
        if (this._dialogs) {
            var newDialogs = [];
            var eachDialog = void 0;
            for (var i = 0; i < this._dialogs.length; i++) {
                eachDialog = this._dialogs[i];
                if (eachDialog instanceof android.app.AlertDialog) {
                    if (eachDialog.isShowing()) {
                        newDialogs.push(eachDialog);
                    }
                }
            }
            this._dialogs = newDialogs;
        }
    };
    MessageDialog.prototype.createAlertDialog = function (options) {
        var theme = nativeHelper.ad.getResources().getIdentifier('Dialog.Mobile', 'style', nativeHelper.ad.getApplicationContext().getPackageName());
        var alert = new android.app.AlertDialog.Builder(application_1.android.foregroundActivity, theme);
        this._titleText = '';
        this._messageText = '';
        if (options) {
            if (this.isString(options.title)) {
                this._titleText = options.title;
            }
            if (this.isString(options.message)) {
                this._messageText = options.message;
            }
        }
        alert.setTitle(this._titleText);
        alert.setMessage(this._messageText);
        if (options && options.cancelable === false) {
            alert.setCancelable(false);
        }
        return alert;
    };
    MessageDialog.prototype.showDialog = function (builder) {
        var dlg = builder.show();
        if (!this._screenSharing) {
            dlg.getWindow().setFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE, android.view.WindowManager.LayoutParams.FLAG_SECURE);
        }
        var textView = null;
        var messageTextView = null;
        var titleTemplateView = null;
        var dividerView = null;
        var textSpacerNoTitleView = null;
        var messagePanelView = null;
        var titleTextSize = null;
        var bodyTextSize = null;
        var buttons = [];
        var buttonLayout = null;
        var buttonHeight = utils.layout.toDevicePixels(36);
        var buttonWidth = utils.layout.toDevicePixels(64);
        var padding24 = utils.layout.toDevicePixels(24);
        var padding20 = utils.layout.toDevicePixels(20);
        var padding8 = utils.layout.toDevicePixels(8);
        var textLineHeight = utils.layout.toDevicePixels(24);
        var dialogWidthDP = 280;
        var dialogWidthMultiplier = 56;
        var dialogDecorViewPaddigs = 32;
        var dialogWidthFinal = dialogWidthDP;
        if (platform_1.device.deviceType === enums_1.DeviceType.Tablet) {
            var dialogWidthMultiplierTimes = 1;
            var msgLen = this._messageText.length;
            if (msgLen <= 60) {
                dialogWidthMultiplierTimes = 1;
            }
            else if (msgLen > 60 && msgLen <= 80) {
                dialogWidthMultiplierTimes = 2;
            }
            else if (msgLen > 80 && msgLen <= 100) {
                dialogWidthMultiplierTimes = 3;
            }
            else if (msgLen > 100) {
                dialogWidthMultiplierTimes = 4;
            }
            dialogWidthFinal = dialogWidthDP + (dialogWidthMultiplierTimes * dialogWidthMultiplier);
        }
        dialogWidthFinal += dialogDecorViewPaddigs;
        var dialogWidth = utils.layout.toDevicePixels(dialogWidthFinal);
        var spToEmScaleFactor = 0.0624;
        var letterSpacingButton = 0.7 * spToEmScaleFactor;
        var titleTextLetterSpacing = 0.16 * spToEmScaleFactor;
        var bodyTextLetterSpacing = 0.2 * spToEmScaleFactor;
        var textViewId = dlg.getContext().getResources().getIdentifier('android:id/alertTitle', null, null);
        if (textViewId) {
            textView = dlg.findViewById(textViewId);
        }
        var messageTextViewId = dlg.getContext().getResources().getIdentifier('android:id/message', null, null);
        if (messageTextViewId) {
            messageTextView = dlg.findViewById(messageTextViewId);
        }
        var titleTemplateId = dlg.getContext().getResources().getIdentifier('android:id/title_template', null, null);
        if (titleTemplateId) {
            titleTemplateView = dlg.findViewById(titleTemplateId);
        }
        var dividerId = dlg.getContext().getResources().getIdentifier('android:id/titleDividerNoCustom', null, null);
        if (dividerId) {
            dividerView = dlg.findViewById(dividerId);
        }
        var textSpacerNoTitleId = dlg.getContext().getResources()
            .getIdentifier('android:id/textSpacerNoTitle', null, null);
        if (textSpacerNoTitleId) {
            textSpacerNoTitleView = dlg.findViewById(textSpacerNoTitleId);
        }
        var messagePanelViewId = dlg.getContext().getResources().getIdentifier('android:id/contentPanel', null, null);
        if (messagePanelViewId) {
            messagePanelView = dlg.findViewById(messagePanelViewId);
        }
        var titleTextSizeId = dlg.getContext().getResources()
            .getIdentifier('dialog_title_text_size', 'dimen', application.android.packageName);
        if (titleTextSizeId) {
            titleTextSize = dlg.getContext().getResources().getDimension(titleTextSizeId);
        }
        var bodyTextSizeId = dlg.getContext().getResources()
            .getIdentifier('dialog_body_text_size', 'dimen', application.android.packageName);
        if (bodyTextSizeId) {
            bodyTextSize = dlg.getContext().getResources().getDimension(bodyTextSizeId);
        }
        var fontName = fioriFontPkg.FioriFont.TypefaceName.F72_REGULAR;
        var fioriTypeFace = fioriFontPkg.FioriFont.getFioriTypeface(dlg.getContext(), fontName);
        var labelColor = dialogs_common_1.getLabelColor();
        if (textView) {
            if (fioriTypeFace) {
                textView.setTypeface(fioriTypeFace);
            }
            if (labelColor) {
                textView.setTextColor(labelColor.android);
            }
            textView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, titleTextSize);
            textView.setMinHeight(padding20);
            textView.setLetterSpacing(titleTextLetterSpacing);
            if (android.os.Build.VERSION.SDK_INT >= 28) {
                textView.setLineHeight(textLineHeight);
            }
            else {
                textView.setLineSpacing(textLineHeight - textView.getLineHeight(), 1);
            }
        }
        if (messageTextView) {
            if (fioriTypeFace) {
                messageTextView.setTypeface(fioriTypeFace);
            }
            if (labelColor) {
                messageTextView.setTextColor(labelColor.android);
            }
            messageTextView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, bodyTextSize);
            messageTextView.setLetterSpacing(bodyTextLetterSpacing);
            if (android.os.Build.VERSION.SDK_INT >= 28) {
                messageTextView.setLineHeight(textLineHeight);
            }
            else {
                messageTextView.setLineSpacing(textLineHeight - messageTextView.getLineHeight(), 1);
            }
        }
        var dlgParams = dlg.getWindow().getAttributes();
        if (dlgParams) {
            dlgParams.width = dialogWidth;
            dlg.getWindow().setAttributes(dlgParams);
        }
        if (titleTemplateView) {
            titleTemplateView.setPadding(padding24, padding20, padding24, 0);
        }
        if (dividerView) {
            var params = dividerView.getLayoutParams();
            params.height = 0;
            dividerView.setLayoutParams(params);
        }
        if (messagePanelView) {
            messagePanelView.setMinimumHeight(0);
            messagePanelView.setPadding(0, 0, 0, 0);
        }
        if (messageTextView) {
            var messageBottomPadding = void 0;
            if (this._titleText !== '') {
                messageBottomPadding = padding24;
            }
            else {
                messageBottomPadding = padding20;
                var params = textSpacerNoTitleView.getLayoutParams();
                params.height = 0;
                textSpacerNoTitleView.setLayoutParams(params);
            }
            messageTextView.setPadding(padding24, padding20, padding24, messageBottomPadding);
        }
        for (var i = 0; i < 3; i++) {
            var id = dlg.getContext().getResources().getIdentifier('android:id/button' + i, null, null);
            if (id) {
                buttons[i] = dlg.findViewById(id);
            }
        }
        var _a = dialogs_common_1.getButtonColors(), color = _a.color, backgroundColor = _a.backgroundColor;
        if (this._buttonStyle) {
            if (this._buttonStyle.color) {
                color = this._buttonStyle.color;
            }
            if (this._buttonStyle.backgroundColor) {
                backgroundColor = this._buttonStyle.backgroundColor;
            }
        }
        if (buttons.length) {
            buttons.forEach(function (button) {
                if (button) {
                    if (color) {
                        button.setTextColor(color.android);
                    }
                    if (backgroundColor) {
                        button.setBackgroundColor(backgroundColor.android);
                    }
                    if (fioriTypeFace) {
                        button.setTypeface(fioriTypeFace);
                    }
                    button.setMinHeight(buttonHeight);
                    button.setMinimumHeight(buttonHeight);
                    button.setMinWidth(buttonWidth);
                    button.setLetterSpacing(letterSpacingButton);
                    try {
                        var lP = new android.widget.LinearLayout.LayoutParams(button.getLayoutParams());
                        if (lP instanceof android.widget.LinearLayout.LayoutParams) {
                            lP.rightMargin = padding8;
                            button.setLayoutParams(lP);
                        }
                    }
                    catch (error) {
                        trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
                    }
                    button.setPadding(padding8, button.getPaddingTop(), padding8, button.getPaddingBottom());
                    buttonLayout = button.getParent();
                }
            });
            if (buttonLayout) {
                buttonLayout.setPadding(padding24, padding8, 0, padding8);
            }
        }
        this.cleanUpDialogs();
        this._dialogs.push(dlg);
    };
    MessageDialog.prototype.addButtons = function (alert, options, callback) {
        if (!options) {
            return;
        }
        if (options.okButtonText) {
            alert.setPositiveButton(options.okButtonText, new android.content.DialogInterface.OnClickListener({
                onClick: function (dialog, id) {
                    dialog.cancel();
                    callback(true);
                },
            }));
        }
        if (options.cancelButtonText) {
            alert.setNegativeButton(options.cancelButtonText, new android.content.DialogInterface.OnClickListener({
                onClick: function (dialog, id) {
                    dialog.cancel();
                    callback(false);
                },
            }));
        }
        if (options.neutralButtonText) {
            alert.setNeutralButton(options.neutralButtonText, new android.content.DialogInterface.OnClickListener({
                onClick: function (dialog, id) {
                    dialog.cancel();
                    callback(undefined);
                },
            }));
        }
        alert.setOnDismissListener(new android.content.DialogInterface.OnDismissListener({
            onDismiss: function () {
                callback(false);
            },
        }));
    };
    MessageDialog._instance = new MessageDialog();
    return MessageDialog;
}());
exports.MessageDialog = MessageDialog;
;
