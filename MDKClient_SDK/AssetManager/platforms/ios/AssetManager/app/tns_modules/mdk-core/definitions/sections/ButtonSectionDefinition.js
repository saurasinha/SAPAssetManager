"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionDefinition_1 = require("./BaseSectionDefinition");
var ButtonSectionDefinition = (function (_super) {
    __extends(ButtonSectionDefinition, _super);
    function ButtonSectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ButtonSectionDefinition.prototype, "Buttons", {
        get: function () {
            return this.data.Buttons;
        },
        enumerable: true,
        configurable: true
    });
    return ButtonSectionDefinition;
}(BaseSectionDefinition_1.BaseSectionDefinition));
exports.ButtonSectionDefinition = ButtonSectionDefinition;
;
