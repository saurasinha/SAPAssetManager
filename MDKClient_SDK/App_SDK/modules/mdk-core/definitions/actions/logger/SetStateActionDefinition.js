"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("../BaseActionDefinition");
var SetStateActionDefinition = (function (_super) {
    __extends(SetStateActionDefinition, _super);
    function SetStateActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    SetStateActionDefinition.prototype.getLoggerState = function () {
        return this.data.LoggerState;
    };
    SetStateActionDefinition.prototype.getLogFileName = function () {
        return this.data.LogFileName;
    };
    SetStateActionDefinition.prototype.getMaxFileSize = function () {
        return this.data.MaxFileSize;
    };
    return SetStateActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.SetStateActionDefinition = SetStateActionDefinition;
