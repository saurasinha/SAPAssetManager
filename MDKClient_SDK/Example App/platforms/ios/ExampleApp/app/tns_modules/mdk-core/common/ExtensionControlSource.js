"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExtensionControlSource;
(function (ExtensionControlSource) {
    ExtensionControlSource[ExtensionControlSource["Extension"] = 1] = "Extension";
    ExtensionControlSource[ExtensionControlSource["Metadata"] = 2] = "Metadata";
})(ExtensionControlSource = exports.ExtensionControlSource || (exports.ExtensionControlSource = {}));
function isExtensionSource(source) {
    return source === ExtensionControlSource.Extension;
}
exports.isExtensionSource = isExtensionSource;
function isMetadataSource(source) {
    return source === ExtensionControlSource.Metadata;
}
exports.isMetadataSource = isMetadataSource;
