"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SwiftExtensionDelegate_1 = require("./SwiftExtensionDelegate");
var SwiftExtension = (function () {
    function SwiftExtension() {
    }
    SwiftExtension.prototype.create = function (className, params, extension) {
        extension.bridge = SwiftExtensionBridge.new();
        this._delegate = SwiftExtensionDelegate_1.SwiftExtensionDelegate.initWithBridge(extension.bridge, extension);
        extension.bridge.createWithParamsAndDelegate(className, params, this._delegate);
        return extension.bridge.extension;
    };
    SwiftExtension.prototype.getDelegate = function () {
        return this._delegate;
    };
    SwiftExtension.prototype.setDelegate = function (delegate) {
        this._delegate = delegate;
    };
    return SwiftExtension;
}());
exports.SwiftExtension = SwiftExtension;
