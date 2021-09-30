require("./runtime.js");require("./vendor.js");module.exports =
(global["webpackJsonp"] = global["webpackJsonp"] || []).push([[0],[
/* 0 */
/***/ (function(module, exports) {

module.exports = require("mdk-sap");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/storage/ClientSettings");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/utils/Logger");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("tns-core-modules/file-system");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = __webpack_require__(16);
var dialogs_1 = __webpack_require__(30);
var application = __webpack_require__(6);
var IContext = __webpack_require__(31);
var Context_1 = __webpack_require__(32);
var ClientSettings_1 = __webpack_require__(1);
var ClientSettings_2 = __webpack_require__(1);
var PageRenderer_1 = __webpack_require__(17);
var MDKPage_1 = __webpack_require__(18);
var DefinitionProvider_1 = __webpack_require__(33);
var IDefinitionProvider_1 = __webpack_require__(34);
var EventHandler_1 = __webpack_require__(19);
var BundleDefinitionLoader_1 = __webpack_require__(8);
var DemoBundleDefinitionLoader_1 = __webpack_require__(9);
var IDataService_1 = __webpack_require__(36);
var ODataService_1 = __webpack_require__(37);
var IRestService_1 = __webpack_require__(38);
var RestService_1 = __webpack_require__(39);
var LifecycleManager_1 = __webpack_require__(7);
var IActionFactory_1 = __webpack_require__(45);
var ActionFactory_1 = __webpack_require__(46);
var ISegmentFactory_1 = __webpack_require__(47);
var SegmentFactory_1 = __webpack_require__(48);
var IControlFactory_1 = __webpack_require__(49);
var SecureStore_1 = __webpack_require__(50);
var SDKStylingManager_1 = __webpack_require__(51);
var mdk_sap_1 = __webpack_require__(0);
var mdk_sap_2 = __webpack_require__(0);
var TypeConverter_1 = __webpack_require__(52);
var Logger_1 = __webpack_require__(2);
var AppSettingsManager_1 = __webpack_require__(53);
var I18nLanguage_1 = __webpack_require__(21);
var I18nHelper_1 = __webpack_require__(54);
var mdk_sap_3 = __webpack_require__(0);
var fs = __webpack_require__(3);
var mdk_sap_4 = __webpack_require__(0);
var mdk_sap_5 = __webpack_require__(0);
var Paths_1 = __webpack_require__(11);
var ModalFrame_1 = __webpack_require__(55);
var ControlFactorySync_1 = __webpack_require__(56);
var mdk_sap_6 = __webpack_require__(0);
var ImageHelper_1 = __webpack_require__(57);
var TabFrame_1 = __webpack_require__(58);
var mdk_sap_7 = __webpack_require__(0);
var ApplicationDataBuilder_1 = __webpack_require__(59);
var MDKNavigationType_1 = __webpack_require__(60);
var nativescript_ui_sidedrawer_1 = __webpack_require__(61);
var StyleHelper_1 = __webpack_require__(62);
var StyleScope = __webpack_require__(13);
var Application = (function () {
    function Application() {
    }
    Application.isMainPageRendered = function () {
        return this._mainPageRendered;
    };
    Application.setMainPageRendered = function (mainPageRendered) {
        this._mainPageRendered = mainPageRendered;
    };
    Application.isNonNSActivityDone = function () {
        return this._nonNSActivityDone;
    };
    Application.setNonNSActivityDone = function (nonNSActivityDone) {
        this._nonNSActivityDone = nonNSActivityDone;
    };
    Application.launchAppMainPage = function (didLaunchApp) {
        var _this = this;
        this.setOnboardingCompleted(true);
        Application.setOnResumeProcessing(false);
        return this._createSingletons().then(function () {
            AppSettingsManager_1.AppSettingsManager.instance().removePendingActions();
            var startupPage = Application._applicationParams.mainPage;
            PageRenderer_1.PageRenderer.setPageReference(startupPage);
            _this.initializeLocalizationAndCustomization();
            _this._resolveApplicationStyleSheet();
            _this.applyStyles();
            var launchPromise;
            if (didLaunchApp) {
                if (PageRenderer_1.PageRenderer.appLevelSideDrawer !== undefined) {
                    launchPromise = PageRenderer_1.PageRenderer.appLevelSideDrawer.renderMainPage();
                }
                else {
                    launchPromise = PageRenderer_1.PageRenderer.pushNavigation(startupPage, true, MDKNavigationType_1.MDKNavigationType.Root);
                }
            }
            else {
                launchPromise = PageRenderer_1.PageRenderer.startupNavigation(startupPage, true);
            }
            if (application.android) {
                mdk_sap_2.ActivityIndicator.instance.setScreenSharing(ClientSettings_1.ClientSettings.getScreenSharingWithAndroidVersion());
            }
            return launchPromise.then(function (result) {
                Application._setupForApplicationLaunch(didLaunchApp, undefined);
                return result;
            }).catch(function (error) {
                Logger_1.Logger.instance.startup.error(Logger_1.Logger.ERROR, error, error.stack);
            });
        });
    };
    Application.onDidUpdate = function () {
        var handlerPath = Application._appDefinition.getOnDidUpdate();
        if (handlerPath) {
            return Application._executeWithHandlerPath(handlerPath, undefined);
        }
        else {
            return Promise.resolve();
        }
    };
    Application.onUserSwitch = function (eventData) {
        var handlerPath = Application._appDefinition.getOnUserSwitch();
        if (handlerPath) {
            return Application._executeWithHandlerPath(handlerPath, eventData);
        }
        else {
            return Promise.resolve();
        }
    };
    Application.onExit = function (appEventData) {
        Application.removeApplicationListener();
        Application.setOnboardingCompleted(false);
        Application.setMainPageRendered(false);
        var handlerPath = Application._appDefinition.getOnExit();
        return Application._executeWithHandlerPath(handlerPath, appEventData);
    };
    Application.onLaunch = function (appEventData) {
        var _this = this;
        var sHandlerPath = Application._appDefinition.getOnLaunch();
        return Application._executeWithHandlerPaths(TypeConverter_1.TypeConverter.toArray(sHandlerPath), appEventData).then(function () {
            if (ClientSettings_1.ClientSettings.isLiveMode()) {
                LifecycleManager_1.LifecycleManager.getInstance().start();
            }
        }).catch(function (error) {
            Logger_1.Logger.instance.startup.error(Logger_1.Logger.STARTUP_LAUNCH_FAILED, error);
            if (ClientSettings_1.ClientSettings.isLiveMode()) {
                LifecycleManager_1.LifecycleManager.getInstance().start();
            }
        }).then(function () {
            _this._processLinkData();
        }).then(function () {
            Application.setResumeEventDelayed(false);
        });
    };
    Application.onUnCaughtError = function (appEventData) {
        var handlerPath = Application._appDefinition.getOnUnCaughtError();
        Application._executeWithHandlerPath(handlerPath, appEventData);
    };
    Application.onSuspend = function (appEventData) {
        Application.setOnResumeProcessing(false);
        if (!ClientSettings_1.ClientSettings.isDemoMode() && !Application.isOnBoardingComleted()) {
            return null;
        }
        LifecycleManager_1.LifecycleManager.getInstance().stop();
        var handlerPath = Application._appDefinition.getOnSuspend();
        Application._executeWithHandlerPath(handlerPath, appEventData);
    };
    Application.onResume = function (appEventData) {
        if (Application.isOnResumeProcessing()) {
            return null;
        }
        if (!ClientSettings_1.ClientSettings.isDemoMode()) {
            if (!Application.isOnBoardingComleted() || Application.isResumeEventDelayed()) {
                Logger_1.Logger.instance.app.info("App onResume handler is to be delayed, setting the appEventData - " + appEventData);
                Application.setPendingResumeEventData(appEventData);
                return null;
            }
        }
        Application.setOnResumeProcessing(true);
        if (Application.isNonNSActivityDone() && appEventData && appEventData.eventName !== 'relaunched') {
            LifecycleManager_1.LifecycleManager.getInstance().startDelayed();
            Application.setNonNSActivityDone(false);
        }
        else if (appEventData === null || appEventData === undefined || appEventData.eventName !== 'relaunched') {
            LifecycleManager_1.LifecycleManager.getInstance().start();
        }
        MDKPage_1.MDKPage.resetNavigateFlags();
        var hasDeviceLanguageChanged = false;
        var hasDeviceFontScaleChanged = false;
        var prevAppLanguage = I18nLanguage_1.I18nLanguage.getAppLanguage();
        var prevAppFontScale = ClientSettings_1.ClientSettings.getAppFontScale();
        Application.initializeLocalizationAndCustomization();
        var appLanguageSource = ClientSettings_1.ClientSettings.getAppLanguageSource();
        var currentAppLanguage = I18nLanguage_1.I18nLanguage.getAppLanguage();
        var currentAppFontScale = ClientSettings_1.ClientSettings.getAppFontScale();
        if (appLanguageSource === I18nLanguage_1.LanguageSource.DeviceSetting) {
            hasDeviceLanguageChanged = prevAppLanguage !== currentAppLanguage;
        }
        hasDeviceFontScaleChanged = prevAppFontScale !== currentAppFontScale;
        var definitionOnResumePromise;
        var handlerPath = Application._appDefinition.getOnResume();
        if (handlerPath) {
            definitionOnResumePromise = Application._executeWithHandlerPath(handlerPath, appEventData);
        }
        else {
            definitionOnResumePromise = Promise.resolve();
        }
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        definitionOnResumePromise.then(function () {
            if (application.android && (hasDeviceLanguageChanged || hasDeviceFontScaleChanged)) {
                if (topFrame) {
                    setTimeout(function () {
                        if (PageRenderer_1.PageRenderer.appLevelSideDrawer !== undefined) {
                            PageRenderer_1.PageRenderer.appLevelSideDrawer.renderMainPage();
                        }
                        else {
                            PageRenderer_1.PageRenderer.pushNavigation(Application._applicationParams.mainPage, true, MDKNavigationType_1.MDKNavigationType.Root);
                        }
                        Application.setOnResumeProcessing(false);
                    }, 0);
                }
            }
            if (Application._newSystemAppearance && Application._newSystemAppearance !== '') {
                Application._newSystemAppearance = '';
                Application.setOnResumeProcessing(false);
                var validTheme_1 = StyleHelper_1.StyleHelper.getTheme();
                if (application.android) {
                    setTimeout(function () {
                        if (PageRenderer_1.PageRenderer.appLevelSideDrawer !== undefined) {
                            Application._setThemeOnly(validTheme_1);
                            setTimeout(function () {
                                PageRenderer_1.PageRenderer.appLevelSideDrawer.renderMainPage();
                            }, 250);
                        }
                        else {
                            StyleHelper_1.StyleHelper.setTheme(validTheme_1);
                        }
                    }, 0);
                }
                else {
                    if (PageRenderer_1.PageRenderer.appLevelSideDrawer !== undefined) {
                        Application._setThemeOnly(validTheme_1);
                        setTimeout(function () {
                            PageRenderer_1.PageRenderer.appLevelSideDrawer.renderMainPage();
                        }, 250);
                    }
                    else {
                        StyleHelper_1.StyleHelper.setTheme(validTheme_1);
                    }
                }
            }
            else {
                var onLinkDataReceivedDelay = 1500;
                if (topFrame && topFrame.currentPage) {
                    var mdkPage = topFrame.currentPage;
                    if (mdkPage && mdkPage.definition && mdkPage.definition.getOnResumeEvent()) {
                        if (application.android) {
                            mdkPage.isResuming = true;
                            Application.setOnResumeProcessing(false);
                        }
                        else {
                            var onResumeEvent = mdkPage.definition.getOnResumeEvent();
                            var handler = new EventHandler_1.EventHandler();
                            handler.executeActionOrRule(onResumeEvent, mdkPage.context).then(function () {
                                PageRenderer_1.PageRenderer.currentlyRenderedPage = undefined;
                                Application.setOnResumeProcessing(false);
                            }).catch(function () {
                                PageRenderer_1.PageRenderer.currentlyRenderedPage = undefined;
                                Application.setOnResumeProcessing(false);
                            });
                        }
                    }
                }
                setTimeout(function () {
                    if (appEventData && (appEventData.eventName === 'resumed' || appEventData.eventName === 'resume' || appEventData.eventName === 'restored' || appEventData.eventName === 'launch')) {
                        Application._processLinkData();
                    }
                }, onLinkDataReceivedDelay);
            }
        });
    };
    Application._processLinkData = function () {
        var linkData = ClientSettings_1.ClientSettings.getOnLinkDataReceived();
        if (linkData) {
            return Application.onLinkDataReceived(ClientSettings_1.ClientSettings.getOnLinkDataReceived()).finally(function () {
                return ClientSettings_1.ClientSettings.resetOnLinkDataReceived();
            });
        }
    };
    Application.prepareForPopoverRestore = function () {
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        if (topFrame && topFrame.currentPage) {
            var mdkPage = topFrame.currentPage;
            if (mdkPage) {
                if (mdkPage.popOverData) {
                    mdkPage.dismissPopoverForRestore();
                }
            }
        }
    };
    Application.completeForPopoverRestore = function () {
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        if (topFrame && topFrame.currentPage) {
            var mdkPage = topFrame.currentPage;
            if (mdkPage) {
                if (mdkPage.popOverData) {
                    mdkPage.restorePopover();
                }
                if (mdkPage.frame.popOverAnchorItem) {
                    mdkPage.updateModalPopoverAnchor();
                }
            }
        }
    };
    Application.onWillUpdate = function () {
        var handlerPath = Application._appDefinition.getOnWillUpdate();
        if (handlerPath) {
            return Application._executeWithHandlerPath(handlerPath, undefined);
        }
        else {
            return Promise.resolve();
        }
    };
    Application.onLinkDataReceived = function (linkData) {
        var handlerPath = Application._appDefinition.getOnLinkDataReceived();
        if (handlerPath && linkData) {
            return Application._executeWithHandlerPath(handlerPath, linkData);
        }
        else {
            return Promise.resolve();
        }
    };
    Application.onReceiveNotificationResponse = function (notification) {
        return new Promise(function (resolve, reject) {
            (function waitUntilInApp() {
                if (ClientSettings_1.ClientSettings.getOnboardingState() === ClientSettings_2.OnboardingState.Live
                    && Application.isOnBoardingComleted() && Application.isMainPageRendered()) {
                    return Application.onReceivePushNotification(notification).then(function () {
                        return resolve();
                    });
                }
                setTimeout(waitUntilInApp, 250);
            })();
        });
    };
    Application.onReceivePushNotification = function (notification) {
        var handlerPath = Application._appDefinition[notification.eventName + 'Handler'];
        var eventObj = notification.object;
        var payload = eventObj.payload;
        if (payload.notification && payload.notification.titleLocKey) {
            eventObj.title = I18nHelper_1.I18nHelper.localizeDefinitionText(payload.notification.titleLocKey, payload.notification.titleLocArgs, null);
        }
        if (payload.notification && payload.notification.bodyLocKey) {
            eventObj.body = I18nHelper_1.I18nHelper.localizeDefinitionText(payload.notification.bodyLocKey, payload.notification.bodyLocArgs, null);
        }
        if (typeof handlerPath === 'function') {
            handlerPath = handlerPath();
        }
        var completionHandler = notification.object.completionHandler;
        if (handlerPath) {
            return Application._executeWithHandlerPath(handlerPath, eventObj).then(function (result) {
                if (typeof result === 'number') {
                    completionHandler(result);
                }
                else {
                    completionHandler(0);
                }
                return result;
            });
        }
        else {
            if (eventObj.body) {
                dialogs_1.alert(eventObj.body);
            }
            else if (payload.data && payload.data.alert) {
                dialogs_1.alert(payload.data.alert);
            }
            else if (payload.aps && payload.aps.alert) {
                if (typeof payload.aps.alert === 'string') {
                    dialogs_1.alert(payload.aps.alert);
                }
                else if (typeof payload.aps.alert === 'object') {
                    dialogs_1.alert(payload.aps.alert.body);
                }
            }
            return Promise.resolve();
        }
    };
    Application.resetAppState = function () {
        LifecycleManager_1.LifecycleManager.getInstance().reset();
        ClientSettings_1.ClientSettings.reset();
        mdk_sap_4.LoggerManager.clearLog();
        SecureStore_1.SecureStore.getInstance().removeStore();
        this.setMainPageRendered(false);
    };
    Application.resetInitializedOData = function () {
        if (IDataService_1.IDataService.isValid()) {
            IDataService_1.IDataService.instance().clearResolvedServiceInfo();
        }
        else {
            this.setODataService();
        }
        ClientSettings_1.ClientSettings.clearODataInitializedDefinitions();
        ClientSettings_1.ClientSettings.setUserForPendingODataTxns('');
        var service = IDataService_1.IDataService.instance();
        var paths = new Set(ClientSettings_1.ClientSettings.getHistoricalODataServicePath());
        var serviceNames = ClientSettings_1.ClientSettings.getApplicationServicePaths();
        var promises = [];
        if (serviceNames && serviceNames.length > 0) {
            for (var _i = 0, serviceNames_1 = serviceNames; _i < serviceNames_1.length; _i++) {
                var serviceName = serviceNames_1[_i];
                if (IDefinitionProvider_1.IDefinitionProvider.instance().isDefinitionPathValid(serviceName) && service.offlineEnabled(serviceName)) {
                    var serviceUrl = serviceName ? service.urlForServiceName(serviceName) : undefined;
                    promises.push(this._resetClientHelper(service, serviceUrl));
                    if (serviceUrl !== undefined && paths.has(serviceUrl)) {
                        paths.delete(serviceUrl);
                    }
                }
            }
            ClientSettings_1.ClientSettings.setHistoricalODataServicePath(paths);
        }
        ClientSettings_1.ClientSettings.setApplicationServicePaths([]);
        return promises;
    };
    Application.resetClient = function () {
        var _this = this;
        try {
            ImageHelper_1.ImageHelper.deleteCachedImages();
        }
        catch (err) {
            Logger_1.Logger.instance.core.error('Failed to clear cache directory: ', err);
        }
        try {
            mdk_sap_7.OpenDocumentBridge.getInstance().clearCache();
            Logger_1.Logger.instance.core.info('Cleared document cache directory');
        }
        catch (err) {
            Logger_1.Logger.instance.core.error("Failed to clear document cache directory: " + err);
        }
        Application.removeApplicationListener();
        Application._resetFlags();
        if (!ClientSettings_1.ClientSettings.isDemoMode()) {
            var applicationId = ClientSettings_1.ClientSettings.getAppId();
            var baseUrl = ClientSettings_1.ClientSettings.getCpmsUrl();
            mdk_sap_6.PushNotification.getInstance().unregisterForPushNotification(applicationId, baseUrl, null);
        }
        var promises = Application.resetInitializedOData();
        if (promises.length === 0) {
            Application.resetAppState();
            return Promise.resolve();
        }
        return Promise.all(promises)
            .then(function (result) {
            return _this._clearHistoricalODataOfflineStore();
        }).then(function (result) {
            Application.resetAppState();
            Logger_1.Logger.instance.startup.log(Logger_1.Logger.STARTUP_STORE_CLIENT_RESET_SUCCEED);
            ClientSettings_1.ClientSettings.setApplicationServicePaths([]);
            mdk_sap_1.MessageDialog.getInstance().closeAll();
        }).catch(function (e) {
            Logger_1.Logger.instance.app.error(e);
        });
    };
    Application.start = function () {
        var _this = this;
        try {
            SDKStylingManager_1.SDKStylingManager.applyBrandingStyles();
            application.on('foregroundNotificationEvent', Application.onReceivePushNotification);
            application.on('contentAvailableEvent', Application.onReceivePushNotification);
            application.on('receiveNotificationResponseEvent', Application.onReceiveNotificationResponse);
            application.on(application.systemAppearanceChangedEvent, function (eventData) {
                if (!Application._newSystemAppearance || Application._newSystemAppearance === '') {
                    Application._newSystemAppearance = eventData.newValue;
                }
                else {
                    Application._newSystemAppearance = '';
                }
            });
            if (application.android) {
                application.android.on(application.AndroidApplication.activityBackPressedEvent, function (args) {
                    var triggerBackPressedHandler = true;
                    var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
                    if (topFrame && topFrame.currentPage) {
                        var page = topFrame.currentPage;
                        if (page.hasListeners(application.AndroidApplication.activityBackPressedEvent)) {
                            triggerBackPressedHandler = false;
                            page.notify(args);
                        }
                    }
                    if (triggerBackPressedHandler) {
                        _this.activityBackPressedEventHandler(args);
                    }
                });
            }
            if (ClientSettings_1.ClientSettings.hasLogSettings()) {
                application.on(application.launchEvent, function () {
                    mdk_sap_4.LoggerManager.init(ClientSettings_1.ClientSettings.getLogFileName(), ClientSettings_1.ClientSettings.getLogFileSize());
                    var logger = mdk_sap_4.LoggerManager.getInstance();
                    var levelFromUserDefaults = logger.getLevelFromUserDefaults();
                    if (levelFromUserDefaults !== '') {
                        logger.setLevel(levelFromUserDefaults);
                    }
                    else {
                        logger.setLevel(ClientSettings_1.ClientSettings.getLogLevel());
                    }
                    logger.on();
                });
            }
            return this._setDefinitionProvider(undefined).then(function () {
                IContext.setFromPageFunction(Context_1.Context.fromPage);
                _this.initializeLocalizationAndCustomization();
                mdk_sap_1.NavigationBarBridge.applyFioriStyle();
                Application.context = new Context_1.Context({}, _this);
                if (!ClientSettings_1.ClientSettings.isDemoMode()) {
                    var promise = void 0;
                    if (ClientSettings_1.ClientSettings.isOnboardingInProgress()) {
                        promise = PageRenderer_1.PageRenderer.showWelcomePage();
                    }
                    else {
                        promise = PageRenderer_1.PageRenderer.showPasscodePage();
                    }
                    return promise;
                }
                else {
                    var mainPage_1 = Application._applicationParams.mainPage;
                    return IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(mainPage_1).then(function (pageDef) {
                        if (pageDef.getSideDrawer() !== undefined) {
                            return PageRenderer_1.PageRenderer.showStartupPage(mainPage_1);
                        }
                        else {
                            return Application.launchAppMainPage(false);
                        }
                    });
                }
            });
        }
        catch (error) {
            Logger_1.Logger.instance.startup.error(Logger_1.Logger.ERROR, error, error.stack);
            return Promise.reject(error);
        }
    };
    Application.startApplication = function (secretKeys) {
        if (ClientSettings_1.ClientSettings.isLiveMode()) {
            SecureStore_1.SecureStore.getInstance().setString('OFFLINE_STORE_ENCRYPTION_KEY', secretKeys.get('OfflineKey'));
            ClientSettings_1.ClientSettings.setPasscodeSource(secretKeys.get('PasscodeSource'));
        }
        this.setResumeEventDelayed(true);
        return Application.launchAppMainPage(true);
    };
    Application.update = function (bundlePath) {
        var _this = this;
        var isAppUpdating = false;
        if (!this._appDefinition) {
            return Promise.reject('No application definitions loaded');
        }
        if (!Application.isOnBoardingComleted()) {
            return Promise.reject('App update pending due to application is not running');
        }
        var previousServicePaths = ClientSettings_1.ClientSettings.getApplicationServicePaths();
        var previousAppTheme = ClientSettings_1.ClientSettings.getTheme();
        Application.setOnUpdateProcessing(true);
        return Application.onWillUpdate().then(function (result) {
            isAppUpdating = true;
            return _this._setDefinitionProvider(bundlePath).then(function () {
                _this._resolveApplicationStyleSheet();
                return Application.doLoadMainPageAndDidUpdate(previousAppTheme).then(function () {
                    if (LifecycleManager_1.LifecycleManager.getInstance().promoteStagedVersion()) {
                        _this._setVersionInfo();
                    }
                    LifecycleManager_1.LifecycleManager.getInstance().startDelayed();
                }).catch(function (error) {
                    dialogs_1.alert(I18nHelper_1.I18nHelper.localizeMDKText('update_fail_roll_back') + (" " + error.message)).then(function () {
                        Application.setOnUpdateProcessing(false);
                        ClientSettings_1.ClientSettings.setTheme(previousAppTheme);
                        _this._refreshStylePaths(previousAppTheme);
                        return _this._rollbackDefinitionProvider().then(function () {
                            LifecycleManager_1.LifecycleManager.getInstance().startDelayed();
                            Logger_1.Logger.instance.appUpdate.error(Logger_1.Logger.APPUPDATE_FAILED, error);
                            if (isAppUpdating) {
                                Logger_1.Logger.instance.appUpdate.log(Logger_1.Logger.APPUPDATE_ROLL_BACK_PREVIOUS, previousServicePaths.toString());
                                ClientSettings_1.ClientSettings.setApplicationServicePaths(previousServicePaths);
                                return Application.doLoadMainPageAndDidUpdate(previousAppTheme);
                            }
                        });
                    });
                });
            });
        }).catch(function (error) {
            Application.setOnUpdateProcessing(false);
            LifecycleManager_1.LifecycleManager.getInstance().startDelayed();
            Logger_1.Logger.instance.appUpdate.error(Logger_1.Logger.APPUPDATE_FAILED, error);
        });
    };
    Application.reInitializeLogger = function () {
        if (ClientSettings_1.ClientSettings.hasLogSettings()) {
            mdk_sap_4.LoggerManager.init(ClientSettings_1.ClientSettings.getLogFileName(), ClientSettings_1.ClientSettings.getLogFileSize());
            var logger = mdk_sap_4.LoggerManager.getInstance();
            logger.on();
            logger.setLevel(ClientSettings_1.ClientSettings.getLogLevel());
        }
    };
    Application.activityBackPressedEventHandler = function (args) {
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        if (this._shouldMoveTaskToBackground(topFrame)) {
            var moveTaskToBackground = true;
            if (TabFrame_1.TabFrame.isTab(topFrame)) {
                var parentPage = topFrame.parentPage;
                var parentFrame = parentPage.frame;
                if (!this._shouldMoveTaskToBackground(parentFrame)) {
                    moveTaskToBackground = false;
                    parentFrame.goBack();
                }
            }
            if (moveTaskToBackground) {
                args.cancel = true;
                var activity = application.android.foregroundActivity;
                if (activity) {
                    if (activity.getClass().getSimpleName() === 'MDKAndroidActivity') {
                        activity.moveTaskToBack(false);
                    }
                }
            }
        }
    };
    Application.setOnboardingCompleted = function (completed) {
        this._onBoardingCompleted = completed;
    };
    Application.isOnBoardingComleted = function () {
        return this._onBoardingCompleted;
    };
    Application.setResumeEventDelayed = function (delayed) {
        this._resumeEventDelayed = delayed;
    };
    Application.isResumeEventDelayed = function () {
        return this._resumeEventDelayed;
    };
    Application.setPendingResumeEventData = function (eventData) {
        this._pendingResumeEventData = eventData;
    };
    Application.getPendingResumeEventData = function () {
        return this._pendingResumeEventData;
    };
    Application.isOnUpdateProcessing = function () {
        return this._onUpdateProcessing;
    };
    Application.setOnUpdateProcessing = function (flag) {
        this._onUpdateProcessing = flag;
    };
    Application.isOnResumeProcessing = function () {
        return this._onResumeProcessing;
    };
    Application.setOnResumeProcessing = function (flag) {
        this._onResumeProcessing = flag;
    };
    Application.initializeLocalizationAndCustomization = function () {
        I18nLanguage_1.I18nLanguage.loadAppLanguage();
        var params = ClientSettings_1.ClientSettings.getOnboardingCustomizations();
        mdk_sap_5.OnboardingCustomizationBridge.configOnboardingPages(params);
    };
    Application.getApplicationParams = function () {
        return this._applicationParams;
    };
    Application.applyThemeOnApplication = function (theme, existingTheme, initialLaunch) {
        this._refreshStylePaths(theme);
        if (!initialLaunch) {
            return Application.doLoadMainPage(existingTheme);
        }
        return;
    };
    Application.setODataService = function () {
        IDataService_1.IDataService.setInstance(new ODataService_1.ODataService());
        IRestService_1.IRestService.setInstance(new RestService_1.RestService());
    };
    Application._createSingletons = function () {
        return this._setDefinitionProvider(undefined).then(function () {
            Application.setODataService();
            IActionFactory_1.IActionFactory.setCreateFunction(ActionFactory_1.ActionFactory.Create);
            IActionFactory_1.IActionFactory.setCreateActionRunnerFunction(ActionFactory_1.ActionFactory.CreateActionRunner);
            ISegmentFactory_1.ISegmentFactory.setBuildFunction(SegmentFactory_1.SegmentFactory.build);
            IControlFactory_1.IControlFactory.setCreateFunction(ControlFactorySync_1.ControlFactorySync.Create);
            IContext.setFromPageFunction(Context_1.Context.fromPage);
        });
    };
    Application._executeWithHandlerPaths = function (handlerPath, appEventData) {
        var promises = handlerPath.map(function (rule) {
            return Application._executeWithHandlerPath(rule, appEventData);
        });
        return Promise.all(promises);
    };
    Application._executeWithHandlerPath = function (handlerPath, appEventData) {
        if (handlerPath) {
            Context_1.Context.fromPage().clientAPIProps.appEventData = appEventData;
            var oEventHandler = new EventHandler_1.EventHandler();
            return oEventHandler.executeActionOrRule(handlerPath, Context_1.Context.fromPage()).catch(function (error) {
                Logger_1.Logger.instance.startup.error(Logger_1.Logger.STARTUP_EXECUTE_FAILED, handlerPath, error);
                throw new Error(error);
            });
        }
        else if (appEventData && appEventData.ios) {
            Logger_1.Logger.instance.startup.log(Logger_1.Logger.STARTUP_ERROR_IN_APPEVENTDATA_IOS, Application._appDefinition.getName(), appEventData.ios);
            Logger_1.Logger.instance.startup.log(Logger_1.Logger.STARTUP_STACKTRACE, appEventData.ios.stack);
            return Promise.reject(Application._appDefinition.getName() + ' Error ' + appEventData.ios);
        }
    };
    Application._launchStartupEvents = function (timeout) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                return Application.onLaunch(undefined).then(function () {
                    resolve();
                });
            }, timeout);
        }).then(function () {
            if (PageRenderer_1.PageRenderer.appLevelSideDrawer !== undefined) {
                PageRenderer_1.PageRenderer.appLevelSideDrawer.redraw();
            }
        });
    };
    Application._resetClientHelper = function (service, serviceUrl, force) {
        if (force === void 0) { force = true; }
        return service.clearOfflineStore({ serviceUrl: serviceUrl, force: force }).then(function () {
        }).catch(function (e) {
            Logger_1.Logger.instance.app.error(e);
        });
    };
    Application._rollbackDefinitionProvider = function () {
        return this._setDefinitionProvider(LifecycleManager_1.LifecycleManager.getInstance().getCurrentDefinitionPath());
    };
    Application._setDefinitionProvider = function (definitionPath) {
        var _this = this;
        var currentDefinitionPath;
        var demoBundlePath;
        var bundleDefinitionLoader;
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            demoBundlePath = ClientSettings_1.ClientSettings.getDemoBundlePath();
            if (typeof demoBundlePath !== 'undefined' && demoBundlePath !== null && typeof demoBundlePath === 'string') {
                currentDefinitionPath = fs.path.join(Paths_1.Paths.getOverridePath(), demoBundlePath);
            }
            bundleDefinitionLoader = new DemoBundleDefinitionLoader_1.DemoBundleDefinitionLoader(currentDefinitionPath);
        }
        else {
            currentDefinitionPath = definitionPath ? definitionPath :
                LifecycleManager_1.LifecycleManager.getInstance().getCurrentDefinitionPath();
            bundleDefinitionLoader = new BundleDefinitionLoader_1.BundleDefinitionLoader(currentDefinitionPath);
        }
        return bundleDefinitionLoader.loadBundle().then(function () {
            IDefinitionProvider_1.IDefinitionProvider.setInstance(new DefinitionProvider_1.DefinitionProvider(bundleDefinitionLoader));
            _this._appDefinition = IDefinitionProvider_1.IDefinitionProvider.instance().getApplicationDefinition();
            return _this._resolveApplicationParams();
        });
    };
    Application._setupForApplicationLaunch = function (didLaunchApp, definitionPath) {
        application.on(application.uncaughtErrorEvent, Application.onUnCaughtError);
        application.on(application.exitEvent, Application.onExit);
        if (application.ios) {
            application.on(application.suspendEvent, Application.onSuspend);
            application.on(application.resumeEvent, Application.onResume);
        }
        this._setVersionInfo();
        if (didLaunchApp) {
            return Application._launchStartupEvents(1500).then(function () {
                Application.setMainPageRendered(true);
            });
        }
        else {
            return application.on(application.launchEvent, function () {
                return Application._launchStartupEvents(250);
            });
        }
    };
    Application.doLoadMainPageAndDidUpdate = function (existingTheme) {
        var _this = this;
        PageRenderer_1.PageRenderer.setPageReference(this._appDefinition.getMainPage());
        return this.doLoadMainPage(existingTheme).then(function () {
            return new Promise(function (resolve) {
                setTimeout(resolve, 750);
            }).then(function () {
                return _this.didUpdate();
            });
        });
    };
    Application.applyStyles = function (existingTheme) {
        var stylePath = Application._applicationParams.cssStylePath;
        if (stylePath) {
            var style = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(stylePath);
            if (style) {
                Application._applyCssOnApplication(style.toString(), existingTheme);
                ClientSettings_1.ClientSettings.setUpdateCSSRuleSetFlag(true);
                Logger_1.Logger.instance.appUpdate.log(Logger_1.Logger.SUCCESSFULLY_APPLY_STYLES, stylePath);
            }
        }
        var sdkStylePath = this._getSDKStylePath();
        if (sdkStylePath) {
            var sdkStyle = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(sdkStylePath);
            if (sdkStyle) {
                var content = sdkStyle.toString();
                if (typeof (sdkStyle === 'object') && sdkStyle instanceof Array === false) {
                    content = JSON.stringify(sdkStyle);
                }
                SDKStylingManager_1.SDKStylingManager.saveSDKStyleFile(content).then(function () {
                    Logger_1.Logger.instance.appUpdate.log(Logger_1.Logger.SUCCESSFULLY_APPLY_SDK_STYLES, sdkStylePath);
                    SDKStylingManager_1.SDKStylingManager.applySDKStyle();
                }, function (error) {
                    Logger_1.Logger.instance.appUpdate.error(Logger_1.Logger.ERROR, error, error.stack);
                });
            }
        }
    };
    Application.doLoadMainPage = function (existingTheme) {
        if (ModalFrame_1.ModalFrame.isTopMostModal()) {
            frame_1.Frame.topmost().closeModal();
        }
        else if (TabFrame_1.TabFrame.isTopMostTab()) {
            var topFrame = frame_1.Frame.topmost();
            if (topFrame && topFrame.currentPage && topFrame.currentPage.modal) {
                topFrame.currentPage.modal.closeModal();
            }
        }
        this.applyStyles(existingTheme);
        this.initializeLocalizationAndCustomization();
        ClientSettings_1.ClientSettings.resetExtensionControlSourceMap();
        return this.resetApplicationRootViewIfSideDrawerChanged().then(function () {
            var launchPromise;
            var mainPage = Application._applicationParams.mainPage;
            if (PageRenderer_1.PageRenderer.appLevelSideDrawer !== undefined) {
                launchPromise = PageRenderer_1.PageRenderer.appLevelSideDrawer.renderMainPage();
            }
            else {
                launchPromise = PageRenderer_1.PageRenderer.pushNavigation(mainPage, true, MDKNavigationType_1.MDKNavigationType.Root);
            }
            return launchPromise;
        });
    };
    Application.didUpdate = function () {
        Application.setOnUpdateProcessing(true);
        return Application.onDidUpdate().then(function (result) {
            if (PageRenderer_1.PageRenderer.appLevelSideDrawer !== undefined) {
                PageRenderer_1.PageRenderer.appLevelSideDrawer.redraw();
            }
            Application.setOnUpdateProcessing(false);
            return Promise.resolve(result);
        }).catch(function (error) {
            Application.setOnUpdateProcessing(false);
            return Promise.reject(error);
        });
    };
    Application.resetApplicationRootViewIfSideDrawerChanged = function () {
        var rootView = application.getRootView();
        var mainPageRef = Application._applicationParams.mainPage;
        return IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(mainPageRef).then(function (mainPageDef) {
            if (mainPageDef.getSideDrawer() !== undefined || rootView instanceof nativescript_ui_sidedrawer_1.RadSideDrawer) {
                return PageRenderer_1.PageRenderer.startupNavigation(undefined, false).then(function (rootEntry) {
                    application._resetRootView(rootEntry);
                });
            }
            else {
                return Promise.resolve();
            }
        });
    };
    Application._setVersionInfo = function () {
        if (Application._applicationParams.version) {
            if (application.android && !application.android.context) {
            }
            else {
                mdk_sap_3.VersionInfoBridge.setVersionInfo(Application._applicationParams.version);
            }
        }
    };
    Application._shouldMoveTaskToBackground = function (frame) {
        return frame && !ModalFrame_1.ModalFrame.isModal(frame) &&
            ((frame.backStack && frame.backStack.length === 0) || !frame.backStack);
    };
    Application.removeApplicationListener = function () {
        application.off(application.uncaughtErrorEvent, Application.onUnCaughtError);
        application.off(application.exitEvent, Application.onExit);
        if (application.ios) {
            application.off(application.suspendEvent, Application.onSuspend);
            application.off(application.resumeEvent, Application.onResume);
        }
    };
    Application._resetFlags = function () {
        Application.setOnboardingCompleted(false);
        Application.setOnUpdateProcessing(false);
        Application.setResumeEventDelayed(false);
        Application.setPendingResumeEventData(null);
    };
    Application._clearHistoricalODataOfflineStore = function () {
        var _this = this;
        var promises = [];
        var force = true;
        var _historicalODataServicePath = ClientSettings_1.ClientSettings.getHistoricalODataServicePath();
        var service = IDataService_1.IDataService.instance();
        _historicalODataServicePath.forEach(function (serviceUrl) {
            promises.push(_this._resetClientHelper(service, serviceUrl));
        });
        _historicalODataServicePath = new Set();
        ClientSettings_1.ClientSettings.setHistoricalODataServicePath(_historicalODataServicePath);
        return Promise.all(promises);
    };
    Application._resolveApplicationParams = function () {
        var builder = new ApplicationDataBuilder_1.ApplicationDataBuilder(Context_1.Context.fromPage());
        builder.setMainPage(this._appDefinition.getMainPage())
            .setStylePath(this._appDefinition.getStyles())
            .setSDKStylesPath(this._appDefinition.getSDKStyles())
            .setVersion(this._appDefinition.getVersion())
            .setLocalization(this._appDefinition.getLocalization());
        return builder.build().then(function (result) {
            if (result) {
                Application._applicationParams = result;
            }
        });
    };
    Application._resolveApplicationStyleSheet = function () {
        var stylesObject = this._appDefinition.getStyleSheets();
        var stylePath = this._applicationParams.stylePath;
        var activeTheme = ClientSettings_1.ClientSettings.getTheme();
        ClientSettings_1.ClientSettings.resetApplicationTheme();
        if (stylesObject) {
            var availableThemes = Object.keys(stylesObject);
            if (availableThemes && availableThemes.length > 0) {
                ClientSettings_1.ClientSettings.setAvailableThemes(availableThemes.join(","));
                if (!activeTheme && stylePath) {
                    var aPathElements = stylePath.split("/");
                    var sThemeFileName = aPathElements[aPathElements.length - 1];
                    if (sThemeFileName.endsWith('.less')) {
                        activeTheme = sThemeFileName.slice(0, -5);
                    }
                    if (sThemeFileName.endsWith('.css')) {
                        activeTheme = sThemeFileName.slice(0, -4);
                    }
                }
                if (activeTheme) {
                    var result = Application._setThemeOnly(activeTheme);
                }
            }
        }
    };
    Application._setThemeOnly = function (themeName) {
        var previousAppTheme = ClientSettings_1.ClientSettings.getTheme();
        StyleHelper_1.StyleHelper.setTheme(themeName, true);
        this.applyStyles(previousAppTheme);
    };
    Application._refreshStylePaths = function (theme) {
        this._applicationParams.cssStylePath = this._appDefinition.getCSSStyles(theme);
        this._applicationParams.sdkStyleSheetPath = this._appDefinition.getSDKStyles(theme);
    };
    Application._getSDKStylePath = function () {
        if (this._applicationParams.sdkStyleSheetPath) {
            return this._applicationParams.sdkStyleSheetPath;
        }
        return this._applicationParams.sdkStylePath;
    };
    Application._applyCssOnApplication = function (styleString, existingTheme) {
        if (existingTheme) {
            StyleScope.removeTaggedAdditionalCSS(existingTheme);
        }
        var tagName = ClientSettings_1.ClientSettings.getTheme();
        StyleScope.addTaggedAdditionalCSS(styleString, tagName);
    };
    Application.context = null;
    Application._mainPageRendered = false;
    Application._nonNSActivityDone = false;
    Application._applicationParams = {
        mainPage: '',
        stylePath: '',
        sdkStylePath: '',
        version: '',
        localization: '',
        cssStylePath: '',
        sdkStyleSheetPath: '',
    };
    Application._onBoardingCompleted = false;
    Application._resumeEventDelayed = false;
    Application._onExitIgnoreCount = 0;
    Application._onUpdateProcessing = false;
    Application._onResumeProcessing = false;
    return Application;
}());
exports.Application = Application;
; 
if (false ) {} 

