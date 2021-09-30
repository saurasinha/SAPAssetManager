"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformModule = require("tns-core-modules/platform");
var NavigationBar = (function () {
    function NavigationBar() {
    }
    NavigationBar.applyFioriStyle = function () {
        NavigationBarBridge.applyFioriStyle();
    };
    NavigationBar.applyTitleStyle = function (page, backgroundColor, titleColor, titleFont) {
        var _a, _b, _c;
        if (page.frame) {
            var navController = page.frame.ios.controller;
            var navigationBar = navController ? navController.navigationBar : null;
            if (navigationBar) {
                var defaultUIFont = UIFont.systemFontOfSize(UIFont.labelFontSize);
                var titleTextAttributes = void 0;
                if (titleColor && titleFont) {
                    titleTextAttributes = (_a = {},
                        _a[NSForegroundColorAttributeName] = titleColor.ios,
                        _a[NSFontAttributeName] = titleFont.getUIFont(defaultUIFont),
                        _a);
                }
                else if (titleColor) {
                    titleTextAttributes = (_b = {},
                        _b[NSForegroundColorAttributeName] = titleColor.ios,
                        _b);
                }
                else if (titleFont) {
                    titleTextAttributes = (_c = {},
                        _c[NSFontAttributeName] = titleFont.getUIFont(defaultUIFont),
                        _c);
                }
                if (titleTextAttributes) {
                    if (PlatformModule.device.sdkVersion.toString().indexOf('13') >= 0) {
                        var navBarAppearance = navigationBar.standardAppearance ?
                            navigationBar.standardAppearance : UINavigationBarAppearance.new();
                        navBarAppearance.titleTextAttributes = titleTextAttributes;
                        UINavigationBar.appearanceWhenContainedInInstancesOfClasses([UINavigationController.class()])
                            .standardAppearance = navBarAppearance;
                    }
                    else {
                        navigationBar.titleTextAttributes = titleTextAttributes;
                    }
                }
                UIApplication.sharedApplication.setStatusBarStyleAnimated(1, true);
            }
        }
    };
    NavigationBar.updateActionBarElevation = function (page, on) {
    };
    return NavigationBar;
}());
exports.NavigationBar = NavigationBar;
