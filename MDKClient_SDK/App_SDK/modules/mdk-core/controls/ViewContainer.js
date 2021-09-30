"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
var ViewContainer = (function (_super) {
    __extends(ViewContainer, _super);
    function ViewContainer(view) {
        var _this = _super.call(this) || this;
        _this._view = view;
        return _this;
    }
    ViewContainer.prototype.createNativeView = function () {
        return this._view;
    };
    ViewContainer.prototype.initNativeView = function () {
        this.nativeView.owner = this;
        _super.prototype.initNativeView.call(this);
    };
    ViewContainer.prototype.disposeNativeView = function () {
        if (this.nativeView) {
            this.nativeView.owner = null;
        }
        _super.prototype.disposeNativeView.call(this);
    };
    return ViewContainer;
}(view_1.View));
exports.ViewContainer = ViewContainer;
