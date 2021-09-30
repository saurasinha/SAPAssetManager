import { Application } from '../Application';
import { ApplicationEventData } from 'tns-core-modules/application';
import { WelcomePage } from 'mdk-core/pages/WelcomePage';
import { ClientSettings, ActivityResultRequestCode } from 'mdk-core/storage/ClientSettings';
import { PasscodeSource } from 'mdk-core/storage/ClientSettings';
import * as frameModule from 'tns-core-modules/ui/frame';
import { Logger } from 'mdk-core/utils/Logger';
import * as application from 'tns-core-modules/application';
import { MDKPage } from 'mdk-core/pages/MDKPage';
import { EventHandler } from 'mdk-core/EventHandler';
import { PageRenderer } from 'mdk-core/pages/PageRenderer';
import { CustomEventHandler as CustomEventHandlerBase } from 'mdk-core/CustomEventHandler';
import { I18nLanguage} from 'mdk-core/utils/I18nLanguage';
declare var com: any;

export class CustomEventHandler {

  private static _appSuspensionHelper() {
    if (ClientSettings.isLiveMode() && Application.isMainPageRendered() &&
      !CustomEventHandlerBase.isPasscodeScreenDisplaying &&
      CustomEventHandlerBase.displayPasscodeInputScreen) {
      WelcomePage.applicationWillEnterBackground();
    } else {
      // we aren't backgrounding (most likely main page hasn't yet rendered cuz may be still doing odata init). 
      // Reset the flag for next time we come here.
      CustomEventHandlerBase.displayPasscodeInputScreen = false;
    }
  }

  private _showPasscodeTimeout = 0;
  private _resumedAct = null;
  private _pausedAct = null;
  private _lifecycleCallback = null;

  public onAppResumed(args: any) {
    if (ClientSettings.getPasscodeSource() === PasscodeSource.UserOnboardedWithoutPasscode) {
      Application.onResume(args);
      return;
    }
    // mainPageRendered flag is used to ensure offline init has completed after onboarding before we get here.
    if (ClientSettings.isLiveMode() && Application.isMainPageRendered() &&
      !CustomEventHandlerBase.isPasscodeScreenDisplaying && CustomEventHandlerBase.displayPasscodeInputScreen) {
      CustomEventHandlerBase.isPasscodeScreenDisplaying = true;

      WelcomePage.applicationWillEnterForeground();
    }
    if (this._showPasscodeTimeout) {
      clearTimeout(this._showPasscodeTimeout);
      this._showPasscodeTimeout = 0;
      Application.onResume(args);
    }
    // enable demo mode resume event
    if (ClientSettings.isDemoMode()) {
      Application.onResume(args);
    }
  }

  // This application callback method is fired by {N} each time the app is suspended.  
  // The app can get onsuspended call two ways.
  //    a) Usual when app backgrounds.  
  //    b) The running activity calls into a non-{N} activity. For instance, 
  //    the form cell list picker when opened launches a new activity controlled by the SDK that {N} has no idea about, 
  // In case b) since {N} is trying to suspend the app we need to prevent it as app is still active,
  // else the passcode entry window will show up when user returns from list picker.
  // Now, the tricky part is how to distinguish between case a) and case b) so the below code only executes for case a).
  // Solution:
  // We need to go more granular and check on activity callbacks: activityPaused and activityResumed.
  // For case a) The sequence of callbacks when we just background:
  //    onAppPause, onActivityPause
  // The sequence of callbacks when we open a list picker:
  //    onAppPause, onActivityPause, onAppResumed, onActivityResumed  (each event fired one after another very quickly).
  //  When app gets suspended and we get here, wait very briefly for all callbacks to fire and then
  //    If there is an activity that got resumed we know we are navigating in our app (like list picker).
  //    If there is no activity getting resumed, we know app is getting suspended and we run the code.

