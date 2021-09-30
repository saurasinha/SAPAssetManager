"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WelcomeScreen = (function () {
    function WelcomeScreen() {
    }
    WelcomeScreen.getInstance = function () {
        return null;
    };
    WelcomeScreen.prototype.create = function (params, callback) {
    };
    WelcomeScreen.prototype.onLoaded = function () {
    };
    WelcomeScreen.prototype.reInitializePage = function (params) {
    };
    WelcomeScreen.prototype.manageBlurScreen = function (params) {
    };
    WelcomeScreen.prototype.applicationWillEnterForeground = function () {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    WelcomeScreen.prototype.changeUserPasscode = function () {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    WelcomeScreen.prototype.verifyPasscode = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    WelcomeScreen.prototype.restoreOnRelaunch = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    WelcomeScreen.prototype.resetClient = function () {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    WelcomeScreen.prototype.showErrorScreen = function (params, onboardingParams) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    WelcomeScreen.prototype.showSyncInProgressScreen = function (onboardingParams) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    WelcomeScreen.prototype.showNoNetworkScreen = function (onboardingParams) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    WelcomeScreen.prototype.applicationWillEnterBackground = function () {
    };
    WelcomeScreen.prototype.finishUserSwitchSyncInProgress = function () {
    };
    WelcomeScreen.prototype.isAppInMultiUserMode = function () {
        return false;
    };
    return WelcomeScreen;
}());
exports.WelcomeScreen = WelcomeScreen;
;
