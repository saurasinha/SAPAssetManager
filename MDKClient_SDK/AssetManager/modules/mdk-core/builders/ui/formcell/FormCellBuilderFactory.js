"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("../../../definitions/controls/BaseControlDefinition");
var FormCellDataBuilder_1 = require("./FormCellDataBuilder");
var AttachmentDataBuilder_1 = require("./AttachmentDataBuilder");
var DurationDataBuilder_1 = require("./DurationDataBuilder");
var FilterDataBuilder_1 = require("./FilterDataBuilder");
var ListPickerDataBuilder_1 = require("./ListPickerDataBuilder");
var SegmentedDataBuilder_1 = require("./SegmentedDataBuilder");
var SorterDataBuilder_1 = require("./SorterDataBuilder");
var ExtensionFormCellDataBuilder_1 = require("./ExtensionFormCellDataBuilder");
var FormCellBuilderFactory = (function () {
    function FormCellBuilderFactory() {
    }
    FormCellBuilderFactory.Create = function (context, definition) {
        switch (definition.type) {
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellButton:
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellDatePicker:
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellNote:
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSimpleProperty:
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSwitch:
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellTitle:
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSignatureCapture:
                return new FormCellDataBuilder_1.FormCellDataBuilder(context, definition);
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellAttachment:
                return new AttachmentDataBuilder_1.AttachmentDataBuilder(context, definition);
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellDurationPicker:
                return new DurationDataBuilder_1.DurationDataBuilder(context, definition);
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellFilter:
                return new FilterDataBuilder_1.FilterDataBuilder(context, definition);
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellListPicker:
                return new ListPickerDataBuilder_1.ListPickerDataBuilder(context, definition);
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSegmentedControl:
                return new SegmentedDataBuilder_1.SegmentedDataBuilder(context, definition);
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSorter:
                return new SorterDataBuilder_1.SorterDataBuilder(context, definition);
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellExtension:
                return new ExtensionFormCellDataBuilder_1.ExtensionFormCellDataBuilder(context, definition);
            default:
                return undefined;
        }
    };
    return FormCellBuilderFactory;
}());
exports.FormCellBuilderFactory = FormCellBuilderFactory;
