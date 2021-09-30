"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var LogoutActionDefinition = (function (_super) {
    __extends(LogoutActionDefinition, _super);
    function LogoutActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    LogoutActionDefinition.prototype.getSkipReset = function () {
        return this.data.SkipReset ? this.data.SkipReset : false;
    };
    return LogoutActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.LogoutActionDefinition = LogoutActionDefinition;
;