  public onAppSuspended(args: any) {
    if (CustomEventHandlerBase.isPasscodeScreenDisplaying || ClientSettings.isUserChangingPasscode) {
      // We got paused when on passcode entry screen.  If so, don't suspend, 
      // just reset the flags and it's back to passcode entry.
      CustomEventHandlerBase.isPasscodeScreenDisplaying = false;
      CustomEventHandlerBase.displayPasscodeInputScreen = true;
      return;
    }

    if (ClientSettings.getPasscodeSource() === PasscodeSource.UserOnboardedWithoutPasscode) {
      Application.onSuspend(args);
      return;  // no-op
    }

    setTimeout(() => {
      // const resumedActivityType = this._resumedAct.getClass().getSimpleName();
      // const pausedActivityType = this._pausedAct.getClass().getSimpleName();
      if (this._resumedAct && this._pausedAct &&
        this._resumedAct.getClass().getSimpleName() === this._pausedAct.getClass().getSimpleName()) {
        // We just navigated within MDK app (e.g. attachment), 
        // If for some reason {N} still fired a suspended event, No-op.
        return;
      }
      if (this._resumedAct && this._pausedAct &&
        this._resumedAct.getClass().getSimpleName().includes('ListPickerFormCellActivity') &&
        this._pausedAct.getClass().getSimpleName() === 'MDKAndroidActivity') {
        // We just navigated within MDK app (e.g. list picker), 
        // If for some reason {N} still fired a suspended event, No-op.
        return;
      }
      if (ClientSettings.isLiveMode() && !CustomEventHandlerBase.displayPasscodeInputScreen) {
        let timeout = ClientSettings.getPasscodeTimeout();
        if (timeout > 0) {
          if (this._showPasscodeTimeout) {
            clearTimeout(this._showPasscodeTimeout);
          }
          this._showPasscodeTimeout = <any> setTimeout(() => {
            // set flag after timeout
            Application.setOnboardingCompleted(false);
            CustomEventHandlerBase.displayPasscodeInputScreen = true;
            CustomEventHandler._appSuspensionHelper();
          }, 1000 * timeout);
          Application.onSuspend(args);
        } else if (timeout === 0) {
          // always show passcode
          Application.onSuspend(args);
          Application.setOnboardingCompleted(false);
          CustomEventHandlerBase.displayPasscodeInputScreen = true;
          CustomEventHandler._appSuspensionHelper();
        }
      } // else no-op as we just moved to another activity in our app that {N} does not know anything about.
      // enable demo mode suspend event
      if (ClientSettings.isDemoMode()) {
        Application.onSuspend(args);
      }
    }, 500);
  }

  public onAppLaunched(args: any) {
    ClientSettings.saveLinkDataObject(args.android?.getDataString()?.toString());
    // {N} treats re-opening the application as a total relaunch instead of a resume.  If the app is already
    // open, just go through our onAppResumed.
    if (Application.isMainPageRendered()) {
      this.onAppResumed(args);
      return;
    }

    // Create an observer for this activity within the MDKLifecycleObserver to manage app lifecycle events
    if (this._lifecycleCallback == null) {
      this._lifecycleCallback = new com.sap.mdk.client.ui.lifecycle.IMDKEventHandler({
        onAppResumed: () => {
          // creating custom resume/suspend event objects as its not passed from native layer
          const resumeEventData: ApplicationEventData = {
            android: {},
            eventName: 'resumed',
            object: application,
          };
          return this.onAppResumed(resumeEventData);
        },
        onAppSuspended: () => {
          const suspendEventData: ApplicationEventData = {
            android: {},
            eventName: 'suspended',
            object: application,
          };  
          this.onAppSuspended(suspendEventData);
        },
      });
      com.sap.mdk.client.ui.lifecycle.MDKLifecycleObserver.addObserver(this._lifecycleCallback);
    }

    if (ClientSettings.isLiveMode() && !CustomEventHandlerBase.isReLaunchInProgress) {
      CustomEventHandlerBase.isReLaunchInProgress = true;
      // Onboarded User exited client and returning.  We will start out with passcode/biometrics.
      // Only the bridge re-created here by native side based on params passed in.
      if (ClientSettings.getPasscodeSource() !== PasscodeSource.UserOnboardedWithoutPasscode) {
        CustomEventHandlerBase.isPasscodeScreenDisplaying = true;
      }

      if (args.android.getData() !== null) {
        ClientSettings.setConnecionInfoToastMessage(args.android.getData());
      }
      
      let oPage = new WelcomePage();
      let onboardingParams = ClientSettings.getOnboardingParams();

      const passcodeSrc = ClientSettings.getPasscodeSource().toString();
      let passcodeSrcParam = {
        PasscodeSource: passcodeSrc,
      };
      // Since app re-launched, native side has forgotten our passcode source.  Refresh it.
      onboardingParams = Object.assign(onboardingParams, passcodeSrcParam);
      WelcomePage.restoreOnRelaunch(onboardingParams);
     
      this.activateAppLifeCycleCallbacks();
    } else if (!ClientSettings.isLiveMode()) {
      // We are onboarding.  Check if launch was via a URL.
      if (args.android && args.android.getData && (args.android.getData() !== null)) {
        // schemaname://?<key1=value1&key2=value2> For ex: mdkclient://?AppId=ODataOnly&ClientId=abcd-1234
        let launchUrl = args.android.getDataString();
        let startIdx = launchUrl.indexOf('?');
        if (startIdx > 0) {
          Logger.instance.appDelegate.info(Logger.STARTUP_APP_LAUNCHED_VIA_URL, launchUrl);
          if (ClientSettings.isConnectionSettingsEnableOverrides()) {
            ClientSettings.processConnectionSettingsFromLaunchURL(launchUrl.substring(startIdx + 1));
          }
          // Just process the settings is enough, it gets picked up and sent over to native side 
          // to be used by Welcome screen next time it shows.
        }
      }
    }
  }

