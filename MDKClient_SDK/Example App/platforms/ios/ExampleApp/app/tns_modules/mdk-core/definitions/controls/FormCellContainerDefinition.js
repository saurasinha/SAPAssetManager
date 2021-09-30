"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("./BaseControlDefinition");
var BaseContainerDefinition_1 = require("./BaseContainerDefinition");
var NoteFormCellDefinition_1 = require("./NoteFormCellDefinition");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var ExtensionFormCellDefinition_1 = require("./ExtensionFormCellDefinition");
var FormCellContainerDefinition = (function (_super) {
    __extends(FormCellContainerDefinition, _super);
    function FormCellContainerDefinition(path, data, parent) {
        var _this = _super.call(this, path, data, parent) || this;
        _this._controlDefs = [];
        _this._visibleSections = [];
        _this._sectionCount = data.Sections.length;
        _this._sectionsInformation = [];
        for (var _i = 0, _a = data.Sections; _i < _a.length; _i++) {
            var sec = _a[_i];
            var sectionInfo = { Visible: '', Caption: '', NumberOfRows: '' };
            sectionInfo.Visible = sec.Visible === undefined ? true : sec.Visible;
            sectionInfo.Caption = sec.Caption ? sec.Caption : '';
            sectionInfo.NumberOfRows = sec.Controls.length;
            _this._sectionsInformation.push(sectionInfo);
        }
        _this._loadControlDef();
        return _this;
    }
    Object.defineProperty(FormCellContainerDefinition.prototype, "sections", {
        get: function () {
            return this.data.Sections;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormCellContainerDefinition.prototype, "sectionCount", {
        get: function () {
            return this._sectionCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormCellContainerDefinition.prototype, "sectionNames", {
        get: function () {
            var sectionNames = [];
            for (var _i = 0, _a = this._sectionsInformation; _i < _a.length; _i++) {
                var sectionInfo = _a[_i];
                sectionNames.push(sectionInfo.Caption);
            }
            return sectionNames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormCellContainerDefinition.prototype, "visibleSectionsIndex", {
        set: function (indexes) {
            this._visibleSections = indexes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormCellContainerDefinition.prototype, "numberOfRowsInSection", {
        get: function () {
            var numberOfRowsInSection = [];
            for (var _i = 0, _a = this._sectionsInformation; _i < _a.length; _i++) {
                var sectionInfo = _a[_i];
                numberOfRowsInSection.push(sectionInfo.NumberOfRows);
            }
            return numberOfRowsInSection;
        },
        enumerable: true,
        configurable: true
    });
    FormCellContainerDefinition.prototype.getVisibleControlDefs = function () {
        var secControlsDef = [];
        var index = 0;
        var count = 0;
        var sectionNo = -1;
        for (var _i = 0, _a = this._sectionsInformation; _i < _a.length; _i++) {
            var sectionInfo = _a[_i];
            sectionNo++;
            var noOfRows = sectionInfo.NumberOfRows;
            count += noOfRows;
            if (this._visibleSections[sectionNo]) {
                for (var j = index; j < count; j++) {
                    secControlsDef.push(this._controlDefs[j]);
                }
            }
            index += noOfRows;
        }
        return secControlsDef;
    };
    FormCellContainerDefinition.prototype.getSectionsInformation = function () {
        return this._sectionsInformation;
    };
    FormCellContainerDefinition.prototype.getControlDefs = function () {
        return this._controlDefs;
    };
    FormCellContainerDefinition.prototype.indexPath = function (name) {
        var row = -1;
        var section = -1;
        for (var _i = 0, _a = this.data.Sections; _i < _a.length; _i++) {
            var sectionDefinition = _a[_i];
            section++;
            if (this._visibleSections.length >= 0 && !this._visibleSections[section]) {
                section--;
                continue;
            }
            row = sectionDefinition.Controls.findIndex(function (cell) {
                return cell._Name === name;
            });
            if (row !== -1) {
                return { row: row, section: section };
            }
        }
        row = section = -1;
        return { row: row, section: section };
    };
    FormCellContainerDefinition.prototype._loadControlDef = function () {
        for (var _i = 0, _a = this.data.Sections; _i < _a.length; _i++) {
            var section_1 = _a[_i];
            for (var _b = 0, _c = section_1.Controls; _b < _c.length; _b++) {
                var controlData = _c[_b];
                switch (controlData._Type) {
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellDurationPicker:
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellDatePicker:
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellNote:
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSimpleProperty:
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSwitch:
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellTitle:
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSegmentedControl:
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellListPicker:
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellFilter:
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSorter:
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellAttachment:
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellButton:
                    case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSignatureCapture:
                        this._controlDefs.push(new BaseControlDefinition_1.BaseControlDefinition('', controlData, this));
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
        }
    };
    return FormCellContainerDefinition;
}(BaseContainerDefinition_1.BaseContainerDefinition));
exports.FormCellContainerDefinition = FormCellContainerDefinition;
;
