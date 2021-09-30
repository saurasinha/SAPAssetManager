import { DataConverter } from '../../Common/DataConverter';
import * as application from 'tns-core-modules/application';
import { messageType, write } from 'tns-core-modules/trace';

declare var com: any;

export class WelcomeScreen {
  public static getInstance(): WelcomeScreen {
    if (!WelcomeScreen._instance) {
      WelcomeScreen._instance = new WelcomeScreen();
    }
    return WelcomeScreen._instance;
  }
  private static _instance;
  private welcomeScreenBridge: any;
  private callback: any;
  
  public createCallback(callback: any, resolve?: any, reject?: any) {
    return new com.sap.mdk.client.ui.onboarding.IWelcomeScreenCallback ({
      finishedLoadingRegistrationInfo: (data) => {
        let aMap = DataConverter.toJavaScriptMap(data);
        callback.finishedLoadingRegistrationInfo(aMap);
      },
      finishedOnboardingWithParams: (data) => {
        let aMap = DataConverter.toJavaScriptMap(data);
        callback.finishedOnboardingWithParams(aMap);
      },
      finishedRestoringWithParams: (data) => {
        let aMap = DataConverter.toJavaScriptMap(data);
        callback.finishedRestoringWithParams(aMap);
      },
      userSwitchedWithParams: (data) => {
        let aMap = DataConverter.toJavaScriptMap(data);
        callback.userSwitchedWithParams(aMap);
      },
      qrCodeScanComplete: (data) => {
        callback.qrCodeScanComplete(data); 
      },
      setPasscodeTimeout: (data) => {
        callback.setPasscodeTimeout(data); 
      },
      setOnboardingStage: (stage) => {
        callback.setOnboardingStage(stage);
      },
      retryPrevUserPendingTxnsUpload: () => {
        callback.retryPrevUserPendingTxnsUpload();
      },
      resetInitializedOData: () => {
        callback.resetInitializedOData();
      },
      resetClientComplete: (success) => {
        const status: String = success ? "successful" : "failed";
        write(`RESET Flow completion status: ${status}`, 'mdk.trace.core', messageType.info);
        resolve();
      },
    });
  }

  public create(params: any, callback: any) {
    let onboardingParams = DataConverter.toJavaObject(params);
    this.callback = callback;
    this.welcomeScreenBridge = new com.sap.mdk.client.ui.onboarding.WelcomeScreenBridge(application.android.context);
    this.welcomeScreenBridge.create(onboardingParams, this.createCallback(callback));
    return this.welcomeScreenBridge;
  }

  public onLoaded() {
    let context = application.android.foregroundActivity ? application.android.foregroundActivity : 
    application.android.context;
    this.welcomeScreenBridge.onLoaded(context);
    return this.welcomeScreenBridge;
  }

  public applicationWillEnterBackground() {
    this.welcomeScreenBridge.lockScreen();
  }

  public applicationWillEnterForeground(): Promise<any> {
    try {
      return Promise.resolve(this.welcomeScreenBridge.unlockScreen());
    } catch (error) {
      //
    }
  }

  public restoreOnRelaunch(params: any): Promise<any> {
    try {
      let newParams = DataConverter.toJavaObject(params);
      return Promise.resolve(this.welcomeScreenBridge.restoreOnRelaunch(newParams));
    } catch (error) {
      //
    }
  }

  public changeUserPasscode(): Promise<any> {
    try {
      return Promise.resolve(this.welcomeScreenBridge.changeUserPasscode());
    } catch (error) {
      //
    }
  }

  public verifyPasscode(params: any): Promise<any> {
    try {
      let newParams = DataConverter.toJavaObject(params);
      return Promise.resolve(this.welcomeScreenBridge.verifyPasscode(newParams));
    } catch (error) {
      //
    }
  }

  public resetClient(): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.welcomeScreenBridge.resetClient(this.createCallback(this.callback, resolve, reject));
      });
    } catch (error) {
      //
    }
  }

  public showErrorScreen(params: any, onboardingParams: any): Promise<any> {
    try {
      let newParams = DataConverter.toJavaObject(params);
      let newOnboardingParams = DataConverter.toJavaObject(onboardingParams);
      return Promise.resolve(this.welcomeScreenBridge.showErrorScreen(newParams, newOnboardingParams));
    } catch (error) {
      //
    }
  }

  public showSyncInProgressScreen(onboardingParams: any): Promise<any> {
    try {
      let newOnboardingParams = DataConverter.toJavaObject(onboardingParams);
      return Promise.resolve(this.welcomeScreenBridge.showSyncInProgressScreen(newOnboardingParams));
    } catch (error) {
      //
    }
  } 

  public finishUserSwitchSyncInProgress(){
    this.welcomeScreenBridge.finishUserSwitchSyncInProgress();
  }
  
  public showNoNetworkScreen(onboardingParams: any): Promise<any> {
    try {
      let newOnboardingParams = DataConverter.toJavaObject(onboardingParams);
      return Promise.resolve(this.welcomeScreenBridge.showNoNetworkScreen(newOnboardingParams));
    } catch (error) {
      //
    }
  }

  public isAppInMultiUserMode(): boolean {
    try {
      return this.welcomeScreenBridge.isAppInMultiUserMode()
    } catch (error) {
      // Default is false
      return false;
    }
  }

  // public update(params: any) {
    // var javaParams = DataConverter.toJavaObject(params);
    // this.welcomeScreenBridge = new com.sap.seam.sapmdc.fioriui.WelcomeScreenBridge(application.android.context);
    // return this.welcomeScreenBridge.update(params);
  // }
};