  // Activity callbacks needed for an edge case.  
  // If user exits onboarded app, and returns we show passcode/FP for a re-launch.
  // If user again backgrounds at this passcode/FP screen, the activity is paused/stopped by android and if user 
  // clicks app icon again he would see passcode/FP screen and on entering passcode/FP app must re-launch 
  // but android does an app resume instead of the re-launch we need.
  // Hence need to use these activity callbacks to check which activity is getting paused.

  // if any activity is resumed we cache that here....
  public onActivityResumed(args: any) {
    this._resumedAct = args.activity;
    if (ClientSettings.getScreenSharingWithAndroidVersion()) {
      this._resumedAct.getWindow().clearFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE);
    } else {
      // Disable ScreenSharing 
      this._resumedAct.getWindow().setFlags(
        android.view.WindowManager.LayoutParams.FLAG_SECURE, android.view.WindowManager.LayoutParams.FLAG_SECURE);
    }
    // If our passcode change action completed and we are now in FP (means passcode change was done), if we are in 
    // NativescriptActivity means action failed.  Either way we need to fire the handlers now.
    const activityType = this._resumedAct.getClass().getSimpleName();
    if (activityType === 'FingerprintActivity'
        || activityType === 'MDKAndroidActivity') {
      if (CustomEventHandlerBase.passcodeChangeActionComplete !== null) {
        WelcomePage.fireChangeUserPasscodeSuccessOrFailureAction(CustomEventHandlerBase.passcodeChangeActionComplete);
        CustomEventHandlerBase.passcodeChangeActionComplete = null;
      } else if (CustomEventHandlerBase.passcodeVerifyActionComplete !== null) {
        WelcomePage.fireVerifyPasscodeSuccessOrFailureAction(CustomEventHandlerBase.passcodeVerifyActionComplete);
        CustomEventHandlerBase.passcodeVerifyActionComplete = null;
      }
    } else if (activityType === 'MDKLaunchScreenActivity') {
      // We are starting (or restarting after a logout).  Get our listeners setup.
      this.activateAppLifeCycleCallbacks();
    }
    const topFrame = frameModule.Frame.topmost();
    if (topFrame && topFrame.currentPage) {
      let mdkPage = topFrame.currentPage as MDKPage;
      if (mdkPage && mdkPage.isResuming) {
        mdkPage.isResuming = false;
        const onResumeEvent = mdkPage.definition.getOnResumeEvent();
        const handler: EventHandler = new EventHandler();
        handler.executeActionOrRule(onResumeEvent, mdkPage.context).then(() => {
          PageRenderer.currentlyRenderedPage = undefined;
        }).catch(() => {
          PageRenderer.currentlyRenderedPage = undefined;
        });
      }
    }

