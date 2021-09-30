"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("./controls/BaseControlDefinition");
var ExtensionViewDefinition = (function (_super) {
    __extends(ExtensionViewDefinition, _super);
    function ExtensionViewDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ExtensionViewDefinition.prototype, "module", {
        get: function () {
            return this.data.Module;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtensionViewDefinition.prototype, "control", {
        get: function () {
            return this.data.Control;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtensionViewDefinition.prototype, "class", {
        get: function () {
            return this.data.Class;
        },
        enumerable: true,
        configurable: true
    });
    return ExtensionViewDefinition;
}(BaseControlDefinition_1.BaseControlDefinition));
exports.ExtensionViewDefinition = ExtensionViewDefinition;
;
