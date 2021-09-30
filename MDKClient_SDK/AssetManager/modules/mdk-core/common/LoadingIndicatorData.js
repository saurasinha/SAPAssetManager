"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoadingIndicatorData = (function () {
    function LoadingIndicatorData() {
        this._enabled = false;
        this._text = '';
        this._indicatorId = -1;
    }
    Object.defineProperty(LoadingIndicatorData.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (enabled) {
            this._enabled = enabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingIndicatorData.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (text) {
            this._text = text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingIndicatorData.prototype, "indicatorId", {
        get: function () {
            return this._indicatorId;
        },
        set: function (id) {
            this._indicatorId = id;
        },
        enumerable: true,
        configurable: true
    });
    return LoadingIndicatorData;
}());
exports.LoadingIndicatorData = LoadingIndicatorData;
