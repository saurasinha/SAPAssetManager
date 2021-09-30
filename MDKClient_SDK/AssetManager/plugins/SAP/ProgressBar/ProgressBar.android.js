"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
var ProgressBar = (function (_super) {
    __extends(ProgressBar, _super);
    function ProgressBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProgressBar.prototype.createNativeView = function () {
        var res = this._context.getResources().getIdentifier('FioriProgressbar.Horizontal', 'style', this._context.getPackageName());
        if (!res) {
            res = android.R.attr.progressBarStyleHorizontal;
        }
        var progressIndicator = new android.widget.ProgressBar(this._context, null, android.R.attr.progressBarStyleHorizontal, res);
        progressIndicator.setIndeterminate(true);
        progressIndicator.setVisibility(android.view.ViewGroup.GONE);
        return progressIndicator;
    };
    ProgressBar.prototype.initNativeView = function () {
        this.nativeView.owner = this;
        _super.prototype.initNativeView.call(this);
    };
    ProgressBar.prototype.disposeNativeView = function () {
        if (this.nativeView) {
            this.nativeView.owner = null;
        }
        _super.prototype.disposeNativeView.call(this);
    };
    ProgressBar.prototype.show = function () {
        if (this.nativeView) {
            this.nativeView.setVisibility(android.view.ViewGroup.VISIBLE);
        }
    };
    ProgressBar.prototype.hide = function () {
        if (this.nativeView) {
            this.nativeView.setVisibility(android.view.ViewGroup.GONE);
        }
    };
    return ProgressBar;
}(view_1.View));
exports.ProgressBar = ProgressBar;
