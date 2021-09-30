"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionPagingDefinition_1 = require("./BaseSectionPagingDefinition");
var ContactCellSectionDefinition = (function (_super) {
    __extends(ContactCellSectionDefinition, _super);
    function ContactCellSectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ContactCellSectionDefinition.prototype, "ContactCell", {
        get: function () {
            return this.data.ContactCell;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContactCellSectionDefinition.prototype, "ContactCells", {
        get: function () {
            return this.data.ContactCells || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContactCellSectionDefinition.prototype, "usePreviewMode", {
        get: function () {
            return this.data.MaxItemCount !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContactCellSectionDefinition.prototype, "onPress", {
        get: function () {
            return this.data.ContactCell.OnPress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContactCellSectionDefinition.prototype, "search", {
        get: function () {
            return this.data.Search || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContactCellSectionDefinition.prototype, "searchEnabled", {
        get: function () {
            if (this.data.Search !== undefined) {
                return this.data.Search.Enabled;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContactCellSectionDefinition.prototype, "searchPlaceholder", {
        get: function () {
            if (this.data.Search !== undefined) {
                return this.data.Search.Placeholder;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContactCellSectionDefinition.prototype, "searchBarcodeScanEnabled", {
        get: function () {
            if (this.data.Search !== undefined) {
                return this.data.Search.BarcodeScanner;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContactCellSectionDefinition.prototype, "contextMenu", {
        get: function () {
            return this.data.ContactCell && this.data.ContactCell.ContextMenu;
        },
        enumerable: true,
        configurable: true
    });
    return ContactCellSectionDefinition;
}(BaseSectionPagingDefinition_1.BaseSectionPagingDefinition));
exports.ContactCellSectionDefinition = ContactCellSectionDefinition;
;
