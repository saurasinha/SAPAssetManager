"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ViewWrapper = (function () {
    function ViewWrapper() {
    }
    Object.defineProperty(ViewWrapper.prototype, "ios", {
        get: function () {
            return this._iosView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewWrapper.prototype, "android", {
        get: function () {
            return this._androidView;
        },
        enumerable: true,
        configurable: true
    });
    ViewWrapper.prototype.setView = function (view) {
    };
    return ViewWrapper;
}());
exports.ViewWrapper = ViewWrapper;
;
