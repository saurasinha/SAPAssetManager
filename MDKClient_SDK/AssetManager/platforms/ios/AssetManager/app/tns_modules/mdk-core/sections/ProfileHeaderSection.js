"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProfileHeaderSectionObservable_1 = require("../observables/sections/ProfileHeaderSectionObservable");
var HeaderSection_1 = require("./HeaderSection");
var ProfileHeaderSection = (function (_super) {
    __extends(ProfileHeaderSection, _super);
    function ProfileHeaderSection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProfileHeaderSection.prototype.updateProgressBar = function (visible) {
        this._sectionBridge.updateProgressBar(visible);
    };
    ProfileHeaderSection.prototype._createObservable = function () {
        return new ProfileHeaderSectionObservable_1.ProfileHeaderSectionObservable(this);
    };
    return ProfileHeaderSection;
}(HeaderSection_1.HeaderSection));
exports.ProfileHeaderSection = ProfileHeaderSection;
;
