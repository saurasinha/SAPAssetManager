import * as app from 'tns-core-modules/application';
import { DeviceType } from 'tns-core-modules/ui/enums';
import { device } from 'tns-core-modules/platform';
import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import * as frameModule from 'tns-core-modules/ui/frame';
import { IBannerData, BannerType } from '../BannerMessage/IBannerData';
import * as utils from 'tns-core-modules/utils/utils';

declare var android;
declare var com;
declare var org: any;

export class Banner {
  public static getInstance(): Banner {
    return Banner._instance;
  }

  private static _instance: Banner = new Banner();
  private static _phoneMargin = utils.layout.toDevicePixels(8);
  private static _tabletMargin = utils.layout.toDevicePixels(24);
  private static _minWidth = utils.layout.toDevicePixels(288);
  private static _maxWidth = utils.layout.toDevicePixels(568);
  
  private _bannerBridge = com.sap.mdk.client.ui.fiori.banner.BannerManager;

  private constructor() {
    if (Banner._instance) {
      throw new Error(ErrorMessage.BANNER_INSTANTIATION_FAILED);
    }
    Banner._instance = this;
  }

  public dismiss(data?: IBannerData) {
    if (data && data.type === BannerType.progress) {
      this._bannerBridge.dismiss();
    }
  }

  public prepareToRelocate() {
    this._bannerBridge.prepareToRelocate();
  }

  public relocateTo(topFrame: frameModule.Frame, view: any) {
    // MDK-4737 add checking to prevent app get crashed when MDK onExiting
    let frame = this._getFrame(topFrame);
    if (frame === undefined) {
      return undefined;
    }
    this._bannerBridge.relocateTo(frame, view);
  }

  public display(data: IBannerData, callback: any) {
    let duration = data.type === BannerType.progress ? 0 : data.duration;
    this._displayStandard(callback, data.message, data.topFrame, duration, 
      data.animated, data.bottomOffset, data.maxLines, data.CloseButtonCaption, data.type, 
      data.actionLabel, data.onActionLabelPress, data.completionActionLabel, 
      data.onCompletionActionLabelPress, data.dismissBannerOnAction, data.view);
  }

  private _getFrame(topFrame: frameModule.Frame): frameModule.Frame {
    let foregroundAct = app.android.foregroundActivity;
    // MDK-4737 add checking to prevent app get crashed when MDK onExiting
    if (!foregroundAct || !topFrame.currentPage || !topFrame.currentPage.android) {
      return undefined;
    }

    let frame = topFrame.currentPage.android;
    if (foregroundAct && foregroundAct.getClass().getSimpleName()
      && foregroundAct.getClass().getSimpleName() !== 'MDKAndroidActivity') {
      // The foreground is a non-nativescript activity.
      // E.g.: User changed passcode and had a toast/banner as success action.
      // The top activity at this time is the biometrics screen, so we need its view to display the message.
      frame = foregroundAct.getWindow().getDecorView().findViewById(android.R.id.content);
    }
    return frame;
  }

  private _displayStandard(callback: any, message: string, topFrame: frameModule.Frame,
                           duration?: number, animated?: boolean,
                           bottomOffset?: number, maxLines?: number, 
                           closeButtonCaption?: string, bannerType?: BannerType,
                           actionLabel?: string, onActionLabelPress?: string,
                           completionActionLabel?: string, onCompletionActionLabelPress?: string,
                           dismissBannerOnAction?: boolean, view?: any) {

    let frame = this._getFrame(topFrame);

    if (frame === undefined) {
      return undefined;
    }

    const params: org.json.JSONObject = new org.json.JSONObject();
    params.put('Duration', duration);
    params.put('Message', message.toString());
    params.put('CloseButtonCaption', closeButtonCaption);
    params.put('BottomOffset', bottomOffset);
    params.put('MaxLines', maxLines);
    params.put('Type', bannerType);
    params.put('ActionLabel', actionLabel);
    params.put('OnActionLabelPress', onActionLabelPress);
    params.put('CompletionActionLabel', completionActionLabel);
    params.put('OnCompletionActionLabelPress', onCompletionActionLabelPress);
    params.put('DismissBannerOnAction', dismissBannerOnAction);
    params.put('View', view);
    if (device.deviceType === DeviceType.Phone) {
      params.put('Margin', Banner._phoneMargin);
    } else {
      params.put('Margin', Banner._tabletMargin);
      params.put('MinWidth', Banner._minWidth);
      params.put('MaxWidth', Banner._maxWidth);
    }
    let foregroundAct = app.android.foregroundActivity;
    this._bannerBridge.show(params, foregroundAct, frame, this.createCallback(callback));
  }

  public updateText(message: string, topFrame: frameModule.Frame) {
    if (message !== null && message !== undefined) {
      const params: org.json.JSONObject = new org.json.JSONObject();
      params.put('text', message.toString());
      this._bannerBridge.updateText(params);
    }
  }

  private createCallback(callback: any) {
    return new com.sap.mdk.client.ui.fiori.banner.IBannerCallback ({
      onActionLabelPress: () => {
        callback.onActionLabelPress();
      },
      onCompletionActionLabelPress: () => {
        callback.onCompletionActionLabelPress();
      },
    });
  }
};
