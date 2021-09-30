/**
 * Application.js is the actual point of entry for the app. It starts the app by first loading definitions of the app
 * and its main page, then showing the main page using the 3rd party Navigation class.
 */
import { NavigationEntry, Frame } from 'tns-core-modules/ui/frame';
import { alert } from 'tns-core-modules/ui/dialogs';
import * as application from 'tns-core-modules/application';
import * as IContext from 'mdk-core/context/IContext';
import { Context } from 'mdk-core/context/Context';
import { ApplicationEventData, SystemAppearanceChangedEventData } from 'tns-core-modules/application';
import { ClientSettings } from 'mdk-core/storage/ClientSettings';
import { OnboardingState } from 'mdk-core/storage/ClientSettings';
import { PageRenderer } from 'mdk-core/pages/PageRenderer';
import { MDKPage } from 'mdk-core/pages/MDKPage';
import { DefinitionProvider } from 'mdk-core/definitions/DefinitionProvider';
import { IDefinitionProvider } from 'mdk-core/definitions/IDefinitionProvider';
import { EventHandler } from 'mdk-core/EventHandler';
import { IDefinitionLoader } from 'mdk-core/definitions/IDefinitionLoader';
import { BundleDefinitionLoader } from './definitions/BundleDefinitionLoader';
import { DemoBundleDefinitionLoader } from './definitions/DemoBundleDefinitionLoader';
import { IDataService } from 'mdk-core/data/IDataService';
import { ODataService } from 'mdk-core/data/ODataService';
import { IRestService } from 'mdk-core/data/IRestService';
import { RestService } from 'mdk-core/data/RestService';
import { LifecycleManager } from './lifecycleManagement/LifecycleManager';
import { IActionFactory } from 'mdk-core/actions/IActionFactory';
import { ActionFactory } from 'mdk-core/actions/ActionFactory';
import { ISegmentFactory } from 'mdk-core/targetpath/segments/ISegmentFactory';
import { SegmentFactory } from 'mdk-core/targetpath/segments/SegmentFactory';
import { IControlFactory } from 'mdk-core/controls/IControlFactory';
import { SecureStore } from 'mdk-core/storage/SecureStore';
import { SDKStylingManager } from 'mdk-core/styling/SDKStylingManager';
import { NavigationBarBridge, MessageDialog } from 'mdk-sap';
import { ActivityIndicator } from 'mdk-sap';
import { TypeConverter } from 'mdk-core/utils/TypeConverter';
import { Logger } from 'mdk-core/utils/Logger';
import { AppSettingsManager} from 'mdk-core/utils/AppSettingsManager';
import { I18nLanguage, LanguageSource} from 'mdk-core/utils/I18nLanguage';
import { I18nHelper } from 'mdk-core/utils/I18nHelper';
import { VersionInfoBridge } from 'mdk-sap';
import * as fs from 'tns-core-modules/file-system';
import { ApplicationDefinition } from 'mdk-core/definitions/ApplicationDefinition';
import { LoggerManager } from 'mdk-sap';
import { OnboardingCustomizationBridge } from 'mdk-sap';
import { Paths } from './storage/Paths';
import { ModalFrame } from 'mdk-core/pages/ModalFrame';
import { ControlFactorySync } from 'mdk-core/controls/ControlFactorySync';
import { PushNotification } from 'mdk-sap';
import { ImageHelper } from 'mdk-core/utils/ImageHelper';
import { TabFrame } from 'mdk-core/pages/TabFrame';
import { OpenDocumentBridge } from 'mdk-sap';
import { IApplicationData } from './IApplicationData';
import { ApplicationDataBuilder } from 'mdk-core/builders/ApplicationDataBuilder';
import { MDKNavigationType } from 'mdk-core/common/MDKNavigationType';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { StyleHelper } from 'mdk-core/utils/StyleHelper';

const StyleScope = require('@nativescript/core/ui/styling/style-scope');

export class Application {
  public static context = null;
  public static isMainPageRendered() {
    return this._mainPageRendered;
  }

  public static setMainPageRendered(mainPageRendered: boolean) {
    this._mainPageRendered = mainPageRendered;
  }

  // BCP-1970507002: This flag is then checked in onResume event handler to decide
  // whether to show update pop up or to skip it.
  public static isNonNSActivityDone() {
    return this._nonNSActivityDone;
  }

  public static setNonNSActivityDone(nonNSActivityDone: boolean) {
    this._nonNSActivityDone = nonNSActivityDone;
  }

  public static launchAppMainPage(didLaunchApp: boolean): Promise<any> {
    this.setOnboardingCompleted(true);
    Application.setOnResumeProcessing(false);
    return this._createSingletons().then(() => {
      AppSettingsManager.instance().removePendingActions();
      const startupPage = Application._applicationParams.mainPage;
      PageRenderer.setPageReference(startupPage);

      // Initialize to cater for after app reset scenario
      this.initializeLocalizationAndCustomization();

      // do resolve app stylesheet here as the application system appearance  
      // which relies on application.ios.window is only available at this point.
      this._resolveApplicationStyleSheet();
      
      /** SNOWBLIND-4772 - Filter Header label text is not styling to the correct color
       * Need to add application styles as early as possible.
       * Otherwise, CssPropertyParser.getPropertyFromSelector() can not get the styles defined in application metadata.
       */
      // BCP-2170086416: After switched to FlowsV2, the launch of main page is faster
      // this causes the SDK styles cannot be populated in time.
      // Move the apply SDK styles code to before nav to main page. 
      // This is the same as css style that was moved before.
      this.applyStyles();

      let launchPromise: Promise<NavigationEntry>;
      if (didLaunchApp) {
        // Clear our navigation stack and show the app.
        if (PageRenderer.appLevelSideDrawer !== undefined) {
          launchPromise = PageRenderer.appLevelSideDrawer.renderMainPage();
        } else { 
          launchPromise = PageRenderer.pushNavigation(startupPage, true, MDKNavigationType.Root);
        }
      } else {
        // this is demo mode for non-sideDrawer app
        launchPromise = PageRenderer.startupNavigation(startupPage, true);
      }

      // set screen sharing for indicator
      if (application.android) {
        ActivityIndicator.instance.setScreenSharing(ClientSettings.getScreenSharingWithAndroidVersion());
      }

      return launchPromise.then((result) => {
        Application._setupForApplicationLaunch(didLaunchApp, undefined);
        return result;
      }).catch(error => {
        Logger.instance.startup.error(Logger.ERROR, error, error.stack);
      });
    });
  }