/***/ }),
/* 5 */,
/* 6 */
/***/ (function(module, exports) {

module.exports = require("tns-core-modules/application");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var timer = __webpack_require__(40);
var fs = __webpack_require__(3);
var Application_1 = __webpack_require__(4);
var LifecycleAppVersionInfo_1 = __webpack_require__(20);
var ClientSettings_1 = __webpack_require__(1);
var mdk_sap_1 = __webpack_require__(0);
var ErrorMessage_1 = __webpack_require__(42);
var Logger_1 = __webpack_require__(2);
var RequireUtil_1 = __webpack_require__(10);
var observable_1 = __webpack_require__(43);
var TsWorker = __webpack_require__(44);
var mdk_sap_2 = __webpack_require__(0);
var States;
(function (States) {
    States[States["Running"] = 0] = "Running";
    States[States["Paused"] = 1] = "Paused";
    States[States["Pending"] = 2] = "Pending";
    States[States["Stopped"] = 3] = "Stopped";
})(States || (States = {}));
;
var ActionStatus;
(function (ActionStatus) {
    ActionStatus[ActionStatus["Success"] = 0] = "Success";
    ActionStatus[ActionStatus["Failure"] = 1] = "Failure";
})(ActionStatus || (ActionStatus = {}));
var LifecycleManager = (function () {
    function LifecycleManager() {
        var _this = this;
        this._state = States.Stopped;
        this._appDownloadErrorCount = 0;
        this._isActionRunning = false;
        this.versionChecker = function () {
            if (Application_1.Application.isOnUpdateProcessing()) {
                _this.setState(States.Stopped);
                return;
            }
            if (_this.isStopped()) {
                _this.setState(States.Stopped);
                return Promise.resolve('LCMS Stopped due to Application updating');
            }
            if (_this.isPaused() || _this.isPending()) {
                _this.setState(States.Pending);
                Logger_1.Logger.instance.lcms.log('Version checker request initiated when not active, queuing up request');
                return Promise.resolve('LCMS Paused, queuing version checker request');
            }
            var requestUrl = _this.getVersionCheckUrl();
            var param = { 'header': { 'Accept': 'application/xml,application/atom+xml' } };
            var appId = ClientSettings_1.ClientSettings.getAppId();
            Logger_1.Logger.instance.lcms.info("Requesting LCMS version info: " + requestUrl + " with header X-SMP-APPID: " + appId);
            timer.clearTimeout(_this._timerId);
            return mdk_sap_1.CpmsSession.getInstance().sendRequest(requestUrl, param)
                .then(function (responseAndData) {
                var statusCode = mdk_sap_2.HttpResponse.getStatusCode(responseAndData);
                if (statusCode === 200) {
                    Logger_1.Logger.instance.lcms.info("Response Recieved, httpStatus: " + statusCode);
                    _this.handleVersionInfo(mdk_sap_2.HttpResponse.toString(responseAndData));
                }
                else {
                    var versionResponseText = 'LCMS GET Version Response Error Response Status:';
                    var bodyText = "Body: " + mdk_sap_2.HttpResponse.toString(responseAndData);
                    if (bodyText.indexOf('<code>NotFoundException</code>') > 0 || bodyText.indexOf('Failed to find a matched endpoint') > 0) {
                        _this.setAppUpdateStatus(ActionStatus.Success, LifecycleManager.APPUPDATE_NOT_ENABLED_OR_NO_REVISION);
                    }
                    else {
                        _this.setAppUpdateStatus(ActionStatus.Failure, versionResponseText + " " + statusCode + " | " + bodyText);
                    }
                    Logger_1.Logger.instance.lcms.error(versionResponseText + " " + statusCode + " | " + bodyText);
                    _this.startVersionCheckerTimer();
                }
            }, function (error) {
                _this.setAppUpdateStatus(ActionStatus.Failure, "LCMS GET Version Response failed: " + error);
                Logger_1.Logger.instance.lcms.error("LCMS GET Version Response failed: " + error);
                _this.startVersionCheckerTimer();
            });
        };
        this.appDownloader = function (version) {
            if (_this.isPaused()) {
                _this.setState(States.Pending);
                Logger_1.Logger.instance.lcms.log('appDownloader request initiated when not active, queuing up request');
                return Promise.resolve();
            }
            if (_this.getStagedVersion() >= version.revision) {
                if (_this._isActionRunning) {
                    _this.setAppUpdateStatus(ActionStatus.Success, "" + version.revision);
                }
                var updatePromise = Application_1.Application.update(_this.getBundlePath(version.revision));
                _this.startVersionCheckerTimer();
                return updatePromise;
            }
            else {
                return mdk_sap_1.CpmsSession.getInstance().sendRequest(version.url)
                    .then(function (responseAndData) {
                    var statusCode = mdk_sap_2.HttpResponse.getStatusCode(responseAndData);
                    Logger_1.Logger.instance.lcms.info("App download response code: " + statusCode);
                    _this.updateApplication(mdk_sap_2.HttpResponse.toFile(responseAndData, version.url, LifecycleManager.TEMP_SAVE_PATH), version.revision);
                    _this.startVersionCheckerTimer();
                }, function (e) {
                    Logger_1.Logger.instance.lcms.error("file downloaded error: " + e);
                    _this.setAppUpdateStatus(ActionStatus.Failure, "file downloaded error: " + e);
                    if (_this._appDownloadErrorCount < ClientSettings_1.ClientSettings.getLcmsAppDownloadRetryCount()) {
                        _this._appDownloadErrorCount++;
                        var errorCount = _this._appDownloadErrorCount;
                        var retryAttemptText = "Attempting to retry application download.  Retry " + errorCount;
                        Logger_1.Logger.instance.lcms.error(retryAttemptText + " of " + ClientSettings_1.ClientSettings.getLcmsAppDownloadRetryCount());
                        _this._timerId = timer.setTimeout(function () {
                            _this.appDownloader(version);
                        }, ClientSettings_1.ClientSettings.getLcmsAppDownloadRetryPeriod());
                        var retryPeriod = ClientSettings_1.ClientSettings.getLcmsAppDownloadRetryPeriod();
                        var retryTimerText = "Setting LCMS App Download retry timer: " + retryPeriod;
                        Logger_1.Logger.instance.lcms.info(retryTimerText + " | timer id: " + _this._timerId);
                    }
                    else {
                        Logger_1.Logger.instance.lcms.error('Max application download retries failed.');
                        _this.startVersionCheckerTimer();
                    }
                });
            }
        };
        if (LifecycleManager._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.INITIALIZE_FAIL_SHOULD_USE_GETINSTANCE);
        }
        LifecycleManager._instance = this;
    }
    LifecycleManager.getInstance = function () {
        return LifecycleManager._instance;
    };
    LifecycleManager.prototype.start = function () {
        if (!this.isStopped()) {
            timer.clearTimeout(this._timerId);
        }
        if (Application_1.Application.isOnUpdateProcessing()) {
            return;
        }
        this.setState(States.Running);
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            return;
        }
        else {
            Logger_1.Logger.instance.lcms.info('Starting LCMS Version Checking');
            return this.versionChecker();
        }
    };
    LifecycleManager.prototype.startDelayed = function () {
        if (!this.isStopped()) {
            Logger_1.Logger.instance.lcms.info('LCMS Version Checking already running, ignoring request');
            return Promise.reject('LCMS Version Checking already running, ignoring request');
        }
        this.setState(States.Running);
        Logger_1.Logger.instance.lcms.info('Delay Starting LCMS Version Checking');
        this.startVersionCheckerTimer();
    };
    LifecycleManager.prototype.stop = function () {
        timer.clearTimeout(this._timerId);
        this.setState(States.Stopped);
    };
    LifecycleManager.prototype.pause = function () {
        if (this.isPauseable()) {
            this.setState(States.Paused);
        }
        else {
            Logger_1.Logger.instance.lcms.info("LCMS is not being paused as its current state is :|" + this._state + "|");
        }
    };
    LifecycleManager.prototype.unPause = function () {
        if (this.isPending()) {
            this.restart();
        }
        else if (this.isPaused()) {
            this.setState(States.Running);
        }
    };
    LifecycleManager.prototype.getCurrentDefinitionPath = function () {
        return this.getBundlePath(this.getCurrentVersion());
    };
    LifecycleManager.prototype.getStagedDefinitionPath = function () {
        return this.getBundlePath(this.getStagedVersion());
    };
    LifecycleManager.prototype.promoteStagedVersion = function () {
        var version = this.getStagedVersion();
        if (fs.File.exists(this.getBundlePath(version))) {
            if (version > this.getCurrentVersion()) {
                this.setCurrentVersion(version);
                this.cleanupPreviousVersions(version);
                return true;
            }
        }
        return false;
    };
    LifecycleManager.prototype.reset = function () {
        this.stop();
        ClientSettings_1.ClientSettings.resetApplicationVersions();
        this.cleanupPreviousVersions();
    };
    LifecycleManager.prototype.executeAppUpdateCheck = function () {
        var _this = this;
        this._statusModel = observable_1.fromObject({});
        this._isActionRunning = true;
        var self = this;
        return new Promise(function (resolve, reject) {
            self._statusModel.on(LifecycleManager.ACTION_STATUS_CHANGED, function (args) {
                if (args.object.get('ActionStatus') === ActionStatus.Success) {
                    self._isActionRunning = false;
                    resolve(args.object.get('Message'));
                }
                if (args.object.get('ActionStatus') === ActionStatus.Failure) {
                    self._isActionRunning = false;
                    reject(new Error(args.object.get('Message')));
                }
            });
            _this.restart();
        });
    };
    LifecycleManager.prototype.setAppUpdateStatus = function (status, message) {
        if (this._isActionRunning) {
            this._statusModel.set('Message', message);
            this._statusModel.set('ActionStatus', status);
            var eventData = {
                eventName: LifecycleManager.ACTION_STATUS_CHANGED,
                object: this._statusModel,
            };
            this._statusModel.notify(eventData);
            this._statusModel.off(LifecycleManager.ACTION_STATUS_CHANGED);
        }
    };
    LifecycleManager.prototype.isPauseable = function () {
        return this._state === States.Running;
    };
    LifecycleManager.prototype.isPaused = function () {
        return this._state === States.Paused;
    };
    LifecycleManager.prototype.isPending = function () {
        return this._state === States.Pending;
    };
    LifecycleManager.prototype.isStopped = function () {
        return this._state === States.Stopped;
    };
    LifecycleManager.prototype.setState = function (state) {
        this._state = state;
    };
    LifecycleManager.prototype.restart = function () {
        this.stop();
        this.start();
    };
    LifecycleManager.prototype.cleanupPreviousVersions = function (version) {
        var bundleFolder = fs.Folder.fromPath(this.getBundleFolder());
        var currentBundleFile = version ? this.getBundleFilename(version) : undefined;
        bundleFolder.eachEntity(function (entity) {
            if (!entity.name.startsWith(currentBundleFile) &&
                entity.name.startsWith(LifecycleManager.BUNDLE_FILE_PREFIX) &&
                (entity.name.endsWith(LifecycleManager.BUNDLE_FILE_SUFFIX) ||
                    entity.name.endsWith(LifecycleManager.BUNDLE_SOURCEMAP_SUFFIX))) {
                entity.remove()
                    .then(function (result) {
                    Logger_1.Logger.instance.lcms.info("Successfully removed old definition file " + entity.name);
                }, function (error) {
                    var message = "Error while attempting to remove an old definition file " + entity.name + " - " + error;
                    Logger_1.Logger.instance.lcms.error(message);
                });
            }
            return true;
        });
    };
    LifecycleManager.prototype.startVersionCheckerTimer = function () {
        var timeout = ClientSettings_1.ClientSettings.getLcmsVersionCheckMinPeriod() +
            Math.floor(Math.random() * ClientSettings_1.ClientSettings.getLcmsVersionCheckRandomMax());
        this._timerId = timer.setTimeout(this.versionChecker, timeout);
        Logger_1.Logger.instance.lcms.info("Setting LCMS Version Checker timer: " + timeout + " | timer id: " + this._timerId);
    };
    LifecycleManager.prototype.getVersionCheckUrl = function () {
        return ClientSettings_1.ClientSettings.getCpmsUrl() + LifecycleManager.VERSION_CHECK_PATH +
            ClientSettings_1.ClientSettings.getAppId() + LifecycleManager.VERSION_CHECK_PATH_SUFFIX;
    };
    LifecycleManager.prototype.handleVersionInfo = function (verionInfoXml) {
        Logger_1.Logger.instance.lcms.info("Received Version Data: " + verionInfoXml);
        var latestVersionInfo = new LifecycleAppVersionInfo_1.LifecycleAppVersionInfo(verionInfoXml);
        if (!latestVersionInfo.revision || !latestVersionInfo.url) {
            Logger_1.Logger.instance.lcms.error('Invalid LCMS XML data, skipping upgrade');
            Logger_1.Logger.instance.lcms.info("LCMS XML revision: " + latestVersionInfo.revision + " | url: " + latestVersionInfo.url);
            this.setAppUpdateStatus(ActionStatus.Success, LifecycleManager.APPUPDATE_NOT_ENABLED_OR_NO_REVISION);
            this.startVersionCheckerTimer();
            return;
        }
        if (this.isUpgradeNeeded(latestVersionInfo.revision)) {
            this.upgradeApplication(latestVersionInfo);
        }
        else {
            var log = "Current version is already up to date: " + ClientSettings_1.ClientSettings.getCurrentApplicationVersion();
            this.setAppUpdateStatus(ActionStatus.Success, log);
            Logger_1.Logger.instance.lcms.info(log);
            this.startVersionCheckerTimer();
        }
    };
    LifecycleManager.prototype.isUpgradeNeeded = function (latestLcmsVersion) {
        var latestVersionText = "LCMS latest version is: " + latestLcmsVersion;
        var currentVersionText = "Current Application Version: " + this.getCurrentVersion();
        var stagedVersionText = "Staged Application Version: " + this.getStagedVersion();
        Logger_1.Logger.instance.lcms.info(latestVersionText + " | " + currentVersionText + " | " + stagedVersionText);
        return latestLcmsVersion > this.getCurrentVersion();
    };
    LifecycleManager.prototype.getCurrentVersion = function () {
        return ClientSettings_1.ClientSettings.getCurrentApplicationVersion();
    };
    LifecycleManager.prototype.setCurrentVersion = function (version) {
        return ClientSettings_1.ClientSettings.setCurrentApplicationVersion(version);
    };
    LifecycleManager.prototype.getStagedVersion = function () {
        return ClientSettings_1.ClientSettings.getStagedApplicationVersion();
    };
    LifecycleManager.prototype.upgradeApplication = function (version) {
        Logger_1.Logger.instance.lcms.info("Upgrading application to version " + version.revision + " via " + version.url);
        this._appDownloadErrorCount = 0;
        return this.appDownloader(version);
    };
    LifecycleManager.prototype.getBundleFolder = function () {
        return RequireUtil_1.RequireUtil.getDefinitionBundleFolder();
    };
    LifecycleManager.prototype.getBundlePath = function (version) {
        return fs.path.join(this.getBundleFolder(), this.getBundleFilename(version));
    };
    LifecycleManager.prototype.getBundleFilename = function (version) {
        return LifecycleManager.BUNDLE_FILE_PREFIX +
            '.' + version + '.' + LifecycleManager.BUNDLE_FILE_SUFFIX;
    };
    LifecycleManager.prototype.updateApplication = function (sourceFile, newVersion) {
        var _this = this;
        Logger_1.Logger.instance.lcms.info('Updating Application');
        Logger_1.Logger.instance.lcms.info("sourceFile: " + sourceFile.path);
        var appExtractWorker = new TsWorker();
        appExtractWorker.onmessage = function (msg) {
            if (msg.data.err) {
                Logger_1.Logger.instance.lcms.error("App extraction failed: " + msg.data.err);
                if (_this._isActionRunning) {
                    _this.setAppUpdateStatus(ActionStatus.Failure, "App extraction failed: " + msg.data.err);
                }
            }
            else {
                if (_this._isActionRunning) {
                    _this.setAppUpdateStatus(ActionStatus.Success, "" + newVersion);
                }
                Logger_1.Logger.instance.lcms.info("App extracted successfully with new version: " + newVersion);
                ClientSettings_1.ClientSettings.setStagedApplicationVersion(newVersion);
                Application_1.Application.update(_this.getBundlePath(newVersion));
            }
        };
        appExtractWorker.onerror = function (err) {
            Logger_1.Logger.instance.lcms.error("Uncaught app extraction failure: " + err);
            _this.setAppUpdateStatus(ActionStatus.Failure, "Uncaught app extraction failure: " + err);
            return true;
        };
        appExtractWorker.postMessage({
            bundleDest: this.getBundlePath(newVersion),
            zipDestPath: LifecycleManager.ZIP_EXTRACT_PATH,
            zipSource: LifecycleManager.TEMP_SAVE_PATH,
        });
    };
    LifecycleManager.VERSION_CHECK_PATH = '/odata/lcm/v1/Apps(AppId=\'';
    LifecycleManager.VERSION_CHECK_PATH_SUFFIX = '\',Platform=\'AppModeler\')';
    LifecycleManager.TEMP_SAVE_PATH = fs.path.join(fs.knownFolders.temp().path, 'lcmsDownload.zip');
    LifecycleManager.ZIP_EXTRACT_PATH = fs.path.join(fs.knownFolders.temp().path, 'SeamExtract');
    LifecycleManager.ACTION_STATUS_CHANGED = 'ActionStatusChanged';
    LifecycleManager.APPUPDATE_NOT_ENABLED_OR_NO_REVISION = 'AppUpdate feature is not enabled or no new revision found.';
    LifecycleManager.BUNDLE_FILE_PREFIX = 'bundle';
    LifecycleManager.BUNDLE_FILE_SUFFIX = 'js';
    LifecycleManager.BUNDLE_SOURCEMAP_SUFFIX = 'js.map';
    LifecycleManager._instance = new LifecycleManager();
    return LifecycleManager;
}());
exports.LifecycleManager = LifecycleManager;
; 
if (false ) {} 

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __webpack_require__(3);
var PathToExportName = __webpack_require__(35);
var Logger_1 = __webpack_require__(2);
var BundleDefinitionLoader = (function () {
    function BundleDefinitionLoader(bundlePath) {
        this.bundlePath = bundlePath;
        this.mdkApplication = undefined;
    }
    BundleDefinitionLoader.bundleExist = function (bundlePath) {
        return fs.File.exists(bundlePath);
    };
    BundleDefinitionLoader.validLocationExists = function () {
        return this.bundleExist(BundleDefinitionLoader.BUNDLE_PATH) ||
            this.bundleExist(BundleDefinitionLoader.DEFAULT_BUNDLE_PATH);
    };
    BundleDefinitionLoader.prototype.getLocalizationResourceList = function () {
        if (this.mdkApplication) {
            return Object.keys(this.mdkApplication)
                .filter(function (key) { return key.indexOf('_i18n_') >= 0 && key.indexOf('_properties') > key.indexOf('_i18n_') &&
                key.indexOf('_extensions_') < 0; });
        }
    };
    BundleDefinitionLoader.prototype.loadJsonDefinition = function (sPath) {
        return Promise.resolve(this.loadDefinition(sPath));
    };
    BundleDefinitionLoader.prototype.loadJsDefinition = function (sPath) {
        return Promise.resolve(this.loadDefinition(sPath));
    };
    BundleDefinitionLoader.prototype.loadDefinition = function (sApplicationReference) {
        if (!sApplicationReference) {
            sApplicationReference = './Application.app';
        }
        var sName = PathToExportName.pathToExportName(sApplicationReference, this.mdkApplication.version_mdkbundlerversion);
        return this.mdkApplication[sName];
    };
    BundleDefinitionLoader.prototype.loadBundle = function () {
        var sourceBundlePath;
        var paths = [];
        if (this.bundlePath) {
            paths.push(this.bundlePath);
        }
        paths.push(this.getBundleLocation());
        paths.push(this.getDefaultLocation());
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var path = paths_1[_i];
            if (BundleDefinitionLoader.bundleExist(path)) {
                sourceBundlePath = path;
                break;
            }
        }
        if (!sourceBundlePath) {
            Logger_1.Logger.instance.definitionLoader.error(Logger_1.Logger.DEFINITIONLOADER_APPLICATION_DEFINITIONS_NOT_FOUND);
            this.mdkApplication = [];
            return Promise.resolve();
        }
        Logger_1.Logger.instance.definitionLoader.log(Logger_1.Logger.DEFINITIONLOADER_LOADING_DEFINITIONS, sourceBundlePath);
        this.mdkApplication = global.require(sourceBundlePath);
        return Promise.resolve();
    };
    BundleDefinitionLoader.prototype.getBundleLocation = function () {
        return BundleDefinitionLoader.BUNDLE_PATH;
    };
    BundleDefinitionLoader.prototype.getDefaultLocation = function () {
        return BundleDefinitionLoader.DEFAULT_BUNDLE_PATH;
    };
    BundleDefinitionLoader.BUNDLE_PATH = fs.path.join(fs.knownFolders.currentApp().path, 'bundle.js');
    BundleDefinitionLoader.DEFAULT_BUNDLE_PATH = fs.path.join(fs.knownFolders.currentApp().path, 'default.js');
    return BundleDefinitionLoader;
}());
exports.BundleDefinitionLoader = BundleDefinitionLoader;
; 
if (false ) {} 
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(5)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BundleDefinitionLoader_1 = __webpack_require__(8);
var fs = __webpack_require__(3);
var DemoBundleDefinitionLoader = (function (_super) {
    __extends(DemoBundleDefinitionLoader, _super);
    function DemoBundleDefinitionLoader(bundlePath) {
        return _super.call(this, bundlePath) || this;
    }
    DemoBundleDefinitionLoader.validLocationExists = function () {
        return BundleDefinitionLoader_1.BundleDefinitionLoader.bundleExist(DemoBundleDefinitionLoader.DEMO_BUNDLE_PATH);
    };
    DemoBundleDefinitionLoader.prototype.getBundleLocation = function () {
        return DemoBundleDefinitionLoader.DEMO_BUNDLE_PATH;
    };
    DemoBundleDefinitionLoader.prototype.getDefaultLocation = function () {
        return undefined;
    };
    DemoBundleDefinitionLoader.DEMO_BUNDLE_PATH = fs.path.join(fs.knownFolders.currentApp().path, 'demo.js');
    return DemoBundleDefinitionLoader;
}(BundleDefinitionLoader_1.BundleDefinitionLoader));
exports.DemoBundleDefinitionLoader = DemoBundleDefinitionLoader;
; 
if (false ) {} 

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/utils/RequireUtil");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fs = __webpack_require__(3);
var Paths = (function () {
    function Paths() {
    }
    Paths.getOverridePath = function () {
        return Paths.getDocumentsPath();
    };
    Paths.getSavedSettingsPath = function () {
        return Paths.getDocumentsPath();
    };
    Paths.getDocumentsPath = function () {
        return fs.knownFolders.documents().path;
    };
    return Paths;
}());
exports.Paths = Paths;
; 
if (false ) {} 

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _nativescript_core_bundle_entry_points__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67);
/* harmony import */ var _nativescript_core_bundle_entry_points__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nativescript_core_bundle_entry_points__WEBPACK_IMPORTED_MODULE_0__);

            __webpack_require__(25)();
            
            
        if (false) {}
        
            const context = __webpack_require__(29);
            global.registerWebpackModules(context);
            if (false) {}
            
        
        "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var application = __webpack_require__(6);
