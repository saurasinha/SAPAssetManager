"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MDKNavigationType;
(function (MDKNavigationType) {
    MDKNavigationType[MDKNavigationType["Inner"] = 0] = "Inner";
    MDKNavigationType[MDKNavigationType["Outer"] = 1] = "Outer";
    MDKNavigationType[MDKNavigationType["Cross"] = 2] = "Cross";
    MDKNavigationType[MDKNavigationType["Root"] = 3] = "Root";
})(MDKNavigationType = exports.MDKNavigationType || (exports.MDKNavigationType = {}));
function isNavigationTypeValid(navType) {
    var _this = this;
    var item = Object.keys(MDKNavigationType).filter(function (k) { return _this.MDKNavigationType[k] === navType; });
    return item ? item.length > 0 : false;
}
exports.isNavigationTypeValid = isNavigationTypeValid;
function parseNavigationType(navType) {
    if (this.isNavigationTypeValid(navType)) {
        return this.MDKNavigationType[navType];
    }
    return null;
}
exports.parseNavigationType = parseNavigationType;
