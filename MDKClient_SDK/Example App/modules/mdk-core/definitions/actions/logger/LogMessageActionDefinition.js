"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("../BaseActionDefinition");
var LogMessageActionDefinition = (function (_super) {
    __extends(LogMessageActionDefinition, _super);
    function LogMessageActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    LogMessageActionDefinition.prototype.getMessage = function () {
        return this.data.Message;
    };
    LogMessageActionDefinition.prototype.getLevel = function () {
        return this.data.Level;
    };
    return LogMessageActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.LogMessageActionDefinition = LogMessageActionDefinition;
