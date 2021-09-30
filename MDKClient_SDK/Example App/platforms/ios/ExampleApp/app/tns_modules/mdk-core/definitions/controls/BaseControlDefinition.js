"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("../BaseJSONDefinition");
var BaseControlDefinition = (function (_super) {
    __extends(BaseControlDefinition, _super);
    function BaseControlDefinition(path, data, parent) {
        var _this = _super.call(this, path, data) || this;
        _this.parent = parent;
        return _this;
    }
    Object.defineProperty(BaseControlDefinition.prototype, "type", {
        get: function () {
            return this.data._Type;
        },
        enumerable: true,
        configurable: true
    });
    BaseControlDefinition.prototype.getPage = function () {
        return this.parent;
    };
    BaseControlDefinition.prototype.getType = function () {
        return this.type;
    };
    BaseControlDefinition.prototype.getValue = function () {
        return this.data.Value;
    };
    BaseControlDefinition.prototype.getOnValueChange = function () {
        return this.data.OnValueChange;
    };
    Object.defineProperty(BaseControlDefinition.prototype, "search", {
        get: function () {
            return this.data.Search || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseControlDefinition.prototype, "dataSubscriptions", {
        get: function () {
            return this.data.DataSubscriptions || [];
        },
        enumerable: true,
        configurable: true
    });
    BaseControlDefinition.prototype.getIsEditable = function () {
        var neverEditable = this.data._Type === BaseControlDefinition.type.FormCellAttachment ||
            this.data._Type === BaseControlDefinition.type.FormCellSimpleProperty;
        return !neverEditable && this.data.IsEditable;
    };
    BaseControlDefinition.prototype.isKeyBindable = function (key) {
        return this.unbindableKeys.indexOf(key) < 0;
    };
    Object.defineProperty(BaseControlDefinition.prototype, "unbindableKeys", {
        get: function () {
            return ['FormatRule', 'OnValueChange', 'OnPress'];
        },
        enumerable: true,
        configurable: true
    });
    BaseControlDefinition.type = {
        BottomNavigation: 'Control.Type.BottomNavigation',
        Extension: 'Control.Type.Extension',
        FormCellAttachment: 'Control.Type.FormCell.Attachment',
        FormCellButton: 'Control.Type.FormCell.Button',
        FormCellContainer: 'Control.Type.FormCellContainer',
        FormCellDatePicker: 'Control.Type.FormCell.DatePicker',
        FormCellDurationPicker: 'Control.Type.FormCell.DurationPicker',
        FormCellExtension: 'Control.Type.FormCell.Extension',
        FormCellFilter: 'Control.Type.FormCell.Filter',
        FormCellListPicker: 'Control.Type.FormCell.ListPicker',
        FormCellNote: 'Control.Type.FormCell.Note',
        FormCellSegmentedControl: 'Control.Type.FormCell.SegmentedControl',
        FormCellSignatureCapture: 'Control.Type.FormCell.SignatureCapture',
        FormCellSimpleProperty: 'Control.Type.FormCell.SimpleProperty',
        FormCellSorter: 'Control.Type.FormCell.Sorter',
        FormCellSwitch: 'Control.Type.FormCell.Switch',
        FormCellTitle: 'Control.Type.FormCell.Title',
        ListPickerFragmentContainer: 'Control.Type.ListPickerFragmentContainer',
        SectionedTable: 'Control.Type.SectionedTable',
        SignatureCaptureFragmentContainer: 'Control.Type.SignatureCaptureFragmentContainer',
        TabItem: 'Control.Type.TabItem',
        Tabs: 'Control.Type.Tabs',
        ToolbarItem: 'Control.Type.ToolbarItem',
        SideDrawer: 'Control.Type.SideDrawer',
        FlexibleColumnLayout: 'Control.Type.FlexibleColumnLayout',
    };
    return BaseControlDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.BaseControlDefinition = BaseControlDefinition;
;
