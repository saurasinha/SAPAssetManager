import { Application } from '../Application';
import { WelcomePage } from 'mdk-core/pages/WelcomePage';
import { OnboardingState, ClientSettings, BlurScreenActions} from 'mdk-core/storage/ClientSettings';
import { PushNotification } from 'mdk-sap';
import { Logger } from 'mdk-core/utils/Logger';
import * as application from 'tns-core-modules/application';
import { LifecycleManager } from '../lifecycleManagement/LifecycleManager';
import { ApplicationEventData } from 'tns-core-modules/application';
import { PasscodeSource } from 'mdk-core/storage/ClientSettings';
import * as url from 'url';

export class CustomAppDelegate extends UIResponder implements UIApplicationDelegate, UNUserNotificationCenterDelegate {
   // tslint:disable-next-line:variable-name
  public static ObjCProtocols = [UIApplicationDelegate, UNUserNotificationCenterDelegate];
  public static isPasscodeScreenDisplaying = null;

  private showPasscodeTimeout = 0;
  private displayPasscodeInputScreen = false;

  // Application is not considered backgrounded when a system popup like 'camera permission" shows up, however,
  // the callback method is still fired by the system.
  // So, Only when this flag is false, we are actually backgrounded and hence must show passcode screen.
  private systemPopupFlag = true;

  private hasClientLaunched: boolean = false;
  // Handler for when an installed client gets launched via a URL.  
  public applicationOpenURLOptions?(app: UIApplication, url: NSURL, options: NSDictionary<string, any>): boolean {
    ClientSettings.saveLinkDataObject(url);
    if (ClientSettings.isConnectionSettingsEnableOverrides()) {
      return this.applicationHandleOpenURL(app, url);
    }
    return false;
  }

  public applicationHandleOpenURL?(application: UIApplication, url: NSURL) {
    Logger.instance.appDelegate.info(Logger.STARTUP_APP_LAUNCHED_VIA_URL, url.absoluteString);
    if (ClientSettings.isOnboardingInProgress()) {
      // We are on welcome screen, parse any URL params and use them for Onboarding.
      // These params override any settings that were in BrandedSettings.
      ClientSettings.processConnectionSettingsFromLaunchURL(url.query);
      if (ClientSettings.validateOnboardingConnectionParamsExist()) {
        Logger.instance.appDelegate.info(Logger.STARTUP_APP_URL_PARAM_CHECK_SUCCESS);
        setTimeout(() => {
          // Give SDK a bit to draw up the welcomePage before we update start button state.
          WelcomePage.reInitializePage();
        }, 1000);
      }
    } else {
      ClientSettings.setConnecionInfoToastMessage(url.query, url.absoluteString);
    }
    return true;
  }

  public applicationDidEnterBackground?(application: UIApplication) {
    if (ClientSettings.isOnboardingInProgress()) {
      return;
    }
    if (ClientSettings.isLiveMode()) {
      LifecycleManager.getInstance().pause();
    }
    if (ClientSettings.isDemoMode()) {
      Application.setOnboardingCompleted(true);
      Application.setResumeEventDelayed(false);
    }
    if (ClientSettings.getPasscodeSource() === PasscodeSource.UserOnboardedWithoutPasscode) {
      this.systemPopupFlag = false;
      Application.setResumeEventDelayed(false);
      return;
    }
    if (!ClientSettings.isUserChangingPasscode) {
      this.displayPasscodeInputScreen = false;
      this.systemPopupFlag = false;
      if (ClientSettings.isLiveMode()) {
        let timeout = ClientSettings.getPasscodeTimeout();
        if (timeout > 0) {
          this.showPasscodeTimeout = <any> setTimeout(() => {
            // set flag after timeout
            this.displayPasscodeInputScreen = true;
            Application.setOnboardingCompleted(false);
            Application.setResumeEventDelayed(false);
          }, 1000 * timeout);
        } else if (timeout === 0) {
          // always show passcode
          this.displayPasscodeInputScreen = true;
          // add this for keep same behavior as android
          this.showPasscodeTimeout = <any> setTimeout(() => {
            Application.setOnboardingCompleted(false);
            Application.setResumeEventDelayed(false);
          }, 500);
        }
      }
    }
  }
  
