"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var SetRegionActionDefinition = (function (_super) {
    __extends(SetRegionActionDefinition, _super);
    function SetRegionActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    SetRegionActionDefinition.prototype.getRegion = function () {
        return this.data.Region;
    };
    return SetRegionActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.SetRegionActionDefinition = SetRegionActionDefinition;
;
