"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionDefinition_1 = require("./BaseSectionDefinition");
var ExtensionSectionDefinition = (function (_super) {
    __extends(ExtensionSectionDefinition, _super);
    function ExtensionSectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ExtensionSectionDefinition.prototype, "maxItemCount", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtensionSectionDefinition.prototype, "height", {
        get: function () {
            return this.data.Height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtensionSectionDefinition.prototype, "onPress", {
        get: function () {
            return this.data.OnPress;
        },
        enumerable: true,
        configurable: true
    });
    return ExtensionSectionDefinition;
}(BaseSectionDefinition_1.BaseSectionDefinition));
exports.ExtensionSectionDefinition = ExtensionSectionDefinition;
