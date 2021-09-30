"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var VerifyPasscodeActionDefinition = (function (_super) {
    __extends(VerifyPasscodeActionDefinition, _super);
    function VerifyPasscodeActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    VerifyPasscodeActionDefinition.prototype.getAllowCancel = function () {
        return this.data.AllowCancel;
    };
    return VerifyPasscodeActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.VerifyPasscodeActionDefinition = VerifyPasscodeActionDefinition;
;
