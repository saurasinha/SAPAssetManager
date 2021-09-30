"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("./BaseControlDefinition");
var ExtensionFormCellDefinition = (function (_super) {
    __extends(ExtensionFormCellDefinition, _super);
    function ExtensionFormCellDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ExtensionFormCellDefinition.prototype, "module", {
        get: function () {
            return this.data.Module;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtensionFormCellDefinition.prototype, "control", {
        get: function () {
            return this.data.Control;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtensionFormCellDefinition.prototype, "class", {
        get: function () {
            return this.data.Class;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtensionFormCellDefinition.prototype, "height", {
        get: function () {
            return this.data.Height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtensionFormCellDefinition.prototype, "onPress", {
        get: function () {
            return this.data.OnPress;
        },
        enumerable: true,
        configurable: true
    });
    return ExtensionFormCellDefinition;
}(BaseControlDefinition_1.BaseControlDefinition));
exports.ExtensionFormCellDefinition = ExtensionFormCellDefinition;
