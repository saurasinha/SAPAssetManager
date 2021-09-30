"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
var ViewWrapper = (function (_super) {
    __extends(ViewWrapper, _super);
    function ViewWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
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
        this._iosView = view;
        this._androidView = undefined;
    };
    return ViewWrapper;
}(view_1.View));
exports.ViewWrapper = ViewWrapper;
;