    let appLang = ClientSettings.getAppLanguage();
    // After resuming the app, if user is in onboarding pages, it will ensure the correct language is reflected
    Application.initializeLocalizationAndCustomization();

    // keep locale for login page
    if (appLang && activityType === 'WebViewActivity') {
      I18nLanguage.applyLanguage(appLang);
    }

    let isRTL: boolean;

    /* After logout, the i18n settings are reset and app lanugage is undefined.
    In that scenario, the layout direction would be according to the device language.*/

    if (appLang !== undefined) { 
      isRTL = ClientSettings.getAppLanguageIsRTL();
      let foregroundAct = args.activity;
      let foregroundWindow = foregroundAct.getWindow();
      if (foregroundWindow) {
        let foregroundDecorView = foregroundWindow.getDecorView();
        if (foregroundDecorView) {
          if (isRTL) {
            foregroundDecorView.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_RTL);
          } else {
            foregroundDecorView.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_LTR);
          }
        }
      }
    }

  }
  // If any activity paused,  Lets set our resumedAct to be null as it will be populated by above callback very soon 
  // if something else resumed after the pause (i.e. we are moving between activities).  
  // If nothing resumes (i.e. user just backgrounded his activity) our _resumedAct will remain null.
  public onActivityPaused(args: any) {
    this._pausedAct = args.activity;
    if (!ClientSettings.getScreenSharing()) {
      this._pausedAct.getWindow().setFlags(
        android.view.WindowManager.LayoutParams.FLAG_SECURE, android.view.WindowManager.LayoutParams.FLAG_SECURE);
    }
    this._resumedAct = null;
    //
    let act = args.activity.getClass().getSimpleName();
    if(act.includes('FlowActivity') && CustomEventHandlerBase.isReLaunchInProgress) {
      CustomEventHandlerBase.isReLaunchInProgress = false;
    }
    if (act.includes('Passcode') || act === 'FingerprintActivity' || act.includes('ListPickerFormCellActivity')) {
      // User backgrounding on passcode/FP activity.  
      // If we were in midst of passcode change, reset flag.
      // else if its a relaunch, just kill the passcode/FP activity and its task.
      //  so when user clicks icon next time, relaunch will occur as usual creating a new pascode/FP activity.
      // 
      // Give a slight delay so all activity callbacks have fired.
      if (act.includes('ListPickerFormCellActivity')) {
        MDKPage.setDisplayingExternalPage(true);
      }
      setTimeout(() => {
        if (this._resumedAct === null) {
          if (ClientSettings.isUserChangingPasscode) {
            // User backgrounded, so call appSuspended so any passcode timeout can kick in as in normal app suspension. 
            // Note that because we are in passcode/FP activity which is not nativescript, 
            // so we manually need to call suspend
            CustomEventHandlerBase.displayPasscodeInputScreen = false;
            ClientSettings.isUserChangingPasscode = false;
          } else if (CustomEventHandlerBase.isReLaunchInProgress) {
            // This check is added as EnterPasscodeActivity is already finished in MDC layer
            if (act !== 'EnterPasscodeActivity') {
              args.activity.finishAffinity();
            }
            frameModule.Frame.topmost().android.activity.finish();
            CustomEventHandlerBase.isReLaunchInProgress = false;
          }
        }
      }, 1000);
    } else {
      MDKPage.setDisplayingExternalPage(false);
    }
  }

  public onActivityResult(args: any) {
    // Using switch here incase result from other activities needs to be handled in the future.
    switch (args.requestCode) {
      case ActivityResultRequestCode.AttachmentFormCell:
      case ActivityResultRequestCode.OpenDocument:
        Application.setNonNSActivityDone(true);
        break;
      default:
        break;
    }
  }

  private activateAppLifeCycleCallbacks() {
    // We are starting (or restarting after a logout).  Get our listeners setup.
    // Note that we need to turnoff and turnon again.
    // If not, if it was already on, events fire multiple times when we get here.
    application.off(application.launchEvent);
    application.on(application.launchEvent, (args) => this.onAppLaunched(args));
  }
 }