"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
var UIViewContainer = (function (_super) {
    __extends(UIViewContainer, _super);
    function UIViewContainer(view) {
        var _this = _super.call(this) || this;
        if (view instanceof UIView) {
            _this._view = view;
        }
        else if (view instanceof UIViewController) {
            _this._viewController = view;
            _this._view = view.view;
        }
        _this.iosOverflowSafeArea = true;
        return _this;
    }
    UIViewContainer.prototype.createNativeView = function () {
        if (this._viewController) {
            this.page.ios.addChildViewController(this._viewController);
        }
        return this._view;
    };
    UIViewContainer.prototype.initNativeView = function () {
        this.nativeView.owner = this;
        this.nativeView.frame = this.ios.bounds;
        _super.prototype.initNativeView.call(this);
    };
    UIViewContainer.prototype.disposeNativeView = function () {
        if (this.nativeView) {
            this.nativeView.owner = null;
        }
        _super.prototype.disposeNativeView.call(this);
    };
    return UIViewContainer;
}(view_1.View));
exports.UIViewContainer = UIViewContainer;