  public static onDidUpdate() {
    let handlerPath: string = Application._appDefinition.getOnDidUpdate();
    if (handlerPath) {
      return Application._executeWithHandlerPath(handlerPath, undefined);
    } else {
      return Promise.resolve();
    }
  }

  public static onUserSwitch(eventData) {
    let handlerPath: string = Application._appDefinition.getOnUserSwitch();
    if (handlerPath) {
      return Application._executeWithHandlerPath(handlerPath, eventData);
    } else {
      return Promise.resolve();
    }
  }

  public static onExit(appEventData: ApplicationEventData) {
    // To test, run the app in foreground and press shift + command + H + H, then swipe the app to kill it.
    // If the app is alreay in background, it doesn't work.

    // remove registered event handler when onexit
    Application.removeApplicationListener();
    Application.setOnboardingCompleted(false);
    Application.setMainPageRendered(false);
    let handlerPath: string = Application._appDefinition.getOnExit();
    return Application._executeWithHandlerPath(handlerPath, appEventData);
  }

  // Note that this method needs to be called explicitly as in setupForApplicationLaunch()
  // above.  This is because when onLaunch event is fired by {N} we havent Onboarded and hence
  // have no metadata.
  public static onLaunch(appEventData: ApplicationEventData): Promise<any> {
    // onLaunch event can accept a simple object and an an array as well
    let sHandlerPath = Application._appDefinition.getOnLaunch();
    
    return Application._executeWithHandlerPaths(TypeConverter.toArray(sHandlerPath), appEventData).then(() => {
      // On Launch Completed
      if (ClientSettings.isLiveMode()) {
        LifecycleManager.getInstance().start();
      }
    }).catch((error) => {
      Logger.instance.startup.error(Logger.STARTUP_LAUNCH_FAILED, error);
      // Still start LCMS checking on error, new app could fix launch issues
      if (ClientSettings.isLiveMode()) {
        LifecycleManager.getInstance().start();
      }
    }).then(() => {
      this._processLinkData();
    }).then(() => {
      Application.setResumeEventDelayed(false);
    });
  }

  public static onUnCaughtError(appEventData: ApplicationEventData) {
    let handlerPath: string = Application._appDefinition.getOnUnCaughtError();
    Application._executeWithHandlerPath(handlerPath, appEventData);
  }

  public static onSuspend(appEventData: ApplicationEventData) {
    // in Passcode displaying, disable suspend event
    Application.setOnResumeProcessing(false);
    if (!ClientSettings.isDemoMode() && !Application.isOnBoardingComleted()) {
      return null;
    }
    LifecycleManager.getInstance().stop();
    let handlerPath: string = Application._appDefinition.getOnSuspend();
    Application._executeWithHandlerPath(handlerPath, appEventData);
  }

