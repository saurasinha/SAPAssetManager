"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("./BaseControlDefinition");
var FlexibleColumnLayoutDefinition = (function (_super) {
    __extends(FlexibleColumnLayoutDefinition, _super);
    function FlexibleColumnLayoutDefinition(path, data, parent) {
        var _this = _super.call(this, path, data, parent) || this;
        if (!_this.data || !_this.data.StartColumn) {
            return _this;
        }
        _this.startColumn = data.StartColumn;
        _this.endColumn = data.EndColumn;
        return _this;
    }
    FlexibleColumnLayoutDefinition.prototype.getStartColumn = function () {
        return this.startColumn;
    };
    FlexibleColumnLayoutDefinition.prototype.getEndColumn = function () {
        return this.endColumn;
    };
    return FlexibleColumnLayoutDefinition;
}(BaseControlDefinition_1.BaseControlDefinition));
exports.FlexibleColumnLayoutDefinition = FlexibleColumnLayoutDefinition;
;
