import { CommonUtil } from '../../ErrorHandling/CommonUtil';
import { DataConverter } from '../../Common/DataConverter';
import { messageType, write } from 'tns-core-modules/trace';

declare var WelcomeScreenBridge: any;

class WelcomeScreenCallback extends NSObject {

  // selector will be exposed so it can be called from native.
  /* tslint:disable */
  public static ObjCExposedMethods = {
    finishedOnboardingWithParams: { params: [NSDictionary], returns: interop.types.void },
    finishedLoadingRegistrationInfo: { params: [NSDictionary], returns: interop.types.void },
    qrCodeScanComplete: { params: [NSString], returns: interop.types.void },
    setOnboardingStage: { params: [NSString], returns: interop.types.void },
  };
  /* tslint:enable */

  public static initWithCallback(callback: any): WelcomeScreenCallback {
    let bridgeCallback = <WelcomeScreenCallback> WelcomeScreenCallback.new();
    bridgeCallback._callback = callback;
    return bridgeCallback;
  }
  private _callback: any;

  public finishedOnboardingWithParams(data: NSDictionary<NSString, NSString>) {
    let jsData = DataConverter.fromNSDictToMap(data);
    this._callback.finishedOnboardingWithParams(jsData);
  }

  public finishedLoadingRegistrationInfo(data: NSDictionary<NSString, NSString>) {
    let jsData = DataConverter.fromNSDictToMap(data);
    this._callback.finishedLoadingRegistrationInfo(jsData);
  }
 
  public qrCodeScanComplete(queryString: NSString) {
    this._callback.qrCodeScanComplete(queryString);
  }

  public setOnboardingStage(stage: any) {
     this._callback.setOnboardingStage(stage);
  }

}

export class WelcomeScreen {

  public static getInstance(): WelcomeScreen {
    if (!WelcomeScreen._instance) {
      WelcomeScreen._instance = new WelcomeScreen();
    }
    return WelcomeScreen._instance;
  }
  private static _instance;

  private welcomeScreenBridge = WelcomeScreenBridge.new();

  public create(params: any, callback: any) {
    let myCallback = WelcomeScreenCallback.initWithCallback(callback);
    return this.welcomeScreenBridge.createCallback(params, myCallback);
  }
  public reInitializePage(params: any) {
    this.welcomeScreenBridge.reInitializePage(params);
  }
  public manageBlurScreen(params: any) {
    this.welcomeScreenBridge.manageBlurScreen(params);
  }
  public applicationWillEnterForeground(): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.welcomeScreenBridge.applicationWillEnterForegroundReject(result => {
        write('Calling applicationWillEnterForeground was successful', 'mdk.trace.onboarding', messageType.log);
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }
  public changeUserPasscode(): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.welcomeScreenBridge.changeUserPasscodeReject(result => {
        write('Calling changeUserPasscode was successful', 'mdk.trace.onboarding', messageType.log);
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }
  public verifyPasscode(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.welcomeScreenBridge.verifyPasscodeResolveReject(params, result => {
        write('Calling verifyPasscode was successful', 'mdk.trace.onboarding', messageType.log);
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }
  public restoreOnRelaunch(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.welcomeScreenBridge.restoreOnRelaunchResolveReject(params, result => {
        write('Calling restoreOnRelaunch was successful', 'mdk.trace.onboarding', messageType.log);
        resolve(result);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }
  public resetClient(): Promise<any> {
    return Promise.resolve('');
  }
  public showErrorScreen(params: any, onboardingParams: any): Promise<any> {
    return Promise.resolve('');
  }
  public showSyncInProgressScreen(onboardingParams: any): Promise<any> {
    return Promise.resolve('');
  }
  public  showNoNetworkScreen(onboardingParams: any): Promise<any> {
    return Promise.resolve('');
  }
  public finishUserSwitchSyncInProgress(){
    //
  }
  public isAppInMultiUserMode(): boolean {
    return false;
  }
};
