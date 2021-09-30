"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Paths = (function () {
    function Paths() {
    }
    Paths.setClass = function (clazz) {
        this._clazz = clazz;
    };
    Paths.getOverridePath = function () {
        return this._clazz.getOverridePath();
    };
    Paths.getSavedSettingsPath = function () {
        return this._clazz.getSavedSettingsPath();
    };
    return Paths;
}());
exports.Paths = Paths;