  public static onResume(appEventData: ApplicationEventData) {
    if (Application.isOnResumeProcessing()) {
      // prevent onResume event been called at the same time. 
      // Enable Face Id will call the onResume twice in short time(BCP-2080169091)
      return null;
    }
    if (!ClientSettings.isDemoMode()) {
      if (!Application.isOnBoardingComleted() || Application.isResumeEventDelayed()) {
        Logger.instance.app.info(`App onResume handler is to be delayed, setting the appEventData - ${appEventData}`);
        Application.setPendingResumeEventData(appEventData);
        return null;
      }
    }
    // BCP-1970465235 The app resume after an attachment activity had returned. Lcms app update
    // is defferred in this case.
    Application.setOnResumeProcessing(true);
    if (Application.isNonNSActivityDone() && appEventData && appEventData.eventName !== 'relaunched') {
      // Start lifecycle Manager without running version checker
      LifecycleManager.getInstance().startDelayed();
      Application.setNonNSActivityDone(false);
    } else if (appEventData === null || appEventData === undefined || appEventData.eventName !== 'relaunched') {
    // BCP-1980052183 When user has completed the onboarding process, killed the app and has launched the
    // app again. Both the onLaunch and onResume event will be trigger. the App update should be only
    // handled by onLaunch event. In this case, the app update over here is not neccesary if the evenName
    // is relaunched.
      LifecycleManager.getInstance().start();
    }

    MDKPage.resetNavigateFlags();

    // Check if system language or font scale has changed.
    let hasDeviceLanguageChanged = false;
    let hasDeviceFontScaleChanged = false;
    const prevAppLanguage = I18nLanguage.getAppLanguage();
    const prevAppFontScale = ClientSettings.getAppFontScale();

    // Perform localization checking and customization
    // Any AppLanguage changes would occur in this process.
    Application.initializeLocalizationAndCustomization();

    // Get language source and app language after the language checking process.
    const appLanguageSource = ClientSettings.getAppLanguageSource();
    const currentAppLanguage = I18nLanguage.getAppLanguage();
    const currentAppFontScale = ClientSettings.getAppFontScale();

    if (appLanguageSource === LanguageSource.DeviceSetting) {
      hasDeviceLanguageChanged = prevAppLanguage !== currentAppLanguage;
    }

    // BCP-1970552794: handle device font scale changed
    hasDeviceFontScaleChanged = prevAppFontScale !== currentAppFontScale;

    let definitionOnResumePromise;
    let handlerPath: string = Application._appDefinition.getOnResume();
    if (handlerPath) {
      definitionOnResumePromise = Application._executeWithHandlerPath(handlerPath, appEventData);
    } else {
      definitionOnResumePromise = Promise.resolve();
    }
    const topFrame = TabFrame.getCorrectTopmostFrame();
    definitionOnResumePromise.then(() => {
      /* BCP-1980003940
       * Android App crashes when resuming the app after changing device language.
       * Fix: Added locale and layoutDirection to Android Manifest to prevent app being destroyed.
       * Added navigation action to main page if the language has changed (only for Android).
       */
      if (application.android && (hasDeviceLanguageChanged || hasDeviceFontScaleChanged)) {
        // if device language or font scale has changed, for now, redirect user to main page to reflect the page in new language.
        if (topFrame) {
          setTimeout(() => {
            if (PageRenderer.appLevelSideDrawer !== undefined) {
              PageRenderer.appLevelSideDrawer.renderMainPage();
            } else { 
              PageRenderer.pushNavigation(Application._applicationParams.mainPage, true, MDKNavigationType.Root);
            }
            Application.setOnResumeProcessing(false);
          }, 0);
        }
      } if (Application._newSystemAppearance && Application._newSystemAppearance !== '') {
        // MDK-7883: appearance has changed 
        // re-apply appearance specific theme if available and automatically redirect to main page.
        Application._newSystemAppearance = '';
        Application.setOnResumeProcessing(false);
        const validTheme = StyleHelper.getTheme();
        if (application.android) {
          setTimeout(() => {
            if (PageRenderer.appLevelSideDrawer !== undefined) {
              // for SideDrawer scenario, do not load main page, but redraw sidedrawer and render sidedrawer's main page instead.
              Application._setThemeOnly(validTheme);
              setTimeout(() => {
                PageRenderer.appLevelSideDrawer.renderMainPage();
              }, 250);
            } else {
              StyleHelper.setTheme(validTheme);
            }
          }, 0);
        } else {
          if (PageRenderer.appLevelSideDrawer !== undefined) {
            // for SideDrawer scenario, do not load main page, but redraw sidedrawer and render sidedrawer's main page instead.
            Application._setThemeOnly(validTheme);
            setTimeout(() => {
              PageRenderer.appLevelSideDrawer.renderMainPage();
            }, 250);
          } else {
            StyleHelper.setTheme(validTheme);
          }
        }
      } else {
        // BCP-2170049603, onLinkDataReceived event is being affected by page onResume Event. so add a delay.
        let onLinkDataReceivedDelay = 1500;
        // trigger page onResume event if existing
        if (topFrame && topFrame.currentPage) {
          let mdkPage = topFrame.currentPage as MDKPage;
          if (mdkPage && mdkPage.definition && mdkPage.definition.getOnResumeEvent()) {
            if (application.android) {
              // for android platform the onResume event will be triggered in Activity Resumed event
              mdkPage.isResuming = true;
              Application.setOnResumeProcessing(false);
            } else {
              const onResumeEvent = mdkPage.definition.getOnResumeEvent();
              const handler: EventHandler = new EventHandler();
              handler.executeActionOrRule(onResumeEvent, mdkPage.context).then(() => {
                PageRenderer.currentlyRenderedPage = undefined;
                Application.setOnResumeProcessing(false);
              }).catch(() => {
                PageRenderer.currentlyRenderedPage = undefined;
                Application.setOnResumeProcessing(false);
              });
            }
          }
        }
        // MDK-11808: To be revistied in future as This part of the code is executed after the execution of onResume.
        // If any event is associated with onResume, then it is handled before the execution of onLinkDataReceived Event.
        // Hence, if any further actions or any event to be handled while onLinkDataReceived then we might have to chain all the promises.        
        setTimeout(() => {
          if (appEventData && (appEventData.eventName === 'resumed' || appEventData.eventName === 'resume' || appEventData.eventName === 'restored' || appEventData.eventName === 'launch' )) {
            Application._processLinkData();
          }
        }, onLinkDataReceivedDelay);
      }
    })
  }

  private static _processLinkData() {
    const linkData = ClientSettings.getOnLinkDataReceived();
    if (linkData) {
      return Application.onLinkDataReceived(ClientSettings.getOnLinkDataReceived()).finally(() =>
      ClientSettings.resetOnLinkDataReceived());
    }
  }

  public static prepareForPopoverRestore() {
    const topFrame = TabFrame.getCorrectTopmostFrame();
    if (topFrame && topFrame.currentPage) {
      let mdkPage: MDKPage = topFrame.currentPage as MDKPage;
      if (mdkPage) {
        if (mdkPage.popOverData) {
          mdkPage.dismissPopoverForRestore();
        }
      }
    }
  }

  public static completeForPopoverRestore() {
    const topFrame = TabFrame.getCorrectTopmostFrame();
    if (topFrame && topFrame.currentPage) {
      let mdkPage: MDKPage = topFrame.currentPage as MDKPage;
      if (mdkPage) {
        if (mdkPage.popOverData) {
          mdkPage.restorePopover();
        }
        if ((<ModalFrame>mdkPage.frame).popOverAnchorItem) {
          mdkPage.updateModalPopoverAnchor();
        }
      }
    }
  }

  public static onWillUpdate() {
    let handlerPath: string = Application._appDefinition.getOnWillUpdate();
    if (handlerPath) {
      return Application._executeWithHandlerPath(handlerPath, undefined);
    } else {
      return Promise.resolve();
    }
  }

  public static onLinkDataReceived(linkData: any) {
    let handlerPath: string = Application._appDefinition.getOnLinkDataReceived();
    if (handlerPath && linkData) {
      return Application._executeWithHandlerPath(handlerPath, linkData);
    } else {
      return Promise.resolve();
    }
  }

  public static onReceiveNotificationResponse(notification: ApplicationEventData): Promise<any> {
    return new Promise((resolve, reject) => {
      (function waitUntilInApp(){
        if (ClientSettings.getOnboardingState() === OnboardingState.Live
          && Application.isOnBoardingComleted() && Application.isMainPageRendered()) {
          return Application.onReceivePushNotification(notification).then(() => {
            return resolve();
          });
        }
        setTimeout(waitUntilInApp, 250);
      })();
    });
  }

