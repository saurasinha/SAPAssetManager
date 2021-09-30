"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var SetThemeActionDefinition = (function (_super) {
    __extends(SetThemeActionDefinition, _super);
    function SetThemeActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    SetThemeActionDefinition.prototype.getTheme = function () {
        return this.data.Theme;
    };
    return SetThemeActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.SetThemeActionDefinition = SetThemeActionDefinition;
;
