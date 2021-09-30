"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("./BaseControlDefinition");
var NoteFormCellDefinition = (function (_super) {
    __extends(NoteFormCellDefinition, _super);
    function NoteFormCellDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoteFormCellDefinition.prototype.getValue = function () {
        var value = this.data.Value;
        if (!value) {
            return '';
        }
        return value;
    };
    return NoteFormCellDefinition;
}(BaseControlDefinition_1.BaseControlDefinition));
exports.NoteFormCellDefinition = NoteFormCellDefinition;