  public static onReceivePushNotification(notification: ApplicationEventData): Promise<any> {
    let handlerPath: string = Application._appDefinition[notification.eventName + 'Handler'];
    const eventObj = notification.object;
    const payload = eventObj.payload;

    // localize push notification for android
    if (payload.notification && payload.notification.titleLocKey) {
      eventObj.title = I18nHelper.localizeDefinitionText(
        payload.notification.titleLocKey,
        payload.notification.titleLocArgs,
        null);
    }
    if (payload.notification && payload.notification.bodyLocKey) {
      eventObj.body = I18nHelper.localizeDefinitionText(
        payload.notification.bodyLocKey,
        payload.notification.bodyLocArgs,
        null);
    }
    if (typeof handlerPath === 'function') {
      // for unit test
      handlerPath = (handlerPath as Function)();
    }
    let completionHandler = notification.object.completionHandler;
    if (handlerPath) {
      return Application._executeWithHandlerPath(handlerPath, eventObj).then((result) => {
        if (typeof result === 'number') {
          completionHandler(result);
        } else {
          completionHandler(0);
        }
        return result;
      });
    } else {
      if (eventObj.body) {
        alert(eventObj.body);
      } else if (payload.data && payload.data.alert) {
        alert(payload.data.alert);
      } else if (payload.aps && payload.aps.alert) {
        if (typeof payload.aps.alert === 'string') {
          alert(payload.aps.alert);
        } else if (typeof payload.aps.alert === 'object') {
          alert(payload.aps.alert.body);
        }
      }
      return Promise.resolve();
    }
  }

  public static resetAppState(): void {
    LifecycleManager.getInstance().reset();
    ClientSettings.reset();
    LoggerManager.clearLog();
    SecureStore.getInstance().removeStore();
    // BCP-1980252600 If user enter demo mode first, the mainPageRendered flag is set. When user reset client
    // this flag should reset as well.
    this.setMainPageRendered(false);
  }


  public static resetInitializedOData() {
    if (IDataService.isValid()) {
      IDataService.instance().clearResolvedServiceInfo();
    } else {
      // When resetting before the application has been gone through 'launchAppMainPage()' has occured,
      // the IDataService instance hasn't been generated. This reset can occur, on client startup after a successful
      // onboarding.  The passcode screen is the launch screen, and reset due to hitting max attempts or init reset.
      // This becomes a temp instance, as 'launchAppMainPage()' will create the singletons and overwrite this instance.
      this.setODataService();
    }
      // remove saved initialized OData definitions and reset user associated with it
      ClientSettings.clearODataInitializedDefinitions();
      ClientSettings.setUserForPendingODataTxns('');
  
    const service = IDataService.instance();
    let paths = new Set(ClientSettings.getHistoricalODataServicePath());
    const serviceNames = ClientSettings.getApplicationServicePaths();
    let promises = [];
    if (serviceNames && serviceNames.length > 0) {
      for (const serviceName of serviceNames) {
        if (IDefinitionProvider.instance().isDefinitionPathValid(serviceName) && service.offlineEnabled(serviceName)) {
          const serviceUrl = serviceName ? service.urlForServiceName(serviceName) : undefined;
          promises.push(this._resetClientHelper(service, serviceUrl));
          if (serviceUrl !== undefined && paths.has(serviceUrl)) {
            paths.delete(serviceUrl);
          }
        }
      }
      ClientSettings.setHistoricalODataServicePath(paths);
    }
    ClientSettings.setApplicationServicePaths([]);
    return promises;
  }

  // This method can be called from places like logout action or when a client needs to be reset
  // due to user forgetting passcode etc.
  // Clears out the Offline store and Secure store and reset client state.
  public static resetClient(): Promise<any> {

    try {
      ImageHelper.deleteCachedImages();
    } catch (err) {
      Logger.instance.core.error('Failed to clear cache directory: ' , err);
    }

    try {
      OpenDocumentBridge.getInstance().clearCache();
      Logger.instance.core.info('Cleared document cache directory')
    } catch (err) {
        Logger.instance.core.error(`Failed to clear document cache directory: ${err}`);
    }
    // unregister ios applicaion listener
    Application.removeApplicationListener();
    // reset the flags
    Application._resetFlags();
    // unregister for push notifaction
    if (!ClientSettings.isDemoMode()) {
      let applicationId = ClientSettings.getAppId();
      let baseUrl = ClientSettings.getCpmsUrl();
      PushNotification.getInstance().unregisterForPushNotification(applicationId, baseUrl, null);
    }
    let promises = Application.resetInitializedOData();
    if(promises.length === 0) {
        // No service was specified in metadata so offline store was never created.  Just clean-up.
        Application.resetAppState();
        return Promise.resolve();
      }
    return Promise.all(promises)
    .then((result) => {
      return this._clearHistoricalODataOfflineStore();
    }).then((result) => {
      Application.resetAppState();
      Logger.instance.startup.log(Logger.STARTUP_STORE_CLIENT_RESET_SUCCEED);
      ClientSettings.setApplicationServicePaths([]);
      // BCP-1970439179: Close all active dialogs on reset
      MessageDialog.getInstance().closeAll();
    }).catch(e => {
      Logger.instance.app.error(e);
    });
  }

