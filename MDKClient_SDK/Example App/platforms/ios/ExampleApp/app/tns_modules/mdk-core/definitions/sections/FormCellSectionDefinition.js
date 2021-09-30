"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionDefinition_1 = require("./BaseSectionDefinition");
var BaseControlDefinition_1 = require("../controls/BaseControlDefinition");
var BaseControlPagingDefinition_1 = require("../controls/BaseControlPagingDefinition");
var NoteFormCellDefinition_1 = require("../controls/NoteFormCellDefinition");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var ExtensionFormCellDefinition_1 = require("../controls/ExtensionFormCellDefinition");
var FormCellSectionDefinition = (function (_super) {
    __extends(FormCellSectionDefinition, _super);
    function FormCellSectionDefinition(path, data, parent) {
        var _this = _super.call(this, path, data, parent) || this;
        _this._controlDefs = [];
        _this._sectionInfo = { Visible: '', Caption: '', NumberOfRows: '' };
        _this._sectionInfo.Visible = data.Visible === undefined ? true : data.Visible;
        _this._sectionInfo.Caption = data.Caption ? data.Caption : '';
        _this._sectionInfo.NumberOfRows = data.Controls.length;
        _this._loadControlDef();
        return _this;
    }
    Object.defineProperty(FormCellSectionDefinition.prototype, "Controls", {
        get: function () {
            return this.data.Controls;
        },
        enumerable: true,
        configurable: true
    });
    FormCellSectionDefinition.prototype.getControlDefs = function () {
        return this._controlDefs;
    };
    FormCellSectionDefinition.prototype.getSectionInfo = function () {
        return this._sectionInfo;
    };
    FormCellSectionDefinition.prototype._loadControlDef = function () {
        for (var _i = 0, _a = this.data.Controls; _i < _a.length; _i++) {
            var controlData = _a[_i];
            switch (controlData._Type) {
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellDurationPicker:
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellDatePicker:
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellNote:
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSimpleProperty:
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSwitch:
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellTitle:
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSegmentedControl:
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellFilter:
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSorter:
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellAttachment:
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellButton:
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSignatureCapture:
                    this._controlDefs.push(new BaseControlDefinition_1.BaseControlDefinition('', controlData, this));
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellListPicker:
                    this._controlDefs.push(new BaseControlPagingDefinition_1.BaseControlPagingDefinition('', controlData, this));
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellNote:
                    this._controlDefs.push(new NoteFormCellDefinition_1.NoteFormCellDefinition('', controlData, this));
                    break;
                case BaseControlDefinition_1.BaseControlDefinition.type.FormCellExtension:
                    this._controlDefs.push(new ExtensionFormCellDefinition_1.ExtensionFormCellDefinition('', controlData, this));
                    break;
                default:
                    var sMessage = ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_CALL_FORMCELLCONTAINERDEFINITION_AS_INVALID_TYPE, controlData._Type);
                    throw new Error(sMessage);
            }
        }
    };
    return FormCellSectionDefinition;
}(BaseSectionDefinition_1.BaseSectionDefinition));
exports.FormCellSectionDefinition = FormCellSectionDefinition;
;