  public applicationDidBecomeActive(application: UIApplication) {
    Logger.instance.appDelegate.info(Logger.STARTUP_INSIDE_APPLICATIONDIDBECOMEACTIVE_DELEGATE_METHOD);
    if (this.systemPopupFlag) {
      // This method also fires if we have a system alert pop up when in the app like permission to use camera,  
      // So if flag set, this is a no-op.  Flag is set to false when we actually background the app.
      WelcomePage.manageBlurScreen(BlurScreenActions.Remove);
      Application.setNonNSActivityDone(true);
      return;
    }
    if (typeof this.systemPopupFlag === 'undefined' || this.systemPopupFlag === null) {
      // Flag would be undefined, when app launched from an icon so, set it again here.
      this.systemPopupFlag = true;
    }
    
    if (ClientSettings.isLiveMode()) {
      // We have already onboarded...
      if (typeof this.displayPasscodeInputScreen === 'undefined' || this.displayPasscodeInputScreen === null) {
        // ... and user must have exited the app and 
        // re-launched by clicking the icon so setup our flags as we must show passcode screen.
        this.displayPasscodeInputScreen = true;
        CustomAppDelegate.isPasscodeScreenDisplaying = false;
      }
    }
    if (ClientSettings.isDemoMode()) {
      Application.setResumeEventDelayed(false);
    }
    // This method also gets called when user double taps home button and just selects our app again.  
    // However, we want to execute only at app launches so check for client launched.
    if (this.displayPasscodeInputScreen && !CustomAppDelegate.isPasscodeScreenDisplaying && !this.hasClientLaunched) {
      this.hasClientLaunched = true;
      CustomAppDelegate.isPasscodeScreenDisplaying = true;
      Application.setResumeEventDelayed(true);
      return WelcomePage.restoreOnRelaunch(ClientSettings.getOnboardingParams()).then(() => {
        WelcomePage.manageBlurScreen(BlurScreenActions.Remove);
        ClientSettings.setApplicationStage('InApplication');
        Application.launchAppMainPage(true);
        // restoreOnRelaunch can trigger onResume Event
        // BCP-1980052183 When user has completed the onboarding process, killed the app and has launched the
        // app again. Both the onLaunch and onResume event will be trigger. Both events will trigger the app
        // update. In this case, the App update should be only handled by onLaunch event. Hence, the eventData
        // is created to avoid the app update being triggered by onResume event.
        let eventData: ApplicationEventData =  {
              eventName: 'relaunched',
              ios: {},
              object: application,
        };
        Application.setResumeEventDelayed(false);
        Application.onResume(eventData);
        LifecycleManager.getInstance().unPause();
      }).catch((err) => {
        Logger.instance.appDelegate.error(err);
        return Promise.resolve();
      }).then(() => {
        // finally
        CustomAppDelegate.isPasscodeScreenDisplaying = false;
      });
    } else if (!CustomAppDelegate.isPasscodeScreenDisplaying) {
      // No passcode screen displaying, Normal resumption from task manager so clear blur. 
      // Note: If Passcode screen displaying, it implies Resumption from background and the blur 
      // would be removed in appWillEnterForeground method. 
      WelcomePage.manageBlurScreen(BlurScreenActions.Remove);
    }
    if (ClientSettings.isLiveMode()) {
      this.hasClientLaunched = true;
    }
  }

  // We are transitioning to background so hide any application screen to prevent iOS taking screen shot.
  public applicationWillResignActive(application: UIApplication) {
    Logger.instance.appDelegate.info(Logger.STARTUP_INSIDE_APPLICATIONWILLRESIGNACTIVE_DELEGATE_METHOD);
    if (ClientSettings.isDemoMode() || 
        (!ClientSettings.isUserChangingPasscode && !CustomAppDelegate.isPasscodeScreenDisplaying && 
          ClientSettings.isLiveMode())) {
      WelcomePage.manageBlurScreen(BlurScreenActions.Add);
    }
    // Reset onresume processing flag if app is transitioning to background.
    Application.setOnResumeProcessing(false);
  }

