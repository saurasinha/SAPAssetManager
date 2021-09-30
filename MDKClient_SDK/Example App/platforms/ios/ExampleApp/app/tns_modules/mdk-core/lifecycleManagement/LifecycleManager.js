"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LifecycleManager = (function () {
    function LifecycleManager() {
    }
    LifecycleManager.setInstance = function (instance) {
        this._instance = instance;
    };
    LifecycleManager.getInstance = function () {
        return this._instance;
    };
    return LifecycleManager;
}());
exports.LifecycleManager = LifecycleManager;
