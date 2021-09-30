"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseContainerDefinition_1 = require("./BaseContainerDefinition");
var BaseSectionDefinition_1 = require("../sections/BaseSectionDefinition");
var ExtensionSectionDefinition_1 = require("../sections/ExtensionSectionDefinition");
var KeyValueSectionDefinition_1 = require("../sections/KeyValueSectionDefinition");
var ObjectCollectionSectionDefinition_1 = require("../sections/ObjectCollectionSectionDefinition");
var SimplePropertyCollectionSectionDefinition_1 = require("../sections/SimplePropertyCollectionSectionDefinition");
var ObjectTableSectionDefinition_1 = require("../sections/ObjectTableSectionDefinition");
var ObjectHeaderSectionDefinition_1 = require("../sections/ObjectHeaderSectionDefinition");
var ProfileHeaderSectionDefinition_1 = require("../sections/ProfileHeaderSectionDefinition");
var AnalyticCardCollectionSectionDefinition_1 = require("../sections/AnalyticCardCollectionSectionDefinition");
var ChartContentSectionDefinition_1 = require("../sections/ChartContentSectionDefinition");
var ContactCellSectionDefinition_1 = require("../sections/ContactCellSectionDefinition");
var ButtonSectionDefinition_1 = require("../sections/ButtonSectionDefinition");
var GridTableSectionDefinition_1 = require("../sections/GridTableSectionDefinition");
var ImageCollectionSectionDefinition_1 = require("../sections/ImageCollectionSectionDefinition");
var Logger_1 = require("../../utils/Logger");
var KPIHeaderSectionDefinition_1 = require("../sections/KPIHeaderSectionDefinition");
var KPISectionDefinition_1 = require("../sections/KPISectionDefinition");
var FormCellSectionDefinition_1 = require("../sections/FormCellSectionDefinition");
var SectionedTableDefinition = (function (_super) {
    __extends(SectionedTableDefinition, _super);
    function SectionedTableDefinition(path, data, parent) {
        var _this = _super.call(this, path, data, parent) || this;
        _this.sections = [];
        _this.visibleSections = [];
        if (!_this.data || !_this.data.Sections) {
            return _this;
        }
        for (var _i = 0, _a = _this.data.Sections; _i < _a.length; _i++) {
            var sectionDefinition = _a[_i];
            var section_1 = undefined;
            switch (sectionDefinition._Type) {
                case BaseSectionDefinition_1.BaseSectionDefinition.type.Extension:
                    section_1 = new ExtensionSectionDefinition_1.ExtensionSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.KeyValue:
                    section_1 = new KeyValueSectionDefinition_1.KeyValueSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ObjectCollection:
                    section_1 = new ObjectCollectionSectionDefinition_1.ObjectCollectionSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ObjectTable:
                    section_1 = new ObjectTableSectionDefinition_1.ObjectTableSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ObjectHeader:
                    section_1 = new ObjectHeaderSectionDefinition_1.ObjectHeaderSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ProfileHeader:
                    section_1 = new ProfileHeaderSectionDefinition_1.ProfileHeaderSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.KPIHeader:
                    section_1 = new KPIHeaderSectionDefinition_1.KPIHeaderSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.KPISection:
                    section_1 = new KPISectionDefinition_1.KPISectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ContactCell:
                    section_1 = new ContactCellSectionDefinition_1.ContactCellSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.SimplePropertyCollection:
                    section_1 = new SimplePropertyCollectionSectionDefinition_1.SimplePropertyCollectionSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ButtonSection:
                    section_1 = new ButtonSectionDefinition_1.ButtonSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.GridTable:
                    section_1 = new GridTableSectionDefinition_1.GridTableSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ImageCollection:
                    section_1 = new ImageCollectionSectionDefinition_1.ImageCollectionSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.AnalyticCardCollection:
                    section_1 = new AnalyticCardCollectionSectionDefinition_1.AnalyticCardCollectionSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.ChartContent:
                    section_1 = new ChartContentSectionDefinition_1.ChartContentSectionDefinition('', sectionDefinition, _this);
                    break;
                case BaseSectionDefinition_1.BaseSectionDefinition.type.FormCellSection:
                    section_1 = new FormCellSectionDefinition_1.FormCellSectionDefinition('', sectionDefinition, _this);
                    break;
                default:
                    var log_1 = "SectionedTableDefinition ctor unsupported type encountered " + sectionDefinition._Type;
                    Logger_1.Logger.instance.definitionLoader.log(log_1);
                    break;
            }
            if (section_1) {
                _this.sections.push(section_1);
                if (section_1.visible) {
                    _this.visibleSections.push(section_1);
                }
            }
        }
        return _this;
    }
    SectionedTableDefinition.prototype.getSectionCount = function () {
        return this.sections.length;
    };
    SectionedTableDefinition.prototype.getSections = function () {
        return this.sections;
    };
    SectionedTableDefinition.prototype.getVisibleSectionCount = function () {
        return this.visibleSections.length;
    };
    SectionedTableDefinition.prototype.getVisibleSections = function () {
        return this.visibleSections;
    };
    SectionedTableDefinition.prototype.getOnRenderedEvent = function () {
        return this.data.OnRendered;
    };
    return SectionedTableDefinition;
}(BaseContainerDefinition_1.BaseContainerDefinition));
exports.SectionedTableDefinition = SectionedTableDefinition;
;
