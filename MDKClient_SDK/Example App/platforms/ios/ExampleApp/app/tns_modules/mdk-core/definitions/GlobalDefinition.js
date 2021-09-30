"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("./BaseJSONDefinition");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var GlobalDefinition = (function (_super) {
    __extends(GlobalDefinition, _super);
    function GlobalDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    GlobalDefinition.prototype.getType = function () {
        var type = this.data._Type ?
            this.data._Type.toLowerCase() : GlobalDefinition.globalType.String;
        if (type === GlobalDefinition.globalType.String ||
            type === GlobalDefinition.globalType.Number ||
            type === GlobalDefinition.globalType.Boolean) {
            return type;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_TYPE_PROPERTY, type));
        }
    };
    GlobalDefinition.prototype.getValue = function () {
        return this.data.Value;
    };
    GlobalDefinition.globalType = {
        Boolean: 'boolean',
        Number: 'number',
        String: 'string',
    };
    return GlobalDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.GlobalDefinition = GlobalDefinition;
;
