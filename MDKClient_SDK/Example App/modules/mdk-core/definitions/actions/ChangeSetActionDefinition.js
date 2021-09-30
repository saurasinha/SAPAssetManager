"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var ChangeSetActionDefinition = (function (_super) {
    __extends(ChangeSetActionDefinition, _super);
    function ChangeSetActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    Object.defineProperty(ChangeSetActionDefinition.prototype, "actions", {
        get: function () {
            return this.data.Actions;
        },
        enumerable: true,
        configurable: true
    });
    return ChangeSetActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.ChangeSetActionDefinition = ChangeSetActionDefinition;
;
