"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DemoBundleDefinitionLoader = (function () {
    function DemoBundleDefinitionLoader() {
    }
    DemoBundleDefinitionLoader.setLoader = function (loader) {
        this._loader = loader;
    };
    DemoBundleDefinitionLoader.validLocationExists = function () {
        return this._loader.validLocationExists();
    };
    return DemoBundleDefinitionLoader;
}());
exports.DemoBundleDefinitionLoader = DemoBundleDefinitionLoader;
