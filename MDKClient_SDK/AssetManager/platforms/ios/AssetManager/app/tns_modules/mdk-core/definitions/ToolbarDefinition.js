"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContainerDefinition_1 = require("./ContainerDefinition");
var BaseControlDefinition_1 = require("./controls/BaseControlDefinition");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ToolbarDefinition = (function (_super) {
    __extends(ToolbarDefinition, _super);
    function ToolbarDefinition(path, data) {
        var _this = this;
        if (data.Items) {
            data.Controls = data.Items;
        }
        _this = _super.call(this, path, data) || this;
        return _this;
    }
    ToolbarDefinition.prototype.getCaption = function () {
        throw new Error(ErrorMessage_1.ErrorMessage.GETCAPTION_NOT_IMPLEMENTED_IN_TOOLBARDEFINITION);
    };
    ToolbarDefinition.prototype.getPosition = function () {
        return this.data.Position;
    };
    ToolbarDefinition.prototype.isValidControl = function (type) {
        return (type === BaseControlDefinition_1.BaseControlDefinition.type.ToolbarItem);
    };
    return ToolbarDefinition;
}(ContainerDefinition_1.ContainerDefinition));
exports.ToolbarDefinition = ToolbarDefinition;
;
