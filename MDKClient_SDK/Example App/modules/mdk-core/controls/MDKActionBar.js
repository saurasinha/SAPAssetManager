"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var action_bar_1 = require("tns-core-modules/ui/action-bar");
var utils_1 = require("tns-core-modules/utils/utils");
var CssPropertyParser_1 = require("../utils/CssPropertyParser");
var MDKActionBar = (function (_super) {
    __extends(MDKActionBar, _super);
    function MDKActionBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDKActionBar.prototype.setTitleColor = function (color) {
        this._titleColor = color;
    };
    MDKActionBar.prototype.update = function () {
        _super.prototype.update.call(this);
        if (app.ios && utils_1.ios.MajorVersion >= 13) {
            this._updateColorsByBarAppearance();
        }
    };
    MDKActionBar.prototype._updateColorsByBarAppearance = function () {
        var _a, _b;
        var page = this.page;
        if (!page || !page.frame) {
            return;
        }
        var viewController = page.ios;
        var navController = viewController.navigationController;
        if (!navController) {
            return;
        }
        var navBar = navController.navigationBar;
        if (navBar) {
            var titleColorObj = void 0;
            if (this._titleColor) {
                titleColorObj = CssPropertyParser_1.CssPropertyParser.createColor(this._titleColor);
            }
            var color = titleColorObj || this.color;
            var bgColor = this.backgroundColor;
            var updateBarAppearance = void 0;
            var navBarStyle = navBar.standardAppearance ? navBar.standardAppearance : UINavigationBarAppearance.new();
            navBarStyle.configureWithOpaqueBackground();
            if (color && color.ios) {
                updateBarAppearance = true;
                navBarStyle.titleTextAttributes = (_a = {}, _a[NSForegroundColorAttributeName] = color.ios, _a);
                navBarStyle.largeTitleTextAttributes = (_b = {}, _b[NSForegroundColorAttributeName] = color.ios, _b);
            }
            if (bgColor && bgColor.ios) {
                updateBarAppearance = true;
                navBarStyle.backgroundColor = bgColor.ios;
            }
            if (updateBarAppearance) {
                navBarStyle.shadowColor = null;
                UINavigationBar.appearanceWhenContainedInInstancesOfClasses([UINavigationController.class()])
                    .standardAppearance = navBarStyle;
            }
        }
    };
    return MDKActionBar;
}(action_bar_1.ActionBar));
exports.MDKActionBar = MDKActionBar;
;
