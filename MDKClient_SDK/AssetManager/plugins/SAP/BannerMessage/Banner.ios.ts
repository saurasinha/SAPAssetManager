import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import * as frameModule from 'tns-core-modules/ui/frame';
import { IBannerData, BannerType } from './IBannerData';

declare var BannerMessageViewBridge: any;

class BannerCallback extends NSObject {
  // selector will be exposed so it can be called from native.
  /* tslint:disable */
  public static ObjCExposedMethods = {
    onActionLabelPress: { params: [interop.types.void], returns: interop.types.void },
    onCompletionActionLabelPress: { params: [interop.types.void], returns: interop.types.void },
  };
  /* tslint:enable */

  public static initWithCallback(callback: any): BannerCallback {
    let bridgeCallback = <BannerCallback> BannerCallback.new();
    bridgeCallback._callback = callback;
    return bridgeCallback;
  }

  private _callback: any;

  public onActionLabelPress() {
    this._callback.onActionLabelPress();
  }

  public onCompletionActionLabelPress() {
    this._callback.onCompletionActionLabelPress();
  }
}

export class Banner {

  public static getInstance(): Banner {
    return Banner._instance;
  }

  private static _instance: Banner = new Banner();
  private bridge = BannerMessageViewBridge.new();
  private myCallback: BannerCallback;

  private constructor() {
    if (Banner._instance) {
      throw new Error(ErrorMessage.BANNER_INSTANTIATION_FAILED);
    }
    Banner._instance = this; 
  }

  public display(data: IBannerData, callback: any) {
    
    if (!data.topFrame) {
      // can't display a banner without a Frame
      return;
    }

    // Adjust the topFrame in the data for iOS
    data.topFrame = data.topFrame.ios.controller;
    data.message = data.message.toString();

    this.myCallback = BannerCallback.initWithCallback(callback);
    this.bridge.displayBannerMessageCallback(data, this.myCallback);
  }

  public dismiss(data?: IBannerData) {
    let dataParam = data ? data : {};
    this.bridge.dismissBanner(dataParam);
  }

  public prepareToRelocate() {
    this.bridge.prepareToRelocate();
  }

  public updateText(message: string, topFrame: frameModule.Frame) {
    if (message !== null && message !== undefined) {
      this.bridge.updateText({text: message});
    }
  }

  public relocateTo(topFrame: frameModule.Frame, view: any) {
    if (topFrame && topFrame.ios && topFrame.ios.controller) {
      this.bridge.relocateToWithParams(topFrame.ios.controller, view);
    }
  }
};
