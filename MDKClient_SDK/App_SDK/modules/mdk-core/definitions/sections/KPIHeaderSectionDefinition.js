"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionDefinition_1 = require("./BaseSectionDefinition");
var KPIHeaderSectionDefinition = (function (_super) {
    __extends(KPIHeaderSectionDefinition, _super);
    function KPIHeaderSectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(KPIHeaderSectionDefinition.prototype, "KPIHeader", {
        get: function () {
            return this.data.KPIHeader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KPIHeaderSectionDefinition.prototype, "target", {
        get: function () {
            return this.KPIHeader.Target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KPIHeaderSectionDefinition.prototype, "KPIItems", {
        get: function () {
            return this.KPIHeader.KPIItems || [];
        },
        enumerable: true,
        configurable: true
    });
    return KPIHeaderSectionDefinition;
}(BaseSectionDefinition_1.BaseSectionDefinition));
exports.KPIHeaderSectionDefinition = KPIHeaderSectionDefinition;
;
