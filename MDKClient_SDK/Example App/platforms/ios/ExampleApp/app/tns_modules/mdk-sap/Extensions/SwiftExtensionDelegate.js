"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SwiftExtensionDelegate = (function (_super) {
    __extends(SwiftExtensionDelegate, _super);
    function SwiftExtensionDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwiftExtensionDelegate.initWithBridge = function (bridge, extension) {
        var controlDelegate = SwiftExtensionDelegate.new();
        controlDelegate._bridge = bridge;
        controlDelegate._controlExtension = extension;
        return controlDelegate;
    };
    SwiftExtensionDelegate.prototype.setControlExtension = function (controlExtension) {
        this._controlExtension = controlExtension;
    };
    SwiftExtensionDelegate.prototype.setControlValue = function (value) {
        this._controlExtension.setControlValue(value);
    };
    SwiftExtensionDelegate.prototype.executeActionOrRule = function (definitionPath) {
        this._controlExtension.executeActionOrRule(definitionPath);
    };
    SwiftExtensionDelegate.prototype.resolveValue = function (value) {
        this._controlExtension.resolveValue(value);
    };
    SwiftExtensionDelegate.ObjCExposedMethods = {
        setControlValue: { params: [NSString], returns: interop.types.void },
        executeActionOrRule: { params: [NSString], returns: interop.types.void },
        resolveValue: { params: [NSString], returns: interop.types.void },
    };
    return SwiftExtensionDelegate;
}(NSObject));
exports.SwiftExtensionDelegate = SwiftExtensionDelegate;
