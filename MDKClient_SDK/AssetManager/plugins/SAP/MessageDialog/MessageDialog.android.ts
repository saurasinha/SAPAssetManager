import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import { android as androidApp } from 'tns-core-modules/application';
import { getLabelColor, getButtonColors, isDialogOptions, ALERT, OK,
    CONFIRM, CANCEL } from 'tns-core-modules/ui/dialogs/dialogs-common';
import { DialogOptions, ConfirmOptions } from 'tns-core-modules/ui/dialogs';
import { DeviceType } from 'tns-core-modules/ui/enums';
import { device } from 'tns-core-modules/platform';
import * as utils from 'tns-core-modules/utils/utils';
import * as nativeHelper from 'tns-core-modules/utils/native-helper';
import * as application from 'tns-core-modules/application';
import { messageType, write } from 'tns-core-modules/trace';

export * from 'tns-core-modules/ui/dialogs/dialogs-common';

declare var android;
declare var com;
const fioriFontPkg = com.sap.cloud.mobile.fiori.font;

export class MessageDialog {
  public static getInstance(): MessageDialog {
    return MessageDialog._instance;
  }

  private static _instance: MessageDialog = new MessageDialog();
  private _dialogs: android.app.AlertDialog[] = [];
  private _screenSharing: boolean;
  private _titleText: string;
  private _messageText: string;
  private _buttonStyle;

  private constructor() {
    if (MessageDialog._instance) {
      throw new Error(ErrorMessage.MESSAGEDIALIOG_INSTANTIATION_FAILED);
    }
    MessageDialog._instance = this;
  }

