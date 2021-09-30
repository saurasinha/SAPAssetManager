"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionDefinition_1 = require("./BaseSectionDefinition");
var ObjectHeaderSectionDefinition = (function (_super) {
    __extends(ObjectHeaderSectionDefinition, _super);
    function ObjectHeaderSectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ObjectHeaderSectionDefinition.prototype, "ObjectHeader", {
        get: function () {
            return this.data.ObjectHeader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectHeaderSectionDefinition.prototype, "DetailContentContainer", {
        get: function () {
            var container = this.ObjectHeader.DetailContentContainer;
            return container ? container.Controls[0] : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectHeaderSectionDefinition.prototype, "target", {
        get: function () {
            return this.ObjectHeader.Target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectHeaderSectionDefinition.prototype, "onAnalyticViewPress", {
        get: function () {
            return this.data.ObjectHeader.AnalyticView.OnPress;
        },
        enumerable: true,
        configurable: true
    });
    return ObjectHeaderSectionDefinition;
}(BaseSectionDefinition_1.BaseSectionDefinition));
exports.ObjectHeaderSectionDefinition = ObjectHeaderSectionDefinition;
;
