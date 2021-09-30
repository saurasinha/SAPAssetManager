"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValueResolver_1 = require("./utils/ValueResolver");
var EventHandler_1 = require("./EventHandler");
var app = require("tns-core-modules/application");
var IView = (function () {
    function IView() {
    }
    IView.prototype.initialize = function (controlData) {
        this._props = controlData;
    };
    IView.prototype.definition = function () {
        return this._props.definition;
    };
    IView.prototype.onDisplayingModal = function (isFullPage) {
    };
    IView.prototype.onDismissingModal = function () {
    };
    IView.prototype.onNavigatedTo = function (initialLoading) {
    };
    IView.prototype.onNavigatedFrom = function (pageExists) {
    };
    IView.prototype.onNavigatingTo = function (initialLoading) {
    };
    IView.prototype.onNavigatingFrom = function (pageExists) {
    };
    IView.prototype.onPageUnloaded = function (pageExists) {
    };
    IView.prototype.onPress = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    IView.prototype.onPageLoaded = function (initialLoading) {
    };
    IView.prototype.valueResolver = function () {
        return ValueResolver_1.ValueResolver;
    };
    IView.prototype.setStyle = function () {
    };
    IView.prototype.viewIsNative = function () {
        return false;
    };
    IView.prototype.androidContext = function () {
        return (this._props.page && this._props.page.android) ?
            this._props.page.android.getContext() :
            app.android ? app.android.foregroundActivity : null;
    };
    IView.prototype.executeAction = function (actionOrRulePath) {
        var oEventHandler = new EventHandler_1.EventHandler();
        if (this.context.clientAPIProps && this.context.clientAPIProps.eventSource) {
            oEventHandler.setEventSource(this.context.clientAPIProps.eventSource);
        }
        return oEventHandler.executeActionOrRule(actionOrRulePath, this.context);
    };
    IView.prototype.executeActionOrRule = function (actionOrRulePath) {
        var oEventHandler = new EventHandler_1.EventHandler();
        if (this.context.clientAPIProps && this.context.clientAPIProps.eventSource) {
            oEventHandler.setEventSource(this.context.clientAPIProps.eventSource);
        }
        return oEventHandler.executeActionOrRule(actionOrRulePath, this.context);
    };
    return IView;
}());
exports.IView = IView;
;
