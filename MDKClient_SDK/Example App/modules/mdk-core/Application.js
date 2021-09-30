"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Application = (function () {
    function Application() {
    }
    Application.setApplication = function (app) {
        this._app = app;
    };
    Application.setResumeEventDelayed = function (delayed) {
        this._app.setResumeEventDelayed(delayed);
    };
    Application.getPendingResumeEventData = function () {
        return this._app.getPendingResumeEventData();
    };
    Application.onResume = function (appEventData, runWithoutUpdate) {
        if (runWithoutUpdate === void 0) { runWithoutUpdate = false; }
        this._app.onResume(appEventData, runWithoutUpdate);
    };
    Application.setPendingResumeEventData = function (eventData) {
        this._app.setPendingResumeEventData(eventData);
    };
    Application.resetClient = function () {
        return this._app.resetClient();
    };
    Application.resetInitializedOData = function () {
        return this._app.resetInitializedOData();
    };
    Application.reInitializeLogger = function () {
        this._app.reInitializeLogger();
    };
    Application.setODataService = function () {
        this._app.setODataService();
    };
    Application.activityBackPressedEventHandler = function (args) {
        this._app.activityBackPressedEventHandler(args);
    };
    Application.isMainPageRendered = function () {
        return this._app.isMainPageRendered();
    };
    Application.setMainPageRendered = function (mainPageRendered) {
        this._app.setMainPageRendered(mainPageRendered);
    };
    Application.getContext = function () {
        return this._app.context;
    };
    Application.resetAppState = function () {
        this._app.resetAppState();
    };
    Application.startApplication = function (secretKeys) {
        return this._app.startApplication(secretKeys);
    };
    Application.launchAppMainPage = function (didLaunchApp) {
        return this._app.launchAppMainPage(didLaunchApp);
    };
    Application.setOnboardingCompleted = function (completed) {
        this._app.setOnboardingCompleted(completed);
    };
    Application.setNonNSActivityDone = function (nonNSActivityDone) {
        this._app.setNonNSActivityDone(nonNSActivityDone);
    };
    Application.getApplicationParams = function () {
        return this._app.getApplicationParams();
    };
    Application.applyThemeOnApplication = function (theme, existingTheme, initialLaunch) {
        return this._app.applyThemeOnApplication(theme, existingTheme, initialLaunch);
    };
    Application.onUserSwitch = function (eventData) {
        return this._app.onUserSwitch(eventData);
    };
    return Application;
}());
exports.Application = Application;