var trace_1 = __webpack_require__(68);
var Application_1 = __webpack_require__(69);
var Application_2 = __webpack_require__(4);
var LifecycleManager_1 = __webpack_require__(70);
var LifecycleManager_2 = __webpack_require__(7);
var Paths_1 = __webpack_require__(71);
var Paths_2 = __webpack_require__(11);
var CustomEventHandler_1 = __webpack_require__(23);
var ClientSettings_1 = __webpack_require__(1);
var DemoBundleDefinitionLoader_1 = __webpack_require__(72);
var DemoBundleDefinitionLoader_2 = __webpack_require__(9);
var RequireUtil_1 = __webpack_require__(10);
var ConsoleWriter_1 = __webpack_require__(73);
__webpack_require__(74);
Application_1.Application.setApplication(Application_2.Application);
LifecycleManager_1.LifecycleManager.setInstance(LifecycleManager_2.LifecycleManager.getInstance());
Paths_1.Paths.setClass(Paths_2.Paths);
DemoBundleDefinitionLoader_1.DemoBundleDefinitionLoader.setLoader(DemoBundleDefinitionLoader_2.DemoBundleDefinitionLoader);
RequireUtil_1.RequireUtil.setRequire(global.loadModule);
global['mdkRequire'] = RequireUtil_1.RequireUtil.require;
if (ClientSettings_1.ClientSettings.getTracingEnabled()) {
    var traceCategories_1 = '';
    ClientSettings_1.ClientSettings.getTracingCategories().forEach(function (category) {
        traceCategories_1 = trace_1.categories.concat(traceCategories_1, category);
    });
    trace_1.enable();
    trace_1.setCategories(traceCategories_1);
    trace_1.clearWriters();
    trace_1.addWriter(new ConsoleWriter_1.ConsoleWriter(traceCategories_1));
}
if (application.ios) {
    var customAppDelegate = __webpack_require__(15);
    application.ios.delegate = customAppDelegate.CustomAppDelegate;
}
else if (application.android) {
    var custHander_1 = new CustomEventHandler_1.CustomEventHandler();
    application.on(application.launchEvent, function (args) { return custHander_1.onAppLaunched(args); });
    application.android.on(application.AndroidApplication.activityResumedEvent, function (args) { return custHander_1.onActivityResumed(args); });
    application.android.on(application.AndroidApplication.activityPausedEvent, function (args) { return custHander_1.onActivityPaused(args); });
    application.android.on(application.AndroidApplication.activityResultEvent, function (args) { return custHander_1.onActivityResult(args); });
}
application.loadAppCss();
Application_2.Application.start().then(function (navigation) {
    application.run(navigation);
});
; 
if (false ) {} 
    
        
        
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(5)))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("@nativescript/core/ui/styling/style-scope");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {"type":"stylesheet","stylesheet":{"rules":[{"type":"comment","comment":" These are the client's default styles for built-in controls in iOS "},{"type":"comment","comment":"\nThis style will apply to all Pages in the application.\nThis style is exposed.\n"},{"type":"rule","selectors":[".ns-light PageWrapper"],"declarations":[{"type":"declaration","property":"background-color","value":"white"}]},{"type":"rule","selectors":[".ns-dark PageWrapper"],"declarations":[{"type":"declaration","property":"background-color","value":"black"}]},{"type":"comment","comment":"\nThis style applies to all the Pages in the application. It is not exposed.\n"},{"type":"rule","selectors":["StackLayout"],"declarations":[{"type":"declaration","property":"text-align","value":"center"}]},{"type":"comment","comment":" \nThis style will apply to all ActionBars in the application. In iOS,\nthis is the NavigationBar. This style is exposed.\n"},{"type":"rule","selectors":[".ns-light ActionBar"],"declarations":[{"type":"declaration","property":"color","value":"#CAE4FB"},{"type":"declaration","property":"background-color","value":"#354A5F"},{"type":"declaration","property":"font-family","value":"\"system\""}]},{"type":"rule","selectors":[".ns-dark ActionBar"],"declarations":[{"type":"declaration","property":"color","value":"#0A84FF"},{"type":"declaration","property":"background-color","value":"#161616"},{"type":"declaration","property":"font-family","value":"\"system\""}]},{"type":"comment","comment":"*\nThis style will apply to all ActionBars title field. \nThis style is exposed.\n"},{"type":"rule","selectors":[".ns-light ActionBarTitle"],"declarations":[{"type":"declaration","property":"color","value":"#FAFAFA"},{"type":"declaration","property":"font-size","value":"17"},{"type":"declaration","property":"font-family","value":"\"system\""},{"type":"declaration","property":"font-weight","value":"600"}]},{"type":"rule","selectors":[".ns-dark ActionBarTitle"],"declarations":[{"type":"declaration","property":"color","value":"#FFFFFF"},{"type":"declaration","property":"font-size","value":"17"},{"type":"declaration","property":"font-family","value":"\"system\""},{"type":"declaration","property":"font-weight","value":"600"}]},{"type":"comment","comment":"\nThis style will apply to all clickable toolbar items in the application.\nThis style is exposed.\n"},{"type":"rule","selectors":[".ns-light ToolBar"],"declarations":[{"type":"declaration","property":"color","value":"#0A6ED1"},{"type":"declaration","property":"font-family","value":"\"system\""},{"type":"declaration","property":"font-size","value":"17"},{"type":"declaration","property":"border-top-color","value":"#A7A7AA"},{"type":"declaration","property":"border-width","value":"1"}]},{"type":"comment","comment":"\nTODO: the background color supposed to be #161616 and 80% opacity, but we cannot support alpha yet.\n"},{"type":"rule","selectors":[".ns-dark ToolBar"],"declarations":[{"type":"declaration","property":"color","value":"#0A84FF"},{"type":"declaration","property":"bartintcolor","value":"#161616"},{"type":"declaration","property":"font-family","value":"\"system\""},{"type":"declaration","property":"font-size","value":"17"},{"type":"declaration","property":"border-top-color","value":"#38383A"},{"type":"declaration","property":"border-width","value":"1"}]},{"type":"comment","comment":"\nThis style will apply to all non-clickable toolbar items (labels) by default.\n"},{"type":"rule","selectors":[".ns-light ToolBarLabelStyle"],"declarations":[{"type":"comment","comment":" sapContent_LabelColor "},{"type":"declaration","property":"color","value":"#6A6D70"},{"type":"declaration","property":"font-family","value":"\"system\""},{"type":"declaration","property":"font-size","value":"11"}]},{"type":"rule","selectors":[".ns-dark ToolBarLabelStyle"],"declarations":[{"type":"declaration","property":"color","value":"#EBEBF5"},{"type":"declaration","property":"font-family","value":"\"system\""},{"type":"declaration","property":"font-size","value":"11"}]},{"type":"comment","comment":" \nThis style applies to all the \"Button\" objects in the application \nUnfortunately, that includes our Button control as well as the \nButton used by NativeScript in the alerts, so we use the NonDialogButton\nstyle class bellow to further customize our button controls.\n"},{"type":"rule","selectors":["Button"],"declarations":[{"type":"declaration","property":"height","value":"50"},{"type":"declaration","property":"background-color","value":"#5D88AF"},{"type":"declaration","property":"border-radius","value":"8"},{"type":"declaration","property":"margin","value":"10"},{"type":"declaration","property":"padding","value":"10"},{"type":"declaration","property":"margin-left","value":"30"},{"type":"declaration","property":"margin-right","value":"30"},{"type":"declaration","property":"align-self","value":"'stretch'"},{"type":"declaration","property":"font-family","value":"\"system\""},{"type":"declaration","property":"font-size","value":"18"},{"type":"declaration","property":"text-align","value":"center"},{"type":"declaration","property":"border-width","value":"1"},{"type":"declaration","property":"border-style","value":"solid"},{"type":"declaration","property":"border-color","value":"#5D88AF"}]},{"type":"comment","comment":" \nThis can't be included in the Button style or else the alert\nmessages Buttons will have a light text that is impossible to see.\n"},{"type":"rule","selectors":[".non-dialog-button"],"declarations":[{"type":"declaration","property":"color","value":"#FAFAFA"}]},{"type":"rule","selectors":[".ns-light .sap-icons"],"declarations":[{"type":"declaration","property":"font-family","value":"\"SAP-icons\""},{"type":"declaration","property":"font-weight","value":"900"},{"type":"declaration","property":"font-size","value":"24"}]},{"type":"rule","selectors":[".ns-dark .sap-icons"],"declarations":[{"type":"declaration","property":"color","value":"white"},{"type":"declaration","property":"font-family","value":"\"SAP-icons\""},{"type":"declaration","property":"font-weight","value":"900"},{"type":"declaration","property":"font-size","value":"24"}]},{"type":"comment","comment":" For custom back button for SideDrawer "},{"type":"rule","selectors":[".iosBackButtonIcon"],"declarations":[{"type":"declaration","property":"height","value":"22"}]},{"type":"rule","selectors":[".iosBackButtonTitle"],"declarations":[{"type":"declaration","property":"font-size","value":"17"}]},{"type":"rule","selectors":[".iosBackButtonTitle.ltr"],"declarations":[{"type":"declaration","property":"padding-left","value":"6"}]},{"type":"comment","comment":" --- Gonners --- "},{"type":"comment","comment":" TODO: Remove with Label control "},{"type":"rule","selectors":[".list-view-row"],"declarations":[{"type":"declaration","property":"padding","value":"15"},{"type":"declaration","property":"text-align","value":"left"},{"type":"declaration","property":"font-size","value":"20"}]},{"type":"comment","comment":" TODO: Remove with TextEntry control "},{"type":"rule","selectors":["TextField"],"declarations":[{"type":"declaration","property":"background-color","value":"#FAFAFA"},{"type":"declaration","property":"border-width","value":"1"},{"type":"declaration","property":"border-style","value":"solid"},{"type":"declaration","property":"border-color","value":"#C7C7CC"},{"type":"declaration","property":"border-radius","value":"4"}]},{"type":"rule","selectors":[".ns-light TabStrip"],"declarations":[{"type":"comment","comment":" default background-color of UIToolbar "},{"type":"declaration","property":"background-color","value":"#F7F6F6"},{"type":"declaration","property":"selected-item-color","value":"#0A6ED1"},{"type":"declaration","property":"un-selected-item-color","value":"#6A6D70"}]},{"type":"rule","selectors":[".ns-dark TabStrip"],"declarations":[{"type":"declaration","property":"background-color","value":"#161616"},{"type":"declaration","property":"selected-item-color","value":"#0A84FF"},{"type":"declaration","property":"un-selected-item-color","value":"#FFFFFF"},{"type":"declaration","property":"highlight-color","value":"#0A84FF"}]},{"type":"rule","selectors":[".drawerContent-light"],"declarations":[{"type":"declaration","property":"background-color","value":"#ffffff"}]},{"type":"rule","selectors":[".drawerContent-dark"],"declarations":[{"type":"declaration","property":"background-color","value":"#1C1C1E"}]},{"type":"rule","selectors":[".sidedrawer-header-light"],"declarations":[{"type":"declaration","property":"color","value":"#1C1C1E"},{"type":"declaration","property":"height","value":"auto"},{"type":"declaration","property":"padding","value":"15"},{"type":"declaration","property":"border-bottom-width","value":"0.5"},{"type":"declaration","property":"border-bottom-color","value":"#686767"}]},{"type":"rule","selectors":[".sidedrawer-header-dark"],"declarations":[{"type":"declaration","property":"color","value":"#FFFFFF"},{"type":"declaration","property":"height","value":"auto"},{"type":"declaration","property":"padding","value":"15"},{"type":"declaration","property":"border-bottom-width","value":"0.5"},{"type":"declaration","property":"border-bottom-color","value":"#38383A"}]},{"type":"rule","selectors":[".sidedrawer-header-icon"],"declarations":[{"type":"declaration","property":"width","value":"20%"},{"type":"declaration","property":"margin-bottom","value":"20"}]},{"type":"rule","selectors":[".sidedrawer-header-headline"],"declarations":[{"type":"declaration","property":"font-size","value":"20"},{"type":"declaration","property":"font-weight","value":"bold"}]},{"type":"rule","selectors":[".sidedrawer-header-subheadline-light"],"declarations":[{"type":"declaration","property":"color","value":"#686767"},{"type":"declaration","property":"font-size","value":"16"},{"type":"declaration","property":"font-weight","value":"500"}]},{"type":"rule","selectors":[".sidedrawer-header-subheadline-dark"],"declarations":[{"type":"declaration","property":"color","value":"#FFFFFF"},{"type":"declaration","property":"font-size","value":"16"},{"type":"declaration","property":"font-weight","value":"500"}]},{"type":"rule","selectors":[".sidedrawer-section"],"declarations":[{"type":"declaration","property":"padding-bottom","value":"10"}]},{"type":"rule","selectors":[".sidedrawer-section-separator-light"],"declarations":[{"type":"declaration","property":"border-bottom-width","value":"0.5"},{"type":"declaration","property":"border-bottom-color","value":"#686767"}]},{"type":"rule","selectors":[".sidedrawer-section-separator-dark"],"declarations":[{"type":"declaration","property":"border-bottom-width","value":"0.5"},{"type":"declaration","property":"border-bottom-color","value":"#38383A"}]},{"type":"rule","selectors":[".sidedrawer-section-caption-light"],"declarations":[{"type":"declaration","property":"padding-top","value":"5"},{"type":"declaration","property":"padding-bottom","value":"5"},{"type":"declaration","property":"height","value":"40"},{"type":"declaration","property":"font-size","value":"16"},{"type":"declaration","property":"font-weight","value":"500"},{"type":"declaration","property":"color","value":"#686767"}]},{"type":"rule","selectors":[".sidedrawer-section-caption-dark"],"declarations":[{"type":"declaration","property":"padding-top","value":"5"},{"type":"declaration","property":"padding-bottom","value":"5"},{"type":"declaration","property":"padding-left","value":"15"},{"type":"declaration","property":"height","value":"40"},{"type":"declaration","property":"font-size","value":"16"},{"type":"declaration","property":"font-weight","value":"500"},{"type":"comment","comment":" color: #FAFAFAD9; "},{"type":"declaration","property":"color","value":"#FFFFFF"}]},{"type":"rule","selectors":[".sidedrawer-list-item-light"],"declarations":[{"type":"declaration","property":"color","value":"black"},{"type":"declaration","property":"padding-left","value":"20"},{"type":"declaration","property":"padding-right","value":"20"}]},{"type":"rule","selectors":[".sidedrawer-list-item-dark"],"declarations":[{"type":"declaration","property":"color","value":"#FFFFFF"},{"type":"declaration","property":"padding-left","value":"20"},{"type":"declaration","property":"padding-right","value":"20"}]},{"type":"rule","selectors":[".sidedrawer-list-item-active-light"],"declarations":[{"type":"declaration","property":"color","value":"#FAFAFA"},{"type":"declaration","property":"background-color","value":"#0A6ED1"}]},{"type":"rule","selectors":[".sidedrawer-list-item-active-dark"],"declarations":[{"type":"declaration","property":"color","value":"#FFFFFF"},{"type":"declaration","property":"background-color","value":"#0A84FF"}]},{"type":"rule","selectors":[".sidedrawer-list-item-onpress"],"declarations":[{"type":"declaration","property":"background-color","value":"#EBE7E7"}]},{"type":"rule","selectors":[".sidedrawer-list-item-icon"],"declarations":[{"type":"declaration","property":"height","value":"24"},{"type":"declaration","property":"width","value":"10%"},{"type":"declaration","property":"margin-right","value":"20"}]},{"type":"rule","selectors":[".sidedrawer-list-item-title"],"declarations":[{"type":"declaration","property":"font-size","value":"16"},{"type":"declaration","property":"height","value":"40"},{"type":"declaration","property":"width","value":"100%"},{"type":"declaration","property":"font-family","value":"\"system\""}]},{"type":"rule","selectors":[".ltr"],"declarations":[{"type":"declaration","property":"text-align","value":"left"}]},{"type":"rule","selectors":[".rtl"],"declarations":[{"type":"declaration","property":"text-align","value":"right"}]}],"parsingErrors":[]}};; 
if (false ) {} 

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Application_1 = __webpack_require__(4);
var WelcomePage_1 = __webpack_require__(22);
var ClientSettings_1 = __webpack_require__(1);
var mdk_sap_1 = __webpack_require__(0);
var Logger_1 = __webpack_require__(2);
var application = __webpack_require__(6);
var LifecycleManager_1 = __webpack_require__(7);
var ClientSettings_2 = __webpack_require__(1);
var CustomAppDelegate = (function (_super) {
    __extends(CustomAppDelegate, _super);
    function CustomAppDelegate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.showPasscodeTimeout = 0;
        _this.displayPasscodeInputScreen = false;
        _this.systemPopupFlag = true;
        _this.hasClientLaunched = false;
        return _this;
    }
    CustomAppDelegate.prototype.applicationOpenURLOptions = function (app, url, options) {
        ClientSettings_1.ClientSettings.saveLinkDataObject(url);
        if (ClientSettings_1.ClientSettings.isConnectionSettingsEnableOverrides()) {
            return this.applicationHandleOpenURL(app, url);
        }
        return false;
    };
    CustomAppDelegate.prototype.applicationHandleOpenURL = function (application, url) {
        Logger_1.Logger.instance.appDelegate.info(Logger_1.Logger.STARTUP_APP_LAUNCHED_VIA_URL, url.absoluteString);
        if (ClientSettings_1.ClientSettings.isOnboardingInProgress()) {
            ClientSettings_1.ClientSettings.processConnectionSettingsFromLaunchURL(url.query);
            if (ClientSettings_1.ClientSettings.validateOnboardingConnectionParamsExist()) {
                Logger_1.Logger.instance.appDelegate.info(Logger_1.Logger.STARTUP_APP_URL_PARAM_CHECK_SUCCESS);
                setTimeout(function () {
                    WelcomePage_1.WelcomePage.reInitializePage();
                }, 1000);
            }
        }
        else {
            ClientSettings_1.ClientSettings.setConnecionInfoToastMessage(url.query, url.absoluteString);
        }
        return true;
    };
    CustomAppDelegate.prototype.applicationDidEnterBackground = function (application) {
        var _this = this;
        if (ClientSettings_1.ClientSettings.isOnboardingInProgress()) {
            return;
        }
        if (ClientSettings_1.ClientSettings.isLiveMode()) {
            LifecycleManager_1.LifecycleManager.getInstance().pause();
        }
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            Application_1.Application.setOnboardingCompleted(true);
            Application_1.Application.setResumeEventDelayed(false);
        }
        if (ClientSettings_1.ClientSettings.getPasscodeSource() === ClientSettings_2.PasscodeSource.UserOnboardedWithoutPasscode) {
            this.systemPopupFlag = false;
            Application_1.Application.setResumeEventDelayed(false);
            return;
        }
        if (!ClientSettings_1.ClientSettings.isUserChangingPasscode) {
            this.displayPasscodeInputScreen = false;
            this.systemPopupFlag = false;
            if (ClientSettings_1.ClientSettings.isLiveMode()) {
                var timeout = ClientSettings_1.ClientSettings.getPasscodeTimeout();
                if (timeout > 0) {
                    this.showPasscodeTimeout = setTimeout(function () {
                        _this.displayPasscodeInputScreen = true;
                        Application_1.Application.setOnboardingCompleted(false);
                        Application_1.Application.setResumeEventDelayed(false);
                    }, 1000 * timeout);
                }
                else if (timeout === 0) {
                    this.displayPasscodeInputScreen = true;
                    this.showPasscodeTimeout = setTimeout(function () {
                        Application_1.Application.setOnboardingCompleted(false);
                        Application_1.Application.setResumeEventDelayed(false);
                    }, 500);
                }
            }
        }
    };
    CustomAppDelegate.prototype.applicationDidBecomeActive = function (application) {
        Logger_1.Logger.instance.appDelegate.info(Logger_1.Logger.STARTUP_INSIDE_APPLICATIONDIDBECOMEACTIVE_DELEGATE_METHOD);
        if (this.systemPopupFlag) {
            WelcomePage_1.WelcomePage.manageBlurScreen(ClientSettings_1.BlurScreenActions.Remove);
            Application_1.Application.setNonNSActivityDone(true);
            return;
        }
        if (typeof this.systemPopupFlag === 'undefined' || this.systemPopupFlag === null) {
            this.systemPopupFlag = true;
        }
        if (ClientSettings_1.ClientSettings.isLiveMode()) {
            if (typeof this.displayPasscodeInputScreen === 'undefined' || this.displayPasscodeInputScreen === null) {
                this.displayPasscodeInputScreen = true;
                CustomAppDelegate.isPasscodeScreenDisplaying = false;
            }
        }
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            Application_1.Application.setResumeEventDelayed(false);
        }
        if (this.displayPasscodeInputScreen && !CustomAppDelegate.isPasscodeScreenDisplaying && !this.hasClientLaunched) {
            this.hasClientLaunched = true;
            CustomAppDelegate.isPasscodeScreenDisplaying = true;
            Application_1.Application.setResumeEventDelayed(true);
            return WelcomePage_1.WelcomePage.restoreOnRelaunch(ClientSettings_1.ClientSettings.getOnboardingParams()).then(function () {
                WelcomePage_1.WelcomePage.manageBlurScreen(ClientSettings_1.BlurScreenActions.Remove);
                ClientSettings_1.ClientSettings.setApplicationStage('InApplication');
                Application_1.Application.launchAppMainPage(true);
                var eventData = {
                    eventName: 'relaunched',
                    ios: {},
                    object: application,
                };
                Application_1.Application.setResumeEventDelayed(false);
                Application_1.Application.onResume(eventData);
                LifecycleManager_1.LifecycleManager.getInstance().unPause();
            }).catch(function (err) {
                Logger_1.Logger.instance.appDelegate.error(err);
                return Promise.resolve();
            }).then(function () {
                CustomAppDelegate.isPasscodeScreenDisplaying = false;
            });
        }
        else if (!CustomAppDelegate.isPasscodeScreenDisplaying) {
            WelcomePage_1.WelcomePage.manageBlurScreen(ClientSettings_1.BlurScreenActions.Remove);
        }
        if (ClientSettings_1.ClientSettings.isLiveMode()) {
            this.hasClientLaunched = true;
        }
    };
    CustomAppDelegate.prototype.applicationWillResignActive = function (application) {
        Logger_1.Logger.instance.appDelegate.info(Logger_1.Logger.STARTUP_INSIDE_APPLICATIONWILLRESIGNACTIVE_DELEGATE_METHOD);
        if (ClientSettings_1.ClientSettings.isDemoMode() ||
            (!ClientSettings_1.ClientSettings.isUserChangingPasscode && !CustomAppDelegate.isPasscodeScreenDisplaying &&
                ClientSettings_1.ClientSettings.isLiveMode())) {
            WelcomePage_1.WelcomePage.manageBlurScreen(ClientSettings_1.BlurScreenActions.Add);
        }
        Application_1.Application.setOnResumeProcessing(false);
    };
    CustomAppDelegate.prototype.applicationWillEnterForeground = function (application) {
        var _this = this;
        if (this.displayPasscodeInputScreen && !CustomAppDelegate.isPasscodeScreenDisplaying) {
            CustomAppDelegate.isPasscodeScreenDisplaying = true;
            Application_1.Application.prepareForPopoverRestore();
            return WelcomePage_1.WelcomePage.applicationWillEnterForeground().then(function () {
                ClientSettings_1.ClientSettings.setApplicationStage('InApplication');
                WelcomePage_1.WelcomePage.manageBlurScreen(ClientSettings_1.BlurScreenActions.Remove);
                Application_1.Application.setOnboardingCompleted(true);
                _this.hasClientLaunched = true;
                if (ClientSettings_1.ClientSettings.getPasscodeSource() !== ClientSettings_2.PasscodeSource.UserOnboardedWithoutPasscode) {
                    Application_1.Application.completeForPopoverRestore();
                    Application_1.Application.onResume(Application_1.Application.getPendingResumeEventData());
                    Application_1.Application.setPendingResumeEventData(null);
                }
                LifecycleManager_1.LifecycleManager.getInstance().unPause();
            }).catch(function (err) {
                Logger_1.Logger.instance.appDelegate.error(err);
                return Promise.resolve();
            }).then(function () {
                CustomAppDelegate.isPasscodeScreenDisplaying = false;
            });
        }
        else if (ClientSettings_1.ClientSettings.isLiveMode() && !this.displayPasscodeInputScreen
            && !ClientSettings_1.ClientSettings.isUserChangingPasscode) {
            LifecycleManager_1.LifecycleManager.getInstance().unPause();
            WelcomePage_1.WelcomePage.manageBlurScreen(ClientSettings_1.BlurScreenActions.Remove);
        }
        else {
            WelcomePage_1.WelcomePage.manageBlurScreen(ClientSettings_1.BlurScreenActions.Remove);
        }
        if (this.showPasscodeTimeout) {
            clearTimeout(this.showPasscodeTimeout);
            this.showPasscodeTimeout = 0;
        }
        if (!ClientSettings_1.ClientSettings.isOnboardingInProgress()) {
            this.hasClientLaunched = true;
        }
    };
    CustomAppDelegate.prototype.applicationDidFinishLaunchingWithOptions = function (application, launchOptions) {
        Logger_1.Logger.instance.appDelegate.info('Inside applicationDidFinishLaunchingWithOptions app delegate method');
        var center = UNUserNotificationCenter.currentNotificationCenter();
        center.delegate = this;
        this._registerDefaultsFromSettingsBundle();
        return true;
    };
    CustomAppDelegate.prototype.applicationDidRegisterForRemoteNotificationsWithDeviceToken = function (application, deviceToken) {
        Logger_1.Logger.instance.appDelegate.info('Inside applicationDidRegisterForRemoteNotificationsWithDeviceToken app delegate method');
        mdk_sap_1.PushNotification.getInstance().didRegisterForRemoteNotifications(deviceToken);
    };
    CustomAppDelegate.prototype.applicationDidFailToRegisterForRemoteNotificationsWithError = function (application, error) {
        Logger_1.Logger.instance.appDelegate.info('Inside applicationDidFailToRegisterForRemoteNotificationsWithError app delegate method');
        mdk_sap_1.PushNotification.getInstance().didFailToRegisterNotifications(error);
    };
    CustomAppDelegate.prototype.userNotificationCenterWillPresentNotificationWithCompletionHandler = function (center, notification, completionHandler) {
        var payload = notification.request.content.userInfo;
        var eventData = {
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
                completionHandler: completionHandler,
                payload: this._dictionaryToObject(payload),
                title: notification.request.content.title,
            },
        };
        this._unifyEventData(eventData);
        application.notify(eventData);
    };
    CustomAppDelegate.prototype.applicationDidReceiveRemoteNotificationFetchCompletionHandler = function (uiApplication, payload, completionHandler) {
        var oPayload = this._dictionaryToObject(payload);
        var eventData = {
            eventName: 'contentAvailableEvent',
            object: {
                FetchResult: {
                    Failed: 2,
                    NewData: 0,
                    NoData: 1,
                },
                badge: oPayload.aps.badge,
                body: oPayload.aps.alert.body,
                completionHandler: completionHandler,
                payload: oPayload,
                title: oPayload.aps.alert.title,
            },
        };
        this._unifyEventData(eventData);
        application.notify(eventData);
    };
    CustomAppDelegate.prototype.userNotificationCenterDidReceiveNotificationResponseWithCompletionHandler = function (center, response, completionHandler) {
        var actionIdentifier = response.actionIdentifier;
        var payload = response.notification.request.content.userInfo;
        var oPayload = this._dictionaryToObject(payload);
        var eventData = {
            eventName: 'receiveNotificationResponseEvent',
            object: {
                actionIdentifier: actionIdentifier,
                badge: oPayload.aps.badge,
                body: oPayload.aps.alert.body,
                completionHandler: completionHandler,
                payload: oPayload,
                title: oPayload.aps.alert.title,
            },
        };
        this._unifyEventData(eventData);
        application.notify(eventData);
    };
    CustomAppDelegate.prototype._unifyEventData = function (eventData) {
        var payload = eventData.object.payload;
        if (payload.data && typeof payload.data === 'string') {
            try {
                eventData.object.data = JSON.parse(payload.data);
            }
            catch (e) {
                var sData = payload.data.replace(/'/g, '"');
                try {
                    eventData.object.data = JSON.parse(sData);
                }
                catch (e) {
                    eventData.object.data = payload.data;
                }
            }
        }
        if (payload.aps.alert['title-loc-key'] ||
            payload.aps.alert['loc-key']) {
            payload.notification = payload.notification || {};
            payload.notification.titleLocKey = payload.aps.alert['title-loc-key'];
            payload.notification.titleLocArgs = payload.aps.alert['title-loc-args'];
            payload.notification.bodyLocKey = payload.aps.alert['loc-key'];
            payload.notification.bodyLocArgs = payload.aps.alert['loc-args'];
        }
    };
    CustomAppDelegate.prototype._dictionaryToObject = function (dict) {
        var jsonData = NSJSONSerialization.dataWithJSONObjectOptionsError(dict, 1);
        var jsonString = NSString.alloc().initWithBytesLengthEncoding(jsonData.bytes, jsonData.length, NSUTF8StringEncoding);
        return JSON.parse(jsonString.toString());
    };
    CustomAppDelegate.prototype._registerDefaultsFromSettingsBundle = function () {
        var settingsPath = NSBundle.mainBundle.pathForResourceOfType('Settings', 'bundle');
        var settingsBundle = NSString.stringWithString(settingsPath);
        var rootPath = settingsBundle.stringByAppendingPathComponent('Root.plist');
        var settings = NSDictionary.dictionaryWithContentsOfFile(rootPath);
        var preferences = settings.objectForKey('PreferenceSpecifiers');
        var prefs = preferences.count;
        var defaultsToRegister = NSMutableDictionary.alloc().initWithCapacity(prefs);
        var prefSpecification = null;
        var key = null;
        var value = null;
        for (var i = 0; i < prefs; i++) {
            prefSpecification = preferences.objectAtIndex(i);
            key = prefSpecification.objectForKey('Key');
            value = prefSpecification.objectForKey('DefaultValue');
            if (key && value) {
                defaultsToRegister.setObjectForKey(value, key);
            }
        }
        NSUserDefaults.standardUserDefaults.registerDefaults(defaultsToRegister);
        NSUserDefaults.standardUserDefaults.synchronize();
    };
    CustomAppDelegate.ObjCProtocols = [UIApplicationDelegate, UNUserNotificationCenterDelegate];
    CustomAppDelegate.isPasscodeScreenDisplaying = null;
    return CustomAppDelegate;
}(UIResponder));
exports.CustomAppDelegate = CustomAppDelegate;
; 
if (false ) {} 

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("tns-core-modules/ui/frame");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/pages/PageRenderer");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/pages/MDKPage");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/EventHandler");

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var xml = __webpack_require__(41);
var Logger_1 = __webpack_require__(2);
var LifecycleAppVersionInfo = (function () {
    function LifecycleAppVersionInfo(lcmsVersionXml) {
        this.parse(lcmsVersionXml);
    }
    Object.defineProperty(LifecycleAppVersionInfo.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LifecycleAppVersionInfo.prototype, "revision", {
        get: function () {
            return this._revision;
        },
        enumerable: true,
        configurable: true
    });
    LifecycleAppVersionInfo.prototype.parse = function (lcmsVersionXml) {
        var _this = this;
        this._url = undefined;
        this._revision = undefined;
        var currentElementName;
        var currentText;
        var xmlParser = new xml.XmlParser(function (event) {
            switch (event.eventType) {
                case xml.ParserEventType.StartElement:
                    currentElementName = event.elementName;
                    break;
                case xml.ParserEventType.EndElement:
                    if (currentElementName === 'd:Revision') {
                        _this._revision = Number(currentText);
                    }
                    else if (currentElementName === 'd:Path') {
                        _this._url = currentText;
                    }
                    currentElementName = undefined;
                    currentText = undefined;
                    break;
                case xml.ParserEventType.Text:
                    currentText = event.data.trim();
                    break;
                default:
                    Logger_1.Logger.instance.lcms.error("Invalid event type onXmlEventCallback " + event.eventType);
            }
        }, function (error) {
            Logger_1.Logger.instance.lcms.error("Error parsing XML: " + error);
            _this._url = undefined;
            _this._revision = undefined;
        });
        xmlParser.parse(lcmsVersionXml);
        Logger_1.Logger.instance.lcms.info('LCMS version data parsed');
        Logger_1.Logger.instance.lcms.info("\tlatest revision: " + this._revision + " | url: " + this._url);
    };
    return LifecycleAppVersionInfo;
}());
exports.LifecycleAppVersionInfo = LifecycleAppVersionInfo;
; 
if (false ) {} 

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/utils/I18nLanguage");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/pages/WelcomePage");

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Application_1 = __webpack_require__(4);
var WelcomePage_1 = __webpack_require__(22);
var ClientSettings_1 = __webpack_require__(1);
var ClientSettings_2 = __webpack_require__(1);
var frameModule = __webpack_require__(16);
var Logger_1 = __webpack_require__(2);
var application = __webpack_require__(6);
var MDKPage_1 = __webpack_require__(18);
var EventHandler_1 = __webpack_require__(19);
var PageRenderer_1 = __webpack_require__(17);
var CustomEventHandler_1 = __webpack_require__(63);
var I18nLanguage_1 = __webpack_require__(21);
var CustomEventHandler = (function () {
    function CustomEventHandler() {
        this._showPasscodeTimeout = 0;
        this._resumedAct = null;
        this._pausedAct = null;
        this._lifecycleCallback = null;
    }
    CustomEventHandler._appSuspensionHelper = function () {
        if (ClientSettings_1.ClientSettings.isLiveMode() && Application_1.Application.isMainPageRendered() &&
            !CustomEventHandler_1.CustomEventHandler.isPasscodeScreenDisplaying &&
            CustomEventHandler_1.CustomEventHandler.displayPasscodeInputScreen) {
            WelcomePage_1.WelcomePage.applicationWillEnterBackground();
        }
        else {
            CustomEventHandler_1.CustomEventHandler.displayPasscodeInputScreen = false;
        }
    };
    CustomEventHandler.prototype.onAppResumed = function (args) {
        if (ClientSettings_1.ClientSettings.getPasscodeSource() === ClientSettings_2.PasscodeSource.UserOnboardedWithoutPasscode) {
            Application_1.Application.onResume(args);
            return;
        }
        if (ClientSettings_1.ClientSettings.isLiveMode() && Application_1.Application.isMainPageRendered() &&
            !CustomEventHandler_1.CustomEventHandler.isPasscodeScreenDisplaying && CustomEventHandler_1.CustomEventHandler.displayPasscodeInputScreen) {
            CustomEventHandler_1.CustomEventHandler.isPasscodeScreenDisplaying = true;
            WelcomePage_1.WelcomePage.applicationWillEnterForeground();
        }
        if (this._showPasscodeTimeout) {
            clearTimeout(this._showPasscodeTimeout);
            this._showPasscodeTimeout = 0;
            Application_1.Application.onResume(args);
        }
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            Application_1.Application.onResume(args);
        }
    };
    CustomEventHandler.prototype.onAppSuspended = function (args) {
        var _this = this;
        if (CustomEventHandler_1.CustomEventHandler.isPasscodeScreenDisplaying || ClientSettings_1.ClientSettings.isUserChangingPasscode) {
            CustomEventHandler_1.CustomEventHandler.isPasscodeScreenDisplaying = false;
            CustomEventHandler_1.CustomEventHandler.displayPasscodeInputScreen = true;
            return;
        }
        if (ClientSettings_1.ClientSettings.getPasscodeSource() === ClientSettings_2.PasscodeSource.UserOnboardedWithoutPasscode) {
            Application_1.Application.onSuspend(args);
            return;
        }
        setTimeout(function () {
            if (_this._resumedAct && _this._pausedAct &&
                _this._resumedAct.getClass().getSimpleName() === _this._pausedAct.getClass().getSimpleName()) {
                return;
            }
            if (_this._resumedAct && _this._pausedAct &&
                _this._resumedAct.getClass().getSimpleName().includes('ListPickerFormCellActivity') &&
                _this._pausedAct.getClass().getSimpleName() === 'MDKAndroidActivity') {
                return;
            }
            if (ClientSettings_1.ClientSettings.isLiveMode() && !CustomEventHandler_1.CustomEventHandler.displayPasscodeInputScreen) {
                var timeout = ClientSettings_1.ClientSettings.getPasscodeTimeout();
                if (timeout > 0) {
                    if (_this._showPasscodeTimeout) {
                        clearTimeout(_this._showPasscodeTimeout);
                    }
                    _this._showPasscodeTimeout = setTimeout(function () {
                        Application_1.Application.setOnboardingCompleted(false);
                        CustomEventHandler_1.CustomEventHandler.displayPasscodeInputScreen = true;
                        CustomEventHandler._appSuspensionHelper();
                    }, 1000 * timeout);
                    Application_1.Application.onSuspend(args);
                }
                else if (timeout === 0) {
                    Application_1.Application.onSuspend(args);
                    Application_1.Application.setOnboardingCompleted(false);
                    CustomEventHandler_1.CustomEventHandler.displayPasscodeInputScreen = true;
                    CustomEventHandler._appSuspensionHelper();
                }
            }
            if (ClientSettings_1.ClientSettings.isDemoMode()) {
                Application_1.Application.onSuspend(args);
            }
        }, 500);
    };
    CustomEventHandler.prototype.onAppLaunched = function (args) {
        var _this = this;
        var _a, _b;
        ClientSettings_1.ClientSettings.saveLinkDataObject((_b = (_a = args.android) === null || _a === void 0 ? void 0 : _a.getDataString()) === null || _b === void 0 ? void 0 : _b.toString());
        if (Application_1.Application.isMainPageRendered()) {
            this.onAppResumed(args);
            return;
        }
        if (this._lifecycleCallback == null) {
            this._lifecycleCallback = new com.sap.mdk.client.ui.lifecycle.IMDKEventHandler({
                onAppResumed: function () {
                    var resumeEventData = {
                        android: {},
                        eventName: 'resumed',
                        object: application,
                    };
                    return _this.onAppResumed(resumeEventData);
                },
                onAppSuspended: function () {
                    var suspendEventData = {
                        android: {},
                        eventName: 'suspended',
                        object: application,
                    };
                    _this.onAppSuspended(suspendEventData);
                },
            });
            com.sap.mdk.client.ui.lifecycle.MDKLifecycleObserver.addObserver(this._lifecycleCallback);
        }
        if (ClientSettings_1.ClientSettings.isLiveMode() && !CustomEventHandler_1.CustomEventHandler.isReLaunchInProgress) {
            CustomEventHandler_1.CustomEventHandler.isReLaunchInProgress = true;
            if (ClientSettings_1.ClientSettings.getPasscodeSource() !== ClientSettings_2.PasscodeSource.UserOnboardedWithoutPasscode) {
                CustomEventHandler_1.CustomEventHandler.isPasscodeScreenDisplaying = true;
            }
            if (args.android.getData() !== null) {
                ClientSettings_1.ClientSettings.setConnecionInfoToastMessage(args.android.getData());
            }
            var oPage = new WelcomePage_1.WelcomePage();
            var onboardingParams = ClientSettings_1.ClientSettings.getOnboardingParams();
            var passcodeSrc = ClientSettings_1.ClientSettings.getPasscodeSource().toString();
            var passcodeSrcParam = {
                PasscodeSource: passcodeSrc,
            };
            onboardingParams = Object.assign(onboardingParams, passcodeSrcParam);
            WelcomePage_1.WelcomePage.restoreOnRelaunch(onboardingParams);
            this.activateAppLifeCycleCallbacks();
        }
        else if (!ClientSettings_1.ClientSettings.isLiveMode()) {
            if (args.android && args.android.getData && (args.android.getData() !== null)) {
                var launchUrl = args.android.getDataString();
                var startIdx = launchUrl.indexOf('?');
                if (startIdx > 0) {
                    Logger_1.Logger.instance.appDelegate.info(Logger_1.Logger.STARTUP_APP_LAUNCHED_VIA_URL, launchUrl);
                    if (ClientSettings_1.ClientSettings.isConnectionSettingsEnableOverrides()) {
                        ClientSettings_1.ClientSettings.processConnectionSettingsFromLaunchURL(launchUrl.substring(startIdx + 1));
                    }
                }
            }
        }
    };
    CustomEventHandler.prototype.onActivityResumed = function (args) {
        this._resumedAct = args.activity;
        if (ClientSettings_1.ClientSettings.getScreenSharingWithAndroidVersion()) {
            this._resumedAct.getWindow().clearFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE);
        }
        else {
            this._resumedAct.getWindow().setFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE, android.view.WindowManager.LayoutParams.FLAG_SECURE);
        }
        var activityType = this._resumedAct.getClass().getSimpleName();
        if (activityType === 'FingerprintActivity'
            || activityType === 'MDKAndroidActivity') {
            if (CustomEventHandler_1.CustomEventHandler.passcodeChangeActionComplete !== null) {
                WelcomePage_1.WelcomePage.fireChangeUserPasscodeSuccessOrFailureAction(CustomEventHandler_1.CustomEventHandler.passcodeChangeActionComplete);
                CustomEventHandler_1.CustomEventHandler.passcodeChangeActionComplete = null;
            }
            else if (CustomEventHandler_1.CustomEventHandler.passcodeVerifyActionComplete !== null) {
                WelcomePage_1.WelcomePage.fireVerifyPasscodeSuccessOrFailureAction(CustomEventHandler_1.CustomEventHandler.passcodeVerifyActionComplete);
                CustomEventHandler_1.CustomEventHandler.passcodeVerifyActionComplete = null;
            }
        }
        else if (activityType === 'MDKLaunchScreenActivity') {
            this.activateAppLifeCycleCallbacks();
        }
        var topFrame = frameModule.Frame.topmost();
        if (topFrame && topFrame.currentPage) {
            var mdkPage = topFrame.currentPage;
            if (mdkPage && mdkPage.isResuming) {
                mdkPage.isResuming = false;
                var onResumeEvent = mdkPage.definition.getOnResumeEvent();
                var handler = new EventHandler_1.EventHandler();
                handler.executeActionOrRule(onResumeEvent, mdkPage.context).then(function () {
                    PageRenderer_1.PageRenderer.currentlyRenderedPage = undefined;
                }).catch(function () {
                    PageRenderer_1.PageRenderer.currentlyRenderedPage = undefined;
                });
            }
        }
        var appLang = ClientSettings_1.ClientSettings.getAppLanguage();
        Application_1.Application.initializeLocalizationAndCustomization();
        if (appLang && activityType === 'WebViewActivity') {
            I18nLanguage_1.I18nLanguage.applyLanguage(appLang);
        }
        var isRTL;
        if (appLang !== undefined) {
            isRTL = ClientSettings_1.ClientSettings.getAppLanguageIsRTL();
            var foregroundAct = args.activity;
            var foregroundWindow = foregroundAct.getWindow();
            if (foregroundWindow) {
                var foregroundDecorView = foregroundWindow.getDecorView();
                if (foregroundDecorView) {
                    if (isRTL) {
                        foregroundDecorView.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_RTL);
                    }
                    else {
                        foregroundDecorView.setLayoutDirection(android.view.View.LAYOUT_DIRECTION_LTR);
                    }
                }
            }
        }
    };
    CustomEventHandler.prototype.onActivityPaused = function (args) {
        var _this = this;
        this._pausedAct = args.activity;
        if (!ClientSettings_1.ClientSettings.getScreenSharing()) {
            this._pausedAct.getWindow().setFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE, android.view.WindowManager.LayoutParams.FLAG_SECURE);
        }
        this._resumedAct = null;
        var act = args.activity.getClass().getSimpleName();
        if (act.includes('FlowActivity') && CustomEventHandler_1.CustomEventHandler.isReLaunchInProgress) {
            CustomEventHandler_1.CustomEventHandler.isReLaunchInProgress = false;
        }
        if (act.includes('Passcode') || act === 'FingerprintActivity' || act.includes('ListPickerFormCellActivity')) {
            if (act.includes('ListPickerFormCellActivity')) {
                MDKPage_1.MDKPage.setDisplayingExternalPage(true);
            }
            setTimeout(function () {
                if (_this._resumedAct === null) {
                    if (ClientSettings_1.ClientSettings.isUserChangingPasscode) {
                        CustomEventHandler_1.CustomEventHandler.displayPasscodeInputScreen = false;
                        ClientSettings_1.ClientSettings.isUserChangingPasscode = false;
                    }
                    else if (CustomEventHandler_1.CustomEventHandler.isReLaunchInProgress) {
                        if (act !== 'EnterPasscodeActivity') {
                            args.activity.finishAffinity();
                        }
                        frameModule.Frame.topmost().android.activity.finish();
                        CustomEventHandler_1.CustomEventHandler.isReLaunchInProgress = false;
                    }
                }
            }, 1000);
        }
        else {
            MDKPage_1.MDKPage.setDisplayingExternalPage(false);
        }
    };
    CustomEventHandler.prototype.onActivityResult = function (args) {
        switch (args.requestCode) {
            case ClientSettings_1.ActivityResultRequestCode.AttachmentFormCell:
            case ClientSettings_1.ActivityResultRequestCode.OpenDocument:
                Application_1.Application.setNonNSActivityDone(true);
                break;
            default:
                break;
        }
    };
    CustomEventHandler.prototype.activateAppLifeCycleCallbacks = function () {
        var _this = this;
        application.off(application.launchEvent);
        application.on(application.launchEvent, function (args) { return _this.onAppLaunched(args); });
    };
    return CustomEventHandler;
}());
exports.CustomEventHandler = CustomEventHandler;
; 
if (false ) {} 

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var zip_plugin_1 = __webpack_require__(64);
var fs = __webpack_require__(3);
var Logger_1 = __webpack_require__(2);
var RequireUtil_1 = __webpack_require__(10);
var AppExtractHelper = (function () {
    function AppExtractHelper() {
    }
    AppExtractHelper.getInstance = function () {
        return AppExtractHelper._instance;
    };
    AppExtractHelper.prototype.extract = function (msg) {
        var error;
        this.zipSource = msg.data.zipSource;
        this.zipDest = msg.data.zipDestPath;
        var bundleDest = msg.data.bundleDest;
        Logger_1.Logger.instance.core.info('Unzip started: from ' + this.zipSource + ' to ' + this.zipDest);
        zip_plugin_1.Zip.unzip(this.zipSource, this.zipDest);
        var bundleSourcePath = fs.path.join(this.zipDest, 'bundle.js');
        error = this._moveBundleFile(bundleSourcePath, bundleDest, function (sContents) {
            return RequireUtil_1.RequireUtil.replaceMdkRequire(sContents);
        });
        if (!error) {
            this._moveBundleFile(fs.path.join(this.zipDest, 'bundle.js.map'), bundleDest + '.map');
        }
        return error;
    };
    AppExtractHelper.prototype.removeFolder = function () {
        var extractedZipFolder = fs.Folder.fromPath(this.zipDest);
        extractedZipFolder.removeSync(function (e) {
            Logger_1.Logger.instance.core.error("Failed to remove extracted zip folder: " + e);
        });
    };
    AppExtractHelper.prototype.removeDownloadedZipFile = function () {
        var zipSourceFile = fs.File.fromPath(this.zipSource);
        zipSourceFile.removeSync(function (e) {
            Logger_1.Logger.instance.core.error("Failed to remove temp download zip: " + e);
        });
    };
    AppExtractHelper.prototype._moveBundleFile = function (bundleSourcePath, bundleDest, cb) {
        var error;
        var bundleExists = fs.File.exists(bundleSourcePath);
        var bundleSourceFile;
        var bundleSourceData;
        if (bundleExists) {
            bundleSourceFile = fs.File.fromPath(bundleSourcePath);
        }
        else {
            error = bundleSourcePath + ' does not exist';
        }
        if (!error) {
            bundleSourceData = bundleSourceFile.readTextSync(function (e) {
                error = e;
                Logger_1.Logger.instance.core.error("App download file read failed: " + error);
            });
        }
        if (!error) {
            if (cb) {
                bundleSourceData = cb(bundleSourceData);
            }
            var bundleDesthFile = fs.File.fromPath(bundleDest);
            bundleDesthFile.writeTextSync(bundleSourceData, function (e) {
                error = e;
                Logger_1.Logger.instance.core.error("App download file write failed: " + error);
            });
        }
        return error;
    };
    AppExtractHelper._instance = new AppExtractHelper();
    return AppExtractHelper;
}());
exports.AppExtractHelper = AppExtractHelper;
; 
if (false ) {} 

