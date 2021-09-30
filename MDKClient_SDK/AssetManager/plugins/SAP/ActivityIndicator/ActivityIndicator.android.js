"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var app = require("tns-core-modules/application");
var androidApp = app.android;
var ActivityIndicator = (function () {
    function ActivityIndicator() {
        this._activityIndicatorBridge = new com.sap.mdk.client.ui.fiori.activityIndicator.ActivityIndicator();
        this._shownItems = [];
        this._isHidden = false;
        this._currentId = 0;
        if (ActivityIndicator._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.ACTIVITY_INDICATOR_INSTANTIATION_FAILED);
        }
        ActivityIndicator._instance = this;
    }
    Object.defineProperty(ActivityIndicator, "instance", {
        get: function () {
            return ActivityIndicator._instance;
        },
        enumerable: true,
        configurable: true
    });
    ActivityIndicator.prototype.dismiss = function (indicatorDisplayer) {
        var itemToRemove = this._shownItems.find(function (item) {
            return item.indicatorDisplayer === indicatorDisplayer;
        });
        if (itemToRemove) {
            this.dismissWithId(itemToRemove.id);
        }
    };
    ActivityIndicator.prototype.dismissWithId = function (id) {
        var indexToRemove = this._shownItems.findIndex(function (item) {
            return item.id === id;
        });
        if (indexToRemove === -1) {
            var reversedCopy = this._shownItems.slice().reverse();
            indexToRemove = this._shownItems.length - 1 - reversedCopy.findIndex(function (item) {
                return !item.indicatorDisplayer;
            });
            if (indexToRemove === -1) {
                return;
            }
        }
        var dismissingCurrentIndicator = indexToRemove === this._shownItems.length - 1;
        this._shownItems.splice(indexToRemove, 1);
        if (!dismissingCurrentIndicator) {
            return;
        }
        if (this._isActive) {
            if (!this._isHidden) {
                this._showCurrentItem();
            }
        }
        else {
            if (this._isHidden) {
                this._isHidden = false;
            }
            else {
                this._activityIndicatorBridge.dismiss();
            }
        }
    };
    ActivityIndicator.prototype.show = function (text, indicatorDisplayer, subText) {
        var item = {
            id: this._currentId++,
            indicatorDisplayer: indicatorDisplayer,
            subText: subText || '',
            text: text || '',
        };
        this._shownItems.push(item);
        if (!this._isHidden) {
            this._showCurrentItem();
        }
        return item.id;
    };
    ActivityIndicator.prototype.hide = function () {
        if (!this._isActive || this._isHidden) {
            return;
        }
        this._activityIndicatorBridge.dismiss();
        this._isHidden = true;
    };
    ActivityIndicator.prototype.unhide = function () {
        if (!this._isActive || !this._isHidden) {
            return;
        }
        this._showCurrentItem();
        this._isHidden = false;
    };
    ActivityIndicator.prototype.setScreenSharing = function (screenSharing) {
        this._screenSharing = screenSharing;
    };
    Object.defineProperty(ActivityIndicator.prototype, "_isActive", {
        get: function () {
            return this._shownItems.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    ActivityIndicator.prototype._showCurrentItem = function () {
        var item = this._shownItems[this._shownItems.length - 1];
        var params = new org.json.JSONObject();
        params.put('text', item.text);
        params.put('subText', item.subText);
        params.put('screenSharing', this._screenSharing);
        this._activityIndicatorBridge.show(params, androidApp.foregroundActivity);
    };
    ActivityIndicator._instance = new ActivityIndicator();
    return ActivityIndicator;
}());
exports.ActivityIndicator = ActivityIndicator;
;
