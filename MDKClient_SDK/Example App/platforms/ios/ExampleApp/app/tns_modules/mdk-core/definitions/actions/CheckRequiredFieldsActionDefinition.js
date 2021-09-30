"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var CheckRequiredFieldsActionDefinition = (function (_super) {
    __extends(CheckRequiredFieldsActionDefinition, _super);
    function CheckRequiredFieldsActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    CheckRequiredFieldsActionDefinition.prototype.getRequiredFields = function () {
        return this.data.RequiredFields;
    };
    return CheckRequiredFieldsActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.CheckRequiredFieldsActionDefinition = CheckRequiredFieldsActionDefinition;
;
