"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = (function () {
    function Util() {
    }
    Util.toSoftKeyboardType = function (keyboardVisibility) {
        var type = 0;
        if (keyboardVisibility) {
            if (keyboardVisibility === 'AlwaysShow') {
                type = 1;
            }
            else if (keyboardVisibility === 'AlwaysHide') {
                type = 2;
            }
        }
        return type;
    };
    Util.getPopoverOnPress = function (onPress) {
        var onPressValue = onPress;
        try {
            onPressValue = JSON.parse(onPress);
        }
        catch (e) { }
        if (!onPressValue) {
            onPressValue = onPress;
        }
        return onPressValue;
    };
    return Util;
}());
exports.Util = Util;
;