  // We will only show the passcode screen when application is either coming from background
  // Or launching. Remove any blur screen at this time so passcode input screen is shown.
  public applicationWillEnterForeground(application: UIApplication) {
    if (this.displayPasscodeInputScreen && !CustomAppDelegate.isPasscodeScreenDisplaying) {
      CustomAppDelegate.isPasscodeScreenDisplaying = true;
      Application.prepareForPopoverRestore();
      return WelcomePage.applicationWillEnterForeground().then(() => {
        ClientSettings.setApplicationStage('InApplication');
        WelcomePage.manageBlurScreen(BlurScreenActions.Remove);
        Application.setOnboardingCompleted(true);
        this.hasClientLaunched = true;
        if (ClientSettings.getPasscodeSource() !== PasscodeSource.UserOnboardedWithoutPasscode) {
          Application.completeForPopoverRestore();
          Application.onResume(Application.getPendingResumeEventData());
          Application.setPendingResumeEventData(null);
        }
        LifecycleManager.getInstance().unPause();
      }).catch((err) => {
        Logger.instance.appDelegate.error(err);
        return Promise.resolve();
      }).then(() => {
        // finally
        CustomAppDelegate.isPasscodeScreenDisplaying = false;
      });
    } else if (ClientSettings.isLiveMode() && !this.displayPasscodeInputScreen 
                && !ClientSettings.isUserChangingPasscode) {
        LifecycleManager.getInstance().unPause();
        WelcomePage.manageBlurScreen(BlurScreenActions.Remove);
    } else {
      WelcomePage.manageBlurScreen(BlurScreenActions.Remove);
    }
    if (this.showPasscodeTimeout) {
      clearTimeout(this.showPasscodeTimeout);
      this.showPasscodeTimeout = 0;
    }
    if (!ClientSettings.isOnboardingInProgress()) {
      this.hasClientLaunched = true;
    }
  }

  public applicationDidFinishLaunchingWithOptions?(
        application: UIApplication, launchOptions: NSDictionary<any, any>): boolean {
    Logger.instance.appDelegate.info('Inside applicationDidFinishLaunchingWithOptions app delegate method');
    let center =  UNUserNotificationCenter.currentNotificationCenter();
    center.delegate = this;

    this._registerDefaultsFromSettingsBundle();

    return true;
  }  

  public applicationDidRegisterForRemoteNotificationsWithDeviceToken(
        application: UIApplication, deviceToken: NSData): void {
    Logger.instance.appDelegate.info(
      'Inside applicationDidRegisterForRemoteNotificationsWithDeviceToken app delegate method');
    PushNotification.getInstance().didRegisterForRemoteNotifications(deviceToken);
  }

  public applicationDidFailToRegisterForRemoteNotificationsWithError(application: UIApplication, error: NSError): void {
    Logger.instance.appDelegate.info(
      'Inside applicationDidFailToRegisterForRemoteNotificationsWithError app delegate method');
    PushNotification.getInstance().didFailToRegisterNotifications(error);
  }

  public userNotificationCenterWillPresentNotificationWithCompletionHandler(
        center: UNUserNotificationCenter, notification: UNNotification, 
        completionHandler: (p1: UNNotificationPresentationOptions) => void): void {
    let payload = notification.request.content.userInfo;
    let eventData = {
      eventName: 'foregroundNotificationEvent',
      object: {
        PresentationOptions: {
          Alert: 4,
          All: 7,
          Badge: 1,
          None: 0,
          Sound: 2,
        },
        badge: notification.request.content.badge,
        body: notification.request.content.body,
        completionHandler,
        payload: this._dictionaryToObject(payload),
        title: notification.request.content.title,
      },
    };
    this._unifyEventData(eventData);
    application.notify(eventData);
  }

