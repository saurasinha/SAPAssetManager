"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var SetLanguageActionDefinition = (function (_super) {
    __extends(SetLanguageActionDefinition, _super);
    function SetLanguageActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    SetLanguageActionDefinition.prototype.getLanguage = function () {
        return this.data.Language;
    };
    return SetLanguageActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.SetLanguageActionDefinition = SetLanguageActionDefinition;
;