  public static start(): Promise<NavigationEntry> {
    try {
      SDKStylingManager.applyBrandingStyles();

      // Onboarding has 4 main stages. WelcomePage ->CloudLogin ->EULA screen ->Passcode screen
      // Further details: Github /snowblind/sdk/blob/docs/onboarding/docs/onboarding/Onboarding.md
      // We won't have meta-data until user onboards and hooks up with LCMS.
      // Launch welcome page with the contents returned from FioriUI if this is a first launch.
      application.on('foregroundNotificationEvent', Application.onReceivePushNotification);
      application.on('contentAvailableEvent', Application.onReceivePushNotification);
      application.on('receiveNotificationResponseEvent', Application.onReceiveNotificationResponse);
      application.on(application.systemAppearanceChangedEvent, (eventData: SystemAppearanceChangedEventData) => {
        // only update if the var is empty for two reasons:
        // - there is a known issue from NS where on app suspend, 
        //   this event would be triggered twice even there is no appearance changes
        //   https://github.com/NativeScript/NativeScript/issues/8411
        // - currently there are only two possible values (dark / light)
        //   if after app is suspended, user go to device settings and change the appearance and then revert the change
        //   then we can treat it as no changes occurred.
        if (!Application._newSystemAppearance ||  Application._newSystemAppearance === '') {
          Application._newSystemAppearance = eventData.newValue;
        } else {
          Application._newSystemAppearance = '';
        }
      });
      if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent,
          (args: application.AndroidActivityBackPressedEventData) => {
          let triggerBackPressedHandler = true;
          const topFrame = TabFrame.getCorrectTopmostFrame();
          if (topFrame && topFrame.currentPage) {
            const page = topFrame.currentPage;
            if (page.hasListeners(application.AndroidApplication.activityBackPressedEvent)) {
              triggerBackPressedHandler = false;
              page.notify(args);
            }
          }

          if (triggerBackPressedHandler) {
            this.activityBackPressedEventHandler(args);
          }
        });
      }
      if (ClientSettings.hasLogSettings()) {
        application.on(application.launchEvent, () => {
          LoggerManager.init(ClientSettings.getLogFileName(), ClientSettings.getLogFileSize());
          let logger = LoggerManager.getInstance();
          // BCP-2070204172, set log level from the user settings, if earlier set.
          let levelFromUserDefaults = logger.getLevelFromUserDefaults();
          if (levelFromUserDefaults !== '') {
            logger.setLevel(levelFromUserDefaults);
          } else {
            logger.setLevel(ClientSettings.getLogLevel());
          }
          logger.on();
        });
      }

