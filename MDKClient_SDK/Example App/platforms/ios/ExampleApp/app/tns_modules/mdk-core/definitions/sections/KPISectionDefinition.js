"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionDefinition_1 = require("./BaseSectionDefinition");
var KPISectionDefinition = (function (_super) {
    __extends(KPISectionDefinition, _super);
    function KPISectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(KPISectionDefinition.prototype, "KPIItems", {
        get: function () {
            return this.data.KPIItems || [];
        },
        enumerable: true,
        configurable: true
    });
    return KPISectionDefinition;
}(BaseSectionDefinition_1.BaseSectionDefinition));
exports.KPISectionDefinition = KPISectionDefinition;
;
