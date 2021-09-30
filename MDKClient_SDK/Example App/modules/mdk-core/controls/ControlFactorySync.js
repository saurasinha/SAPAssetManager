"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControlDefinition_1 = require("../definitions/controls/BaseControlDefinition");
var IControlData_1 = require("./IControlData");
var ToolbarItem_1 = require("./ToolbarItem");
var IDataService_1 = require("../data/IDataService");
var FormCellContainer_1 = require("./FormCellContainer");
var BaseFormCell_1 = require("./formCell/BaseFormCell");
var DurationPickerFormCell_1 = require("./formCell/DurationPickerFormCell");
var AttachmentFormCell_1 = require("./formCell/AttachmentFormCell");
var FilterFormCell_1 = require("./formCell/FilterFormCell");
var SorterFormCell_1 = require("./formCell/SorterFormCell");
var ListPickerFormCell_1 = require("./formCell/ListPickerFormCell");
var SectionedTable_1 = require("./SectionedTable");
var ExtensionBuilder_1 = require("../builders/ui/ExtensionBuilder");
var SegmentedControlFormCell_1 = require("./formCell/SegmentedControlFormCell");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ExtensionFormCell_1 = require("./formCell/ExtensionFormCell");
var ListPickerFragmentContainer_1 = require("./ListPickerFragmentContainer");
var BottomNavigationContainer_1 = require("./BottomNavigationContainer");
var TabItem_1 = require("./TabItem");
var TabsContainer_1 = require("./TabsContainer");
var SideDrawer_1 = require("./SideDrawer");
var SignatureCaptureFragmentContainer_1 = require("./SignatureCaptureFragmentContainer");
var SignatureCaptureFormCell_1 = require("./formCell/SignatureCaptureFormCell");
var FlexibleColumnLayout_1 = require("./FlexibleColumnLayout");
var ControlFactorySync = (function () {
    function ControlFactorySync() {
    }
    ControlFactorySync.Create = function (page, context, container, definition) {
        var controlData = IControlData_1.asControlData(page, context, container, definition);
        var control;
        switch (definition.getType()) {
            case BaseControlDefinition_1.BaseControlDefinition.type.SectionedTable:
                control = new SectionedTable_1.SectionedTable();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.Extension:
                try {
                    controlData.dataService = IDataService_1.IDataService.instance();
                    var extensionProps = Object.assign({}, controlData);
                    extensionProps.definition = definition;
                    extensionProps.page = page;
                    control = new ExtensionBuilder_1.ExtensionBuilder().build(definition, page.context.binding, extensionProps);
                    return control;
                }
                catch (error) {
                    return ExtensionBuilder_1.ExtensionBuilder.createFallbackExtension(error, {}, false);
                }
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellContainer:
                control = new FormCellContainer_1.FormCellContainer();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellListPicker:
                control = new ListPickerFormCell_1.ListPickerFormCell();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellAttachment:
                control = new AttachmentFormCell_1.AttachmentFormCell();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSegmentedControl:
                control = new SegmentedControlFormCell_1.SegmentedControlFormCell();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellFilter:
                control = new FilterFormCell_1.FilterFormCell();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSorter:
                control = new SorterFormCell_1.SorterFormCell();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellDurationPicker:
                control = new DurationPickerFormCell_1.DurationPickerFormCell();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSimpleProperty:
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellNote:
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellButton:
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellDatePicker:
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSwitch:
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellTitle:
                control = new BaseFormCell_1.BaseFormCell();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellSignatureCapture:
                control = new SignatureCaptureFormCell_1.SignatureCaptureFormCell();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.FormCellExtension:
                control = new ExtensionFormCell_1.ExtensionFormCell();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.ToolbarItem:
                control = new ToolbarItem_1.ToolbarItem();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.BottomNavigation:
                control = new BottomNavigationContainer_1.BottomNavigationContainer();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.Tabs:
                control = new TabsContainer_1.TabsContainer();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.TabItem:
                control = new TabItem_1.TabItem();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.ListPickerFragmentContainer:
                control = new ListPickerFragmentContainer_1.ListPickerFragmentContainer();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.SideDrawer:
                control = new SideDrawer_1.SideDrawer();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.SignatureCaptureFragmentContainer:
                control = new SignatureCaptureFragmentContainer_1.SignatureCaptureFragmentContainer();
                break;
            case BaseControlDefinition_1.BaseControlDefinition.type.FlexibleColumnLayout:
                control = new FlexibleColumnLayout_1.FlexibleColumnLayout();
                break;
            default:
                throw new Error(ErrorMessage_1.ErrorMessage.UNKNOWN_CONTROL_TYPE);
        }
        control.initialize(controlData);
        return control;
    };
    return ControlFactorySync;
}());
exports.ControlFactorySync = ControlFactorySync;
