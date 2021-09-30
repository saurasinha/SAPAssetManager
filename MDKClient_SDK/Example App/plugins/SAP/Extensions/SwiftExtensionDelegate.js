"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SwiftExtensionDelegate = (function (_super) {
    __extends(SwiftExtensionDelegate, _super);
    function SwiftExtensionDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwiftExtensionDelegate.initWithBridge = function (bridge, extension) {
        return undefined;
    };
    SwiftExtensionDelegate.prototype.setControlExtension = function (controlExtension) {
    };
    SwiftExtensionDelegate.prototype.setControlValue = function (value) {
    };
    SwiftExtensionDelegate.prototype.executeActionOrRule = function (definitionPath) {
    };
    SwiftExtensionDelegate.prototype.resolveValue = function (value) {
    };
    SwiftExtensionDelegate.ObjCExposedMethods = {
        setControlValue: { value: [NSString], returns: interop.types.void },
        executeActionOrRule: { definitionPath: [NSString], returns: interop.types.void },
        resolveValue: { value: [NSString], returns: interop.types.void },
    };
    return SwiftExtensionDelegate;
}(NSObject));
exports.SwiftExtensionDelegate = SwiftExtensionDelegate;
