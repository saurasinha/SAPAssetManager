"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
var ProgressBar = (function (_super) {
    __extends(ProgressBar, _super);
    function ProgressBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProgressBar.prototype.show = function () {
        throw new Error('ProgressBar not implemented for iOS');
    };
    ProgressBar.prototype.hide = function () {
        throw new Error('ProgressBar not implemented for iOS');
    };
    return ProgressBar;
}(view_1.View));
exports.ProgressBar = ProgressBar;
