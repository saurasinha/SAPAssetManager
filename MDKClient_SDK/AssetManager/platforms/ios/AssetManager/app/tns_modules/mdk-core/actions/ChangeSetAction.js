"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var ChangeSetActionDefinition_1 = require("../definitions/actions/ChangeSetActionDefinition");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ChangeSetAction = (function (_super) {
    __extends(ChangeSetAction, _super);
    function ChangeSetAction(definition) {
        var _this = this;
        if (!(definition instanceof ChangeSetActionDefinition_1.ChangeSetActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_CHANGESETACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    return ChangeSetAction;
}(BaseAction_1.BaseAction));
exports.ChangeSetAction = ChangeSetAction;
;
