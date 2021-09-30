"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var color_1 = require("tns-core-modules/color");
var nativeHelper = require("tns-core-modules/utils/native-helper");
var NavigationBar = (function () {
    function NavigationBar() {
    }
    NavigationBar.applyFioriStyle = function () {
    };
    NavigationBar.applyTitleStyle = function (page, backgroundColor, titleColor, titleFont) {
        var nativeActionBar = page.actionBar.nativeViewProtected;
        if (nativeActionBar) {
            var activity = app.android.foregroundActivity;
            if (activity) {
                if (backgroundColor) {
                    activity.getWindow().setStatusBarColor(backgroundColor.android);
                }
                else {
                    var colorId = nativeHelper.ad.getResources().getIdentifier('sap_ui_page_footer_background', 'color', nativeHelper.ad.getApplicationContext().getPackageName());
                    if (colorId > -1) {
                        var color = nativeHelper.ad.getResources().getColor(colorId);
                        if (color) {
                            activity.getWindow().setStatusBarColor(new color_1.Color(color).android);
                        }
                    }
                }
                if (titleColor) {
                }
            }
            var typeFace = titleFont.getAndroidTypeface();
            for (var n = 0; n < nativeActionBar.getChildCount(); n++) {
                var view = nativeActionBar.getChildAt(n);
                if (view.setTextSize) {
                    if (titleColor) {
                        view.setTextColor(titleColor.android);
                    }
                    if (!isNaN(titleFont.fontSize)) {
                        view.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, titleFont.fontSize);
                    }
                    if (typeFace) {
                        view.setTypeface(typeFace, typeFace.getStyle());
                    }
                }
            }
        }
    };
    NavigationBar.updateActionBarElevation = function (page, on) {
        if (on) {
            var density = app.android.context.getResources().getDisplayMetrics().density;
            page.actionBar.nativeViewProtected.setElevation(4 * density);
        }
        else {
            page.actionBar.nativeViewProtected.setElevation(0);
        }
    };
    return NavigationBar;
}());
exports.NavigationBar = NavigationBar;
