"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Passport = (function () {
    function Passport() {
    }
    Passport.getHeaderValue = function (componentName, action, traceFlag, componentType, prevComponentName, userId) {
        var params = {};
        params[this._componentNameKey] = componentName ? componentName : '';
        params[this._actionKey] = action ? action : '';
        params[this._traceFlagKey] = traceFlag ? traceFlag : '';
        params[this._componentTypeKey] = componentType ? componentType : '';
        params[this._prevComponentNameKey] = prevComponentName ? prevComponentName : '';
        params[this._userIdKey] = userId ? userId : '';
        return this._bridge.getHeaderValue(params);
    };
    Passport._bridge = PassportBridge.new();
    Passport._componentNameKey = 'componentName';
    Passport._actionKey = 'action';
    Passport._traceFlagKey = 'traceFlag';
    Passport._componentTypeKey = 'componentType';
    Passport._prevComponentNameKey = 'prevComponentName';
    Passport._userIdKey = 'userId';
    return Passport;
}());
exports.Passport = Passport;
