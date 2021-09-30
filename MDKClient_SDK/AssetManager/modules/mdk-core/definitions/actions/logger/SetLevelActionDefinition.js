"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("../BaseActionDefinition");
var SetLevelActionDefinition = (function (_super) {
    __extends(SetLevelActionDefinition, _super);
    function SetLevelActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    SetLevelActionDefinition.prototype.getLevel = function () {
        return this.data.Level;
    };
    return SetLevelActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.SetLevelActionDefinition = SetLevelActionDefinition;
