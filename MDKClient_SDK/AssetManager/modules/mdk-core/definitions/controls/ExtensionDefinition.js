"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("./BaseControlDefinition");
var ExtensionDefinition = (function (_super) {
    __extends(ExtensionDefinition, _super);
    function ExtensionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ExtensionDefinition.prototype, "module", {
        get: function () {
            return this.data.Module;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtensionDefinition.prototype, "control", {
        get: function () {
            return this.data.Control;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtensionDefinition.prototype, "class", {
        get: function () {
            return this.data.Class;
        },
        enumerable: true,
        configurable: true
    });
    return ExtensionDefinition;
}(BaseControlDefinition_1.BaseControlDefinition));
exports.ExtensionDefinition = ExtensionDefinition;
;
