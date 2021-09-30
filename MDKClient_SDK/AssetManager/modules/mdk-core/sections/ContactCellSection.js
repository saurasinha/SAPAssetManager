"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseTableSection_1 = require("./BaseTableSection");
var ContactCellSectionObservable_1 = require("../observables/sections/ContactCellSectionObservable");
var ContactCellSection = (function (_super) {
    __extends(ContactCellSection, _super);
    function ContactCellSection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContactCellSection.prototype._createObservable = function () {
        return new ContactCellSectionObservable_1.ContactCellSectionObservable(this);
    };
    return ContactCellSection;
}(BaseTableSection_1.BaseTableSection));
exports.ContactCellSection = ContactCellSection;