/***/ }),
/* 25 */,
/* 26 */,
/* 27 */
/***/ (function(module, exports) {

module.exports = require("@nativescript/core");

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./app.css": 14
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 28;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./App_Delegates/CustomAppDelegate.ts": 15,
	"./App_Delegates/CustomEventHandler.ts": 23,
	"./Application.ts": 4,
	"./app.css": 14,
	"./app.ts": 12,
	"./definitions/BundleDefinitionLoader.ts": 8,
	"./definitions/DemoBundleDefinitionLoader.ts": 9,
	"./lifecycleManagement/AppExtractHelper.ts": 24,
	"./lifecycleManagement/AppExtractWorker.ts": 65,
	"./lifecycleManagement/LifecycleAppVersionInfo.ts": 20,
	"./lifecycleManagement/LifecycleManager.ts": 7,
	"./storage/Paths.ts": 11
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 29;

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("tns-core-modules/ui/dialogs");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/context/IContext");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/context/Context");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/definitions/DefinitionProvider");

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/definitions/IDefinitionProvider");

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/definitions/PathToExportName");

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/data/IDataService");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/data/ODataService");

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/data/IRestService");

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/data/RestService");

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("tns-core-modules/timer");

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = require("tns-core-modules/xml");

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/errorHandling/ErrorMessage");

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = require("tns-core-modules/data/observable/observable");

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
	return new Worker("./" + __webpack_require__.p + "0db87c22e8a45e510aac.worker.js");
};

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/actions/IActionFactory");

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/actions/ActionFactory");

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/targetpath/segments/ISegmentFactory");

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/targetpath/segments/SegmentFactory");

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/controls/IControlFactory");

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/storage/SecureStore");

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/styling/SDKStylingManager");

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/utils/TypeConverter");

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/utils/AppSettingsManager");

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/utils/I18nHelper");

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/pages/ModalFrame");

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/controls/ControlFactorySync");

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/utils/ImageHelper");

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/pages/TabFrame");

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/builders/ApplicationDataBuilder");

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/common/MDKNavigationType");

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = require("nativescript-ui-sidedrawer");

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/utils/StyleHelper");

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/CustomEventHandler");

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = require("zip-plugin");

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(66);
var AppExtractHelper_1 = __webpack_require__(24);
var context = self;
context.onmessage = function (msg) {
    setTimeout(function () {
        var error = AppExtractHelper_1.AppExtractHelper.getInstance().extract(msg);
        global.postMessage({ err: error });
        AppExtractHelper_1.AppExtractHelper.getInstance().removeFolder();
        AppExtractHelper_1.AppExtractHelper.getInstance().removeDownloadedZipFile();
    }, 500);
};
; 
if (false ) {} 
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(5)))

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = require("tns-core-modules/globals");

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = require("@nativescript/core/bundle-entry-points");

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = require("tns-core-modules/trace");

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/Application");

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/lifecycleManagement/LifecycleManager");

/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/storage/Paths");

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/definitions/DemoBundleDefinitionLoader");

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/utils/ConsoleWriter");

/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = require("@nota/nativescript-accessibility-ext");

/***/ })
],[[12,1,2]]]);