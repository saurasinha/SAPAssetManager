"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellDataBuilder_1 = require("./FormCellDataBuilder");
var BaseControlDefinition_1 = require("../../../definitions/controls/BaseControlDefinition");
var TitleDataBuilder = (function (_super) {
    __extends(TitleDataBuilder, _super);
    function TitleDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this.data._Type = BaseControlDefinition_1.BaseControlDefinition.type.FormCellTitle;
        return _this;
    }
    TitleDataBuilder.prototype.setPlaceHolder = function (placeHolder) {
        this.builtData.PlaceHolder = placeHolder;
        return this;
    };
    return TitleDataBuilder;
}(FormCellDataBuilder_1.FormCellDataBuilder));
exports.TitleDataBuilder = TitleDataBuilder;