  public alert(arg: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const options = !isDialogOptions(arg) ? { title: ALERT, okButtonText: OK, message: arg + '' } : arg;
        this._buttonStyle = options.buttonStyle;
        const alert = this.createAlertDialog(options);

        alert.setPositiveButton(options.okButtonText, new android.content.DialogInterface.OnClickListener({
            onClick: (dialog: android.content.DialogInterface, id: number) => {
                dialog.cancel();
                resolve();
            },
        }));
        alert.setOnDismissListener(new android.content.DialogInterface.OnDismissListener({
            onDismiss: () => {
                resolve();
            },
        }));

        this.showDialog(alert);

      } catch (ex) {
        reject(ex);
      }
    });
  }

  public confirm(arg: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        let confirmOption = { title: CONFIRM, okButtonText: OK, cancelButtonText: CANCEL, message: arg + '' };
        const options = !isDialogOptions(arg) ? confirmOption : arg;
        this._buttonStyle = options.buttonStyle;
        const alert = this.createAlertDialog(options);

        this.addButtons(alert, options, (result) => { resolve(result); });

        this.showDialog(alert);

      } catch (ex) {
        reject(ex);
      }
    });
  }

  public setScreenSharing(screenSharing: boolean) {
    this._screenSharing = screenSharing;
  }

  public closeAll() {
    if (this._dialogs) {
        this._dialogs.forEach((dialog) => {
            if (dialog instanceof android.app.AlertDialog) {
                if (dialog.isShowing()) {
                    dialog.dismiss();
                }
            }
        });
        this._dialogs = [];
    }
  }

  private isString(value): value is string {
    return typeof value === 'string';
  }

  private cleanUpDialogs() {
    if (this._dialogs) {
        // To store only active displaying dialogs
        let newDialogs: android.app.AlertDialog[] = [];
        let eachDialog;
        for (let i = 0; i < this._dialogs.length; i++) {
            eachDialog = this._dialogs[i];
            if (eachDialog instanceof android.app.AlertDialog) {
                if (eachDialog.isShowing()) {
                    newDialogs.push(eachDialog);
                }
            }
        }
        this._dialogs = newDialogs;
    }
  }

  private createAlertDialog(options?: DialogOptions): android.app.AlertDialog.Builder {
    let theme = nativeHelper.ad.getResources().getIdentifier(
        'Dialog.Mobile',
        'style',
        nativeHelper.ad.getApplicationContext().getPackageName()
    );
    const alert = new android.app.AlertDialog.Builder(androidApp.foregroundActivity, theme);
    
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
  }

  private showDialog(builder: android.app.AlertDialog.Builder) {
    const dlg = builder.show();

    // 0. Apply FLAG_SECURE flag
    if (!this._screenSharing) {
        dlg.getWindow().setFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE,
            android.view.WindowManager.LayoutParams.FLAG_SECURE);
    }

    // 1. Declare local variables
    let textView = null;
    let messageTextView = null;
    let titleTemplateView = null;
    let dividerView = null;
    let textSpacerNoTitleView = null;
    let messagePanelView = null;
    let titleTextSize = null;
    let bodyTextSize = null;
    let buttons: android.widget.Button[] = [];
    let buttonLayout = null;

    // 2. Convert fixed dp values to pixels
    const buttonHeight = utils.layout.toDevicePixels(36);
    const buttonWidth = utils.layout.toDevicePixels(64);
    const padding24 = utils.layout.toDevicePixels(24);
    const padding20 = utils.layout.toDevicePixels(20);
    const padding8 = utils.layout.toDevicePixels(8);
    const textLineHeight = utils.layout.toDevicePixels(24);
    // dialog width for phone is 280dp (max)
    // while for tablet is 336dp (min) and incremental depends on the content with multiply of 56dp
    const dialogWidthDP = 280;
    const dialogWidthMultiplier = 56;
    const dialogDecorViewPaddigs = 32;
    let dialogWidthFinal = dialogWidthDP;
    if (device.deviceType === DeviceType.Tablet) {
        let dialogWidthMultiplierTimes = 1;
        let msgLen = this._messageText.length;
        if (msgLen <= 60) {
            dialogWidthMultiplierTimes = 1;
        } else if (msgLen > 60 && msgLen <= 80) {
            dialogWidthMultiplierTimes = 2;
        } else if (msgLen > 80 && msgLen <= 100) {
            dialogWidthMultiplierTimes = 3;
        } else if (msgLen > 100) {
            dialogWidthMultiplierTimes = 4;
        }
        dialogWidthFinal = dialogWidthDP + (dialogWidthMultiplierTimes * dialogWidthMultiplier);
    }
    dialogWidthFinal += dialogDecorViewPaddigs;
    const dialogWidth = utils.layout.toDevicePixels(dialogWidthFinal);

    // 3. Convert fixed sp values to em
    const spToEmScaleFactor = 0.0624;
    const letterSpacingButton = 0.7 * spToEmScaleFactor;
    const titleTextLetterSpacing = 0.16 * spToEmScaleFactor;
    const bodyTextLetterSpacing = 0.2 * spToEmScaleFactor;

    // 4. Get views by resource id
    const textViewId = dlg.getContext().getResources().getIdentifier('android:id/alertTitle', null, null);
    if (textViewId) {
        textView = <android.widget.TextView> dlg.findViewById(textViewId);
    }
    const messageTextViewId = dlg.getContext().getResources().getIdentifier('android:id/message', null, null);
    if (messageTextViewId) {
        messageTextView = <android.widget.TextView> dlg.findViewById(messageTextViewId);
    }
    const titleTemplateId = dlg.getContext().getResources().getIdentifier('android:id/title_template', null, null);
    if (titleTemplateId) {
        titleTemplateView = <android.widget.LinearLayout> dlg.findViewById(titleTemplateId);
    }
    const dividerId = dlg.getContext().getResources().getIdentifier('android:id/titleDividerNoCustom', null, null);
    if (dividerId) {
        dividerView = <android.widget.Space> dlg.findViewById(dividerId);
    }
    const textSpacerNoTitleId = dlg.getContext().getResources()
        .getIdentifier('android:id/textSpacerNoTitle', null, null);
    if (textSpacerNoTitleId) {
        textSpacerNoTitleView = <android.widget.Space> dlg.findViewById(textSpacerNoTitleId);
    }
    const messagePanelViewId = dlg.getContext().getResources().getIdentifier('android:id/contentPanel', null, null);
    if (messagePanelViewId) {
        messagePanelView = <android.widget.LinearLayout> dlg.findViewById(messagePanelViewId);
    }

    // 5. Get text size from MDC layer
    const titleTextSizeId = dlg.getContext().getResources()
        .getIdentifier('dialog_title_text_size', 'dimen', application.android.packageName);
    if (titleTextSizeId) {
        titleTextSize = dlg.getContext().getResources().getDimension(titleTextSizeId);
    }
    const bodyTextSizeId = dlg.getContext().getResources()
        .getIdentifier('dialog_body_text_size', 'dimen', application.android.packageName);
    if (bodyTextSizeId) {
        bodyTextSize = dlg.getContext().getResources().getDimension(bodyTextSizeId);
    }

    // 6. Get Fiori font typeface
    const fontName = fioriFontPkg.FioriFont.TypefaceName.F72_REGULAR;    
    const fioriTypeFace = fioriFontPkg.FioriFont.getFioriTypeface(dlg.getContext(), fontName);

    // 7. Set text font, styles, and line related attributes of title and body views
    const labelColor = getLabelColor();
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
        } else {
            // for API < 28, use lineSpacingExtra
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
        } else {
            // for API < 28, use lineSpacingExtra
            messageTextView.setLineSpacing(textLineHeight - messageTextView.getLineHeight(), 1);
        }
    }

    // 8. Set paddings and size of dialog, title and body views
    let dlgParams = dlg.getWindow().getAttributes();
    if (dlgParams) {
        dlgParams.width = dialogWidth;
        dlg.getWindow().setAttributes(dlgParams);
    }
    if (titleTemplateView) {
        // left padding is 24dp. top is 20dp. bottom is 0.
        titleTemplateView.setPadding(padding24, padding20, padding24, 0);
    }
    if (dividerView) {
        // set view height as 0 as it is not needed (use title view bottom padding instead)
        let params = <android.view.ViewGroup.LayoutParams> dividerView.getLayoutParams();
        params.height = 0;
        dividerView.setLayoutParams(params);
    }
    if (messagePanelView) {
        // To ensure no extra space coming below body message.
        messagePanelView.setMinimumHeight(0);
        messagePanelView.setPadding(0, 0, 0, 0);
    }
    if (messageTextView) {
        // left & right paddings are 24dp.
        // top padding is 20dp.
        // bottom padding depends on whether title is set
        let messageBottomPadding;
        if (this._titleText !== '') {
            // if title is present, the message bottom padding is 24
            messageBottomPadding = padding24;
        } else {
            // if title is not present, the message bottom padding is 20
            // and the divider view won't be shown, the spacernotitle view would be shown instead
            // setting the spacernotitle view height to 0 as it is not being used (use message view top padding instead)
            messageBottomPadding = padding20;
            let params = <android.view.ViewGroup.LayoutParams> textSpacerNoTitleView.getLayoutParams();
            params.height = 0;
            textSpacerNoTitleView.setLayoutParams(params);
        }
        messageTextView.setPadding(padding24, padding20, padding24, messageBottomPadding);
    }

    // 9. Get buttons
    for (let i = 0; i < 3; i++) {
        let id = dlg.getContext().getResources().getIdentifier('android:id/button' + i, null, null);
        if (id) {
            buttons[i] = <android.widget.Button> dlg.findViewById(id);
        }
    }

    // 10. Set button styles, height, and paddings
    let { color, backgroundColor } = getButtonColors();
    if (this._buttonStyle) {
        // button style is from Button type selector from app.android.css
        // need to pass manually from ts layer because getButtonColors cannot recognize .ns-dark and .ns-light identifiers.
        if (this._buttonStyle.color) {
            color = this._buttonStyle.color;
        }
        if (this._buttonStyle.backgroundColor) {
            backgroundColor = this._buttonStyle.backgroundColor;
        }
    }
    if (buttons.length) {
        buttons.forEach(button => {
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
                    // BCP-2170111630: app showing error of
                    // java.lang.NoSuchMethodError: no static method "Landroid/view/ViewGroup$MarginLayoutParams;.setMargins(IIII)V"
                    // the resolution is:
                    // - do instantate of layout params instead of conversion
                    // - add instanceof check
                    // - add try catch to log the exception, as currently there is no definitive reproduce steps yet, and it has major impact if the app encounters the error.
                    // - set rightMargin instead of setMargins function
                    let lP = new android.widget.LinearLayout.LayoutParams(button.getLayoutParams());
                    if (lP instanceof android.widget.LinearLayout.LayoutParams) {
                        lP.rightMargin = padding8;
                        button.setLayoutParams(lP);
                    }
                } catch(error) {
                    write(error, 'mdk.trace.ui', messageType.error);
                }
                button.setPadding(padding8, button.getPaddingTop(), padding8, button.getPaddingBottom());
                buttonLayout = <android.widget.LinearLayout> button.getParent();
            }
        });
        if (buttonLayout) {
            // left padding is 24dp. top, bottom are 8dp for button area
            // right padding is now being set as button margin above
            buttonLayout.setPadding(padding24, padding8, 0, padding8);
        }
    }

    // 11. Store active dialogs to be closed upon reset
    this.cleanUpDialogs();
    this._dialogs.push(dlg);
  }

  private addButtons(alert: android.app.AlertDialog.Builder, options: ConfirmOptions, callback: Function): void {

    if (!options) {
        return;
    }

    if (options.okButtonText) {
        alert.setPositiveButton(options.okButtonText, new android.content.DialogInterface.OnClickListener({
            onClick: (dialog: android.content.DialogInterface, id: number) => {
                dialog.cancel();
                callback(true);
            },
        }));
    }

    if (options.cancelButtonText) {
        alert.setNegativeButton(options.cancelButtonText, new android.content.DialogInterface.OnClickListener({
            onClick: (dialog: android.content.DialogInterface, id: number) => {
                dialog.cancel();
                callback(false);
            },
        }));
    }

    if (options.neutralButtonText) {
        alert.setNeutralButton(options.neutralButtonText, new android.content.DialogInterface.OnClickListener({
            onClick: (dialog: android.content.DialogInterface, id: number) => {
                dialog.cancel();
                callback(undefined);
            },
        }));
    }
    alert.setOnDismissListener(new android.content.DialogInterface.OnDismissListener({
        onDismiss: () => {
            callback(false);
        },
    }));
  }
};