      // Instantiate definition provider instance and set context to support i18n on Onboarding stage.
      return this._setDefinitionProvider(undefined).then(() => {
        IContext.setFromPageFunction(Context.fromPage);
        this.initializeLocalizationAndCustomization();

        NavigationBarBridge.applyFioriStyle();
        Application.context = new Context({}, this);

        // The onboarded flag and AppState is persisted in user settings so will be
        // available if app exits and relaunched.
        if (!ClientSettings.isDemoMode()) {
          // First time launch.  Take user to welcome page for onboarding (or demo mode.)
          let promise: Promise<any>;
          if (ClientSettings.isOnboardingInProgress()) {
            promise = PageRenderer.showWelcomePage();
          } else {
            promise = PageRenderer.showPasscodePage();
          }
          return promise;
        } else {
          // This is a re-launch of the app, perhaps user exited the app.
          // Demo mode user: Use our hard-coded passcode.
          let mainPage = Application._applicationParams.mainPage;
          return IDefinitionProvider.instance().getDefinition(mainPage).then((pageDef) => {
            if (pageDef.getSideDrawer() !== undefined) {
              return PageRenderer.showStartupPage(mainPage);
            } else {
              return Application.launchAppMainPage(false);
            }
          });
        }
      });
    } catch (error) {
      Logger.instance.startup.error(Logger.ERROR, error, error.stack);
      return Promise.reject(error);
    }
  }

  public static startApplication(secretKeys: any) {
    // startApplication is called on onboard complete (enter live moe) or entering demo mode
    if (ClientSettings.isLiveMode()) {
      // Onboarding is completed and passcode (and other keys) now available.
      SecureStore.getInstance().setString('OFFLINE_STORE_ENCRYPTION_KEY', secretKeys.get('OfflineKey'));
      ClientSettings.setPasscodeSource(secretKeys.get('PasscodeSource'));
    }
    // when entering demo, use the default passcode.  The default is handled by ClientSettings, so no-op

    // set isResumeEventDelayed to true to disable onResume event when first time launch app for android
    // if isPasscodeRequired = true will ingore onResume event, for those cases we need to ignore onResume event
    // 1 First launch app
    // 2 when app come back to foreground before passcode timeout
    // 3 passcode changes
    // 4 app reset and start
    this.setResumeEventDelayed(true);

    return Application.launchAppMainPage(true);
  }

  // used to update the application when the definitions have been updated
  // handles calls to onWillUpdate and onDidUpdate for the update process
  public static update(bundlePath: string) {
    let isAppUpdating: boolean = false;
    if (!this._appDefinition) {
      return Promise.reject('No application definitions loaded');
    }
    if (!Application.isOnBoardingComleted()) {
      return Promise.reject('App update pending due to application is not running');
    }

    const previousServicePaths = ClientSettings.getApplicationServicePaths();
    const previousAppTheme = ClientSettings.getTheme();
    Application.setOnUpdateProcessing(true);
    return Application.onWillUpdate().then((result) => {
      isAppUpdating = true;
      return this._setDefinitionProvider(bundlePath).then(() => {
        this._resolveApplicationStyleSheet();
        return Application.doLoadMainPageAndDidUpdate(previousAppTheme).then(() => {
          if (LifecycleManager.getInstance().promoteStagedVersion()) {
            this._setVersionInfo();
          }
          LifecycleManager.getInstance().startDelayed();
        }).catch((error) => {
          // Alert the user for rollback
          alert(I18nHelper.localizeMDKText('update_fail_roll_back') + ` ${error.message}`).then(() => {
            // Reset application to previous app
            Application.setOnUpdateProcessing(false);
            // Restore application theme
            ClientSettings.setTheme(previousAppTheme);
            this._refreshStylePaths(previousAppTheme);
            return this._rollbackDefinitionProvider().then(() => {
              LifecycleManager.getInstance().startDelayed();
              Logger.instance.appUpdate.error(Logger.APPUPDATE_FAILED, error);
              if (isAppUpdating) {
                // We ran into an error while updating.  For now, send user back to main page.
                Logger.instance.appUpdate.log(Logger.APPUPDATE_ROLL_BACK_PREVIOUS, previousServicePaths.toString());
                ClientSettings.setApplicationServicePaths(previousServicePaths);
                return Application.doLoadMainPageAndDidUpdate(previousAppTheme);
              }
            });
          });
        });
      });
    }).catch((error) => {
      Application.setOnUpdateProcessing(false);
      LifecycleManager.getInstance().startDelayed();
      Logger.instance.appUpdate.error(Logger.APPUPDATE_FAILED, error);
    });
  }

  // re-initialize logger for onboarding process when logout
  public static reInitializeLogger() {
    if (ClientSettings.hasLogSettings()) {
      LoggerManager.init(ClientSettings.getLogFileName(), ClientSettings.getLogFileSize());
      let logger = LoggerManager.getInstance();
      logger.on();
      logger.setLevel(ClientSettings.getLogLevel());
    }
  }

  public static activityBackPressedEventHandler(args: application.AndroidActivityBackPressedEventData) {
    const topFrame: any = TabFrame.getCorrectTopmostFrame();
    if (this._shouldMoveTaskToBackground(topFrame)) {
      let moveTaskToBackground = true;
      // if topFrame is TabFrame, check for the parent frame, 
      // ensure that the parent frame does not have back stack before proceed with move task to background.
      if (TabFrame.isTab(topFrame)) {
        const parentPage = (topFrame as TabFrame).parentPage;
        const parentFrame = parentPage.frame;
        if (!this._shouldMoveTaskToBackground(parentFrame)) {
          moveTaskToBackground = false;
          parentFrame.goBack();
        }
      }

      if (moveTaskToBackground) {
        // BCP-1880693267
        // If we are on the main page and the back button is pressed, we just want to treat it like we are
        // backgrounding the app.  If we are on a secondary page, just let Android back up normally
        args.cancel = true;
        const activity = application.android.foregroundActivity;
        if (activity) {
          if (activity.getClass().getSimpleName() === 'MDKAndroidActivity') {
            activity.moveTaskToBack(false);
          }
        }
      }
    } 
  }

  public static setOnboardingCompleted(completed: boolean) {
    this._onBoardingCompleted = completed;
  }

  public static isOnBoardingComleted(): boolean {
    return this._onBoardingCompleted;
  }

  public static setResumeEventDelayed(delayed: boolean) {
    this._resumeEventDelayed = delayed;
  }

  public static isResumeEventDelayed(): boolean  {
    return this._resumeEventDelayed;
  }

  public static setPendingResumeEventData(eventData: ApplicationEventData) {
    this._pendingResumeEventData = eventData;
  }

  public static getPendingResumeEventData(): ApplicationEventData  {
    return this._pendingResumeEventData;
  }

  public static isOnUpdateProcessing() {
    return this._onUpdateProcessing;
  }

  public static setOnUpdateProcessing(flag: boolean) {
    this._onUpdateProcessing = flag;
  }

  public static isOnResumeProcessing() {
    return this._onResumeProcessing;
  }

  public static setOnResumeProcessing(flag: boolean) {
    this._onResumeProcessing = flag;
  }

  public static initializeLocalizationAndCustomization() {
    // reload app language for i18n
    I18nLanguage.loadAppLanguage();
    // customize & localize onboarding screens (passcode, touchId, EULA...)
    let params = ClientSettings.getOnboardingCustomizations();
    OnboardingCustomizationBridge.configOnboardingPages(params);
  }

  public static getApplicationParams(): IApplicationData {
    return this._applicationParams;
  }

  public static applyThemeOnApplication(theme: string, existingTheme: string, initialLaunch: boolean): any {
    this._refreshStylePaths(theme);
    if (!initialLaunch) {
      return Application.doLoadMainPage(existingTheme);
    }
    return;
  }

  public static setODataService() {
    IDataService.setInstance(new ODataService());
    IRestService.setInstance(new RestService());
  }

  private static _mainPageRendered = false;
  private static _nonNSActivityDone = false;

  private static _applicationParams: IApplicationData = {
    mainPage: '',
    stylePath: '',
    sdkStylePath: '',
    version: '',
    localization: '',
    cssStylePath: '',
    sdkStyleSheetPath: '',
  };
  private static _appDefinition: ApplicationDefinition;
  private static _pendingResumeEventData: ApplicationEventData;
  private static _onBoardingCompleted: boolean = false;
  private static _resumeEventDelayed: boolean = false;
  private static _onExitIgnoreCount: number = 0;
  private static _onUpdateProcessing: boolean = false;
  private static _onResumeProcessing: boolean = false;
  private static _newSystemAppearance: string;

  private static _createSingletons(): Promise<any> {
    return this._setDefinitionProvider(undefined).then(() => {
      Application.setODataService();
      IActionFactory.setCreateFunction(ActionFactory.Create);
      IActionFactory.setCreateActionRunnerFunction(ActionFactory.CreateActionRunner);
      ISegmentFactory.setBuildFunction(SegmentFactory.build);
      IControlFactory.setCreateFunction(ControlFactorySync.Create);
      IContext.setFromPageFunction(Context.fromPage);
    });
  }

  private static _executeWithHandlerPaths(handlerPath: string[], appEventData: ApplicationEventData): Promise<any> {
    let promises: Promise<any>[] = handlerPath.map(rule => {
      return Application._executeWithHandlerPath(rule, appEventData);
    });

    return Promise.all(promises);
  }

  private static _executeWithHandlerPath(handlerPath: string, appEventData: ApplicationEventData): Promise<any> {
    if (handlerPath) {
      Context.fromPage().clientAPIProps.appEventData = appEventData;
      let oEventHandler = new EventHandler();
      // this will typically be a rule but in the future could very well be an action
      return oEventHandler.executeActionOrRule(handlerPath, Context.fromPage()).catch(error => {
        Logger.instance.startup.error(Logger.STARTUP_EXECUTE_FAILED, handlerPath, error);
        throw new Error(error);
      });
    } else if (appEventData && appEventData.ios) {
      // For iOS applications, args.ios is NativeScriptError.
      Logger.instance.startup.log(Logger.STARTUP_ERROR_IN_APPEVENTDATA_IOS, Application._appDefinition.getName(),
        appEventData.ios);
      Logger.instance.startup.log(Logger.STARTUP_STACKTRACE, appEventData.ios.stack);
      return Promise.reject(Application._appDefinition.getName() + ' Error ' + appEventData.ios);
    }
  }

  private static _launchStartupEvents(timeout: number): Promise<any> {
    // the timeout is to allow {N} to continue initializing before we launch our events
    return new Promise((resolve) => {
      setTimeout(() => {
        return Application.onLaunch(undefined).then(() => {
          resolve();
        });
      }, timeout);
    }).then(() => {
      /** Application launch ensures all the OData Services have been initialized.
       * Side drawer is created before the OData services are initialized.
       * Hence, we redraw the side drawer after the application launch to make sure
       * if side drawer definition uses any entity or OData Service result, the side drawer control
       * is updated with the correct values.
       */
      if (PageRenderer.appLevelSideDrawer !== undefined) {
        PageRenderer.appLevelSideDrawer.redraw();
      }
    });
  }

  // If there are pending uploads in the offline store:
  // With force being true, the offline store gets nuked regardless of pending transactions.
  // (For now, the requirement is to always do a reset client, so force will always be true)
  // We are returned to welcome screen after a client reset.
  private static _resetClientHelper(service: any, serviceUrl: any, force: boolean = true): Promise<any> {
    return service.clearOfflineStore({ serviceUrl, force }).then(() => {
      //
    }).catch (e => {
      Logger.instance.app.error(e);
      // We got here most likely because store clear failed because said store does not exist or did not
      // initialize correctly.  As user is attempting a reset, just allow user to proceed to welcome screen.
    });
  }

  private static _rollbackDefinitionProvider(): Promise<any> {
    return this._setDefinitionProvider(LifecycleManager.getInstance().getCurrentDefinitionPath());
  }

  private static _setDefinitionProvider(definitionPath: string): Promise<any> {
    let currentDefinitionPath;
    let demoBundlePath;
    let bundleDefinitionLoader: IDefinitionLoader;
    if (ClientSettings.isDemoMode()) {
      demoBundlePath = ClientSettings.getDemoBundlePath();
      if (typeof demoBundlePath !== 'undefined' && demoBundlePath !== null && typeof demoBundlePath === 'string') {
        // We are in demo mode and user has specified a relative path for the bundle in branded settings.
        // The relative path ends with bundle file name. For Example, "BundlePath": "/bundles/bundle.js"
        // The bundleDefinitionLoader will check for this file's existence and if not found,
        // will fall back to usual demo.js located in app folder.
        currentDefinitionPath = fs.path.join(Paths.getOverridePath(), demoBundlePath);
      }
      bundleDefinitionLoader = new DemoBundleDefinitionLoader(currentDefinitionPath);
    } else {
      currentDefinitionPath = definitionPath ? definitionPath :
        LifecycleManager.getInstance().getCurrentDefinitionPath();
      bundleDefinitionLoader = new BundleDefinitionLoader(currentDefinitionPath);
    }

    return bundleDefinitionLoader.loadBundle().then(() => {
      IDefinitionProvider.setInstance(new DefinitionProvider(bundleDefinitionLoader));
      this._appDefinition = IDefinitionProvider.instance().getApplicationDefinition() as ApplicationDefinition;
      return this._resolveApplicationParams();
    });
  }

  private static _setupForApplicationLaunch(didLaunchApp: boolean, definitionPath: string) {
    application.on(application.uncaughtErrorEvent, Application.onUnCaughtError);
    application.on(application.exitEvent, Application.onExit);
    if (application.ios) {
      application.on(application.suspendEvent, Application.onSuspend);
      application.on(application.resumeEvent, Application.onResume);
    }

    this._setVersionInfo();

    if (didLaunchApp) {
      // for BCP-1880610016, further postpone the OnLaunch event
      // to make sure it is triggered after main page is rendered
      // TODO-FUTURE: we should find a better way to get rid of the timer
      // being used in _launchStartupEvents()

      // coming out of the welcome page seems to take a bit longer
      return Application._launchStartupEvents(1500).then(() => {
        Application.setMainPageRendered(true);
      });
    } else {
      return application.on(application.launchEvent, () => {
        return Application._launchStartupEvents(250);
      });
    }
  }

  private static doLoadMainPageAndDidUpdate(existingTheme?: string): Promise<any> {
    PageRenderer.setPageReference(this._appDefinition.getMainPage());
    return this.doLoadMainPage(existingTheme).then(() => {
      // SNOWBLIND-5320: We need to give the main page a bit of time to render before we run
      // the onDidUpdate() action so it can handle any redraws that it needs to make with the result
      // Wrapped the timer in a promise to make sure the promise chain is returned correctly.
      return new Promise((resolve) => {
        // Use Nativescript's timer implementation to make this testable.
        // Using JS's setTimeout made this untestable as couldn't set the fake timer to tick
        // at the exact point.
        setTimeout(resolve, 750);
      }).then(() => {
        return this.didUpdate();
      });
    });
  }

  private static applyStyles(existingTheme?: string) {
    // SEAM-67: reload styles after LCMS update
    const stylePath = Application._applicationParams.cssStylePath;
    if (stylePath) {
      const style = IDefinitionProvider.instance().getDefinition(stylePath);
      if (style) {
        Application._applyCssOnApplication(style.toString(), existingTheme);
        // SEAM-67: indicator to update ruleset on CssPropertyParser
        ClientSettings.setUpdateCSSRuleSetFlag(true);
        Logger.instance.appUpdate.log(Logger.SUCCESSFULLY_APPLY_STYLES, stylePath);
      }
    }

    const sdkStylePath = this._getSDKStylePath();
    if (sdkStylePath) {
      const sdkStyle = IDefinitionProvider.instance().getDefinition(sdkStylePath);
      if (sdkStyle) {
        let content = sdkStyle.toString();
        if (typeof(sdkStyle === 'object') && sdkStyle instanceof Array === false) {
          content = JSON.stringify(sdkStyle);
        }
        SDKStylingManager.saveSDKStyleFile(content).then(() => {
          Logger.instance.appUpdate.log(Logger.SUCCESSFULLY_APPLY_SDK_STYLES, sdkStylePath);
          SDKStylingManager.applySDKStyle();
        }, (error) => {
          Logger.instance.appUpdate.error(Logger.ERROR, error, error.stack);
        });
      }
    }
  }

  private static doLoadMainPage(existingTheme?: string): Promise<any> {
    if (ModalFrame.isTopMostModal()) {
      Frame.topmost().closeModal();
    } else if (TabFrame.isTopMostTab()) {
      let topFrame = Frame.topmost();
      if (topFrame && topFrame.currentPage && topFrame.currentPage.modal) {
        topFrame.currentPage.modal.closeModal();
      }
    }

    this.applyStyles(existingTheme);

    this.initializeLocalizationAndCustomization();

    ClientSettings.resetExtensionControlSourceMap();

    return this.resetApplicationRootViewIfSideDrawerChanged().then(() => {
      let launchPromise;
      const mainPage = Application._applicationParams.mainPage;
      if (PageRenderer.appLevelSideDrawer !== undefined) {
        launchPromise = PageRenderer.appLevelSideDrawer.renderMainPage();
      } else { 
        launchPromise = PageRenderer.pushNavigation(mainPage, true, MDKNavigationType.Root);
      }
      return launchPromise;
    });
  }

  private static didUpdate(): Promise<any> {
    Application.setOnUpdateProcessing(true);
    return Application.onDidUpdate().then((result) => {
      if (PageRenderer.appLevelSideDrawer !== undefined) {
        PageRenderer.appLevelSideDrawer.redraw();
      }
      Application.setOnUpdateProcessing(false);
      return Promise.resolve(result);
    }).catch((error) => {
      Application.setOnUpdateProcessing(false);
      return Promise.reject(error);
    });
  }

  private static resetApplicationRootViewIfSideDrawerChanged() {
    let rootView = application.getRootView();
    const mainPageRef = Application._applicationParams.mainPage;
    return IDefinitionProvider.instance().getDefinition(mainPageRef).then((mainPageDef) => {
      if (mainPageDef.getSideDrawer() !== undefined || rootView instanceof RadSideDrawer) {
        return PageRenderer.startupNavigation(undefined, false).then((rootEntry) => {
          application._resetRootView(rootEntry);
        });
      } else {
        return Promise.resolve();
      }
    });
  }

  private static _setVersionInfo() {
    if (Application._applicationParams.version) {
      if (application.android && !application.android.context) {
        //  BCP2080296683, System.err: Unable to start activity
        // when demo application restart, we don't need set version again if application.android.context
        // is unavailable, as the version has been saved to android SharedPreferences when start application first time.
      } else {
        VersionInfoBridge.setVersionInfo(Application._applicationParams.version);
      }
    }
  }

  private static _shouldMoveTaskToBackground(frame: any): boolean {
    return frame && !ModalFrame.isModal(frame) && 
      ((frame.backStack && frame.backStack.length === 0) || !frame.backStack);
  }

  private static removeApplicationListener() {
    application.off(application.uncaughtErrorEvent, Application.onUnCaughtError);
    application.off(application.exitEvent, Application.onExit);
    if (application.ios) {
      application.off(application.suspendEvent, Application.onSuspend);
      application.off(application.resumeEvent, Application.onResume);
    }
  }

  private static _resetFlags(): void {
    Application.setOnboardingCompleted(false);
    Application.setOnUpdateProcessing(false);
    Application.setResumeEventDelayed(false);
    Application.setPendingResumeEventData(null);
  }

  private static _clearHistoricalODataOfflineStore(): Promise<any> {
    let promises = [];
    let force: boolean = true;
    let _historicalODataServicePath = ClientSettings.getHistoricalODataServicePath();
    const service = IDataService.instance();
    _historicalODataServicePath.forEach((serviceUrl) => {
      promises.push(this._resetClientHelper(service, serviceUrl));
    });
    _historicalODataServicePath = new Set<String>();
    ClientSettings.setHistoricalODataServicePath(_historicalODataServicePath);
    return Promise.all(promises);
  }

  private static _resolveApplicationParams(): Promise<any> {
    let builder = new ApplicationDataBuilder(Context.fromPage());
    builder.setMainPage(this._appDefinition.getMainPage())
    .setStylePath(this._appDefinition.getStyles())
    .setSDKStylesPath(this._appDefinition.getSDKStyles())
    .setVersion(this._appDefinition.getVersion())
    .setLocalization(this._appDefinition.getLocalization());
    return builder.build().then((result: IApplicationData) => {
      if (result) {
        Application._applicationParams = result;
      }
    });
  }

  private static _resolveApplicationStyleSheet() {
    let stylesObject = this._appDefinition.getStyleSheets();
    let stylePath = this._applicationParams.stylePath;
    let activeTheme = ClientSettings.getTheme();

    ClientSettings.resetApplicationTheme();
    if (stylesObject) {
      let availableThemes = Object.keys(stylesObject);
      if (availableThemes && availableThemes.length > 0) {
        ClientSettings.setAvailableThemes(availableThemes.join(","));

        if (!activeTheme && stylePath) {
          let aPathElements = stylePath.split("/");
          let sThemeFileName = aPathElements[aPathElements.length - 1];
          if (sThemeFileName.endsWith('.less')) {
            activeTheme = sThemeFileName.slice(0, -5);
          }
          if (sThemeFileName.endsWith('.css')) {
            activeTheme = sThemeFileName.slice(0, -4);
          }
        }
        if (activeTheme) {
          // set initialLaunch as true to prevent load main page trigger in applyThemeOnApplication
          const result = Application._setThemeOnly(activeTheme);
        }
      }
    }
  }

  private static _setThemeOnly(themeName: string) {
    // call setTheme without load main page, then trigger applyStyles manually
    const previousAppTheme = ClientSettings.getTheme();
    StyleHelper.setTheme(themeName, true);
    this.applyStyles(previousAppTheme);
  }

  private static _refreshStylePaths(theme) {
    this._applicationParams.cssStylePath = this._appDefinition.getCSSStyles(theme);
    this._applicationParams.sdkStyleSheetPath = this._appDefinition.getSDKStyles(theme);
  }

  private static _getSDKStylePath() {
    if (this._applicationParams.sdkStyleSheetPath) {
      return this._applicationParams.sdkStyleSheetPath;
    }
    return this._applicationParams.sdkStylePath;
  }

  private static _applyCssOnApplication(styleString: string, existingTheme?: string) {
    if (existingTheme) {
      StyleScope.removeTaggedAdditionalCSS(existingTheme);
    }
    let tagName = ClientSettings.getTheme();
    StyleScope.addTaggedAdditionalCSS(styleString, tagName);
  }
}
