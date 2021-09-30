"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../../BaseDataBuilder");
var BaseFormCellDataBuilder = (function (_super) {
    __extends(BaseFormCellDataBuilder, _super);
    function BaseFormCellDataBuilder(context, definition) {
        var _this = _super.call(this, context) || this;
        _this._defintion = definition;
        return _this;
    }
    Object.defineProperty(BaseFormCellDataBuilder.prototype, "definition", {
        get: function () {
            return this._defintion;
        },
        enumerable: true,
        configurable: true
    });
    return BaseFormCellDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.BaseFormCellDataBuilder = BaseFormCellDataBuilder;
