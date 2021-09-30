"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("./BaseControlDefinition");
var BaseContainerDefinition = (function (_super) {
    __extends(BaseContainerDefinition, _super);
    function BaseContainerDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseContainerDefinition.prototype.getLoadingIndicator = function () {
        if (this.data.LoadingIndicator) {
            return this.data.LoadingIndicator;
        }
        else {
            return null;
        }
    };
    return BaseContainerDefinition;
}(BaseControlDefinition_1.BaseControlDefinition));
exports.BaseContainerDefinition = BaseContainerDefinition;
;