  public applicationDidReceiveRemoteNotificationFetchCompletionHandler(
        uiApplication: UIApplication, payload: NSDictionary<any, any>, 
        completionHandler: (p1: UIBackgroundFetchResult) => void): void {
    let oPayload = this._dictionaryToObject(payload);
    let eventData = {
      eventName: 'contentAvailableEvent',
      object: {
        FetchResult: {
          Failed: 2,
          NewData: 0,
          NoData: 1,
        },
        badge: oPayload.aps.badge,
        body: oPayload.aps.alert.body,
        completionHandler,
        payload: oPayload,
        title: oPayload.aps.alert.title,
      },
    };
    this._unifyEventData(eventData);
    application.notify(eventData);
  }

  public userNotificationCenterDidReceiveNotificationResponseWithCompletionHandler(
        center: UNUserNotificationCenter, response: UNNotificationResponse,
        completionHandler: () => void): void {
    let actionIdentifier = response.actionIdentifier;
    let payload = response.notification.request.content.userInfo;
    let oPayload = this._dictionaryToObject(payload);
    let eventData = {
      eventName: 'receiveNotificationResponseEvent',
      object: {
        actionIdentifier,
        badge: oPayload.aps.badge,
        body: oPayload.aps.alert.body,
        completionHandler,
        payload: oPayload,
        title: oPayload.aps.alert.title,
      },
    };
    this._unifyEventData(eventData);
    application.notify(eventData);
  }

  private _unifyEventData(eventData: any) {
    let payload = eventData.object.payload;
    // unify data field
    if (payload.data && typeof payload.data === 'string') {
      try {
        eventData.object.data = JSON.parse(payload.data);
      } catch (e) {
        // conver single quote to double quote, and try again
        let sData = payload.data.replace(/'/g, '"');
        try {
          eventData.object.data = JSON.parse(sData);
        } catch (e) {
          eventData.object.data = payload.data;
        }
      }
    }
    // move loc-key and loc-args to under notification section,
    // onReceivePushNotification will use it to localize the message
    if (payload.aps.alert['title-loc-key'] ||
        payload.aps.alert['loc-key']) {
      payload.notification = payload.notification || {};
      payload.notification.titleLocKey = payload.aps.alert['title-loc-key'];
      payload.notification.titleLocArgs = payload.aps.alert['title-loc-args'];
      payload.notification.bodyLocKey = payload.aps.alert['loc-key'];
      payload.notification.bodyLocArgs = payload.aps.alert['loc-args'];
    }
  }

  private _dictionaryToObject(dict: NSDictionary<string, any>): any {
    let jsonData = NSJSONSerialization.dataWithJSONObjectOptionsError(dict, 1);
    let jsonString = NSString.alloc().initWithBytesLengthEncoding(
        jsonData.bytes, jsonData.length, NSUTF8StringEncoding);
    return JSON.parse(jsonString.toString());
  }

  private _registerDefaultsFromSettingsBundle() {
    let settingsPath = NSBundle.mainBundle.pathForResourceOfType('Settings', 'bundle');
    let settingsBundle: NSString = NSString.stringWithString(settingsPath);
    let rootPath = settingsBundle.stringByAppendingPathComponent('Root.plist');

    let settings = NSDictionary.dictionaryWithContentsOfFile(rootPath);
    let preferences = settings.objectForKey('PreferenceSpecifiers');
    let prefs: number = (<any> preferences).count;
    let defaultsToRegister = NSMutableDictionary.alloc().initWithCapacity(prefs);

    let prefSpecification = null;
    let key = null;
    let value = null;
    for (let i = 0; i < prefs; i++) {
        prefSpecification = (<any> preferences).objectAtIndex(i);
        key = prefSpecification.objectForKey('Key');
        value = prefSpecification.objectForKey('DefaultValue');
        if (key && value) {
            defaultsToRegister.setObjectForKey(value, key);
        }
    }

    NSUserDefaults.standardUserDefaults.registerDefaults(defaultsToRegister as any);
    NSUserDefaults.standardUserDefaults.synchronize();
  }
 }
