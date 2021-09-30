"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("../BaseJSONDefinition");
var BaseSectionDefinition = (function (_super) {
    __extends(BaseSectionDefinition, _super);
    function BaseSectionDefinition(path, data, parent) {
        var _this = _super.call(this, path, data) || this;
        _this.parent = parent;
        return _this;
    }
    Object.defineProperty(BaseSectionDefinition.prototype, "emptySectionCaption", {
        get: function () {
            return (this.data.EmptySection ? this.data.EmptySection.Caption : '') || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "emptySectionHidesFooter", {
        get: function () {
            if (!this.data.EmptySection
                || this.data.EmptySection.HidesFooter === undefined) {
                return { IsPropertyDefined: false, Visible: true };
            }
            return { IsPropertyDefined: true, Visible: this.data.EmptySection.HidesFooter };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "emptySectionFooterVisible", {
        get: function () {
            if (!this.data.EmptySection
                || this.data.EmptySection.FooterVisible === undefined) {
                return { IsPropertyDefined: false, Visible: false };
            }
            return { IsPropertyDefined: true, Visible: this.data.EmptySection.FooterVisible };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "footerVisible", {
        get: function () {
            return this.data.Footer ? (this.data.Footer.Visible === undefined ? true : this.data.Footer.Visible) : true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "emptySectionStyle", {
        get: function () {
            return this.data.EmptySection ? this.data.EmptySection.Style : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "footerAccessoryType", {
        get: function () {
            return this.data.Footer ? this.data.Footer.AccessoryType : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "footerAttributeLabel", {
        get: function () {
            return this.data.Footer ? this.data.Footer.AttributeLabel : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "footerCaption", {
        get: function () {
            return this.data.Footer ? this.data.Footer.Caption : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "footerStyle", {
        get: function () {
            return this.data.Footer ? this.data.Footer.FooterStyle : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "onFooterPress", {
        get: function () {
            if (this.data.Footer) {
                return this.data.Footer.OnPressAction || this.data.Footer.OnPress;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "headerCaption", {
        get: function () {
            return this.data.Header ? this.data.Header.Caption : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "maxItemCount", {
        get: function () {
            return this.data.MaxItemCount ? this.data.MaxItemCount : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "name", {
        get: function () {
            return this.data._Name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "sectionTable", {
        get: function () {
            return this.parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "target", {
        get: function () {
            return this.data.Target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "dataSubscriptions", {
        get: function () {
            return this.data.DataSubscriptions || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "type", {
        get: function () {
            return this.data._Type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "usesAttributeLabel", {
        get: function () {
            return this.data.Footer.AttributeLabel !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "usesHeader", {
        get: function () {
            if (this.data.Header === undefined) {
                return false;
            }
            if (Object.keys(this.data.Header).length === 0) {
                return false;
            }
            if (Object.keys(this.data.Header).length === 1 && this.data.Header.hasOwnProperty('UseTopPadding')) {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "useHeaderTopPadding", {
        get: function () {
            if (this.data.Header && this.data.Header.hasOwnProperty('UseTopPadding')) {
                return this.data.Header.UseTopPadding;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "useFooterBottomPadding", {
        get: function () {
            if (this.data.Footer && this.data.Footer.hasOwnProperty('UseBottomPadding')) {
                return this.data.Footer.UseBottomPadding;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "visible", {
        get: function () {
            if (this.data.Visible === undefined) {
                return true;
            }
            return this.data.Visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSectionDefinition.prototype, "sectionIndex", {
        get: function () {
            var sectionIndex;
            if (this.sectionTable) {
                var sections = this.sectionTable.getVisibleSections();
                for (var index_1 = 0; index_1 < sections.length; index_1++) {
                    if (this === sections[index_1]) {
                        sectionIndex = index_1 + 1;
                        break;
                    }
                }
            }
            return sectionIndex;
        },
        enumerable: true,
        configurable: true
    });
    BaseSectionDefinition.type = {
        AnalyticCardCollection: 'Section.Type.AnalyticCardCollection',
        ButtonSection: 'Section.Type.ButtonTable',
        ChartContent: 'Section.Type.ChartContent',
        ContactCell: 'Section.Type.ContactCell',
        Extension: 'Section.Type.Extension',
        GridTable: 'Section.Type.GridTable',
        ImageCollection: 'Section.Type.ImageCollection',
        KPIHeader: 'Section.Type.KPIHeader',
        KeyValue: 'Section.Type.KeyValue',
        ObjectCollection: 'Section.Type.ObjectCollection',
        ObjectHeader: 'Section.Type.ObjectHeader',
        ObjectTable: 'Section.Type.ObjectTable',
        ProfileHeader: 'Section.Type.ProfileHeader',
        SimplePropertyCollection: 'Section.Type.SimplePropertyCollection',
        FormCellSection: 'Section.Type.FormCell',
        KPISection: 'Section.Type.KPISection',
    };
    return BaseSectionDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.BaseSectionDefinition = BaseSectionDefinition;
;
