"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("./BaseControlDefinition");
var BaseControlPagingDefinition = (function (_super) {
    __extends(BaseControlPagingDefinition, _super);
    function BaseControlPagingDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseControlPagingDefinition.prototype.getDataPaging = function () {
        if (this.data.DataPaging) {
            return this.data.DataPaging;
        }
        else {
            return null;
        }
    };
    return BaseControlPagingDefinition;
}(BaseControlDefinition_1.BaseControlDefinition));
exports.BaseControlPagingDefinition = BaseControlPagingDefinition;
;
