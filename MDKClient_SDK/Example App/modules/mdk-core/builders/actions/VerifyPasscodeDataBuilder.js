"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var VerifyPasscodeDataBuilder = (function (_super) {
    __extends(VerifyPasscodeDataBuilder, _super);
    function VerifyPasscodeDataBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VerifyPasscodeDataBuilder.prototype.setAllowCancel = function (allowCancel) {
        this.data.AllowCancel = allowCancel;
        return this;
    };
    return VerifyPasscodeDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.VerifyPasscodeDataBuilder = VerifyPasscodeDataBuilder;
