"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var foundationPkg = com.sap.mdk.client.foundation;
var Passport = (function () {
    function Passport() {
    }
    Passport.getHeaderValue = function (componentName, action, traceFlag, componentType, prevComponentName, userId) {
        return foundationPkg.PassportBridge.getHeaderValue(componentName, action, traceFlag, componentType, prevComponentName, userId);
    };
    return Passport;
}());
exports.Passport = Passport;
