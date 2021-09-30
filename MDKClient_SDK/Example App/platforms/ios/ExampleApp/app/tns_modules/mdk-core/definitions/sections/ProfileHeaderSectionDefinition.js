"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionDefinition_1 = require("./BaseSectionDefinition");
var ProfileHeaderSectionDefinition = (function (_super) {
    __extends(ProfileHeaderSectionDefinition, _super);
    function ProfileHeaderSectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ProfileHeaderSectionDefinition.prototype, "ProfileHeader", {
        get: function () {
            return this.data.ProfileHeader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileHeaderSectionDefinition.prototype, "target", {
        get: function () {
            return this.ProfileHeader.Target;
        },
        enumerable: true,
        configurable: true
    });
    return ProfileHeaderSectionDefinition;
}(BaseSectionDefinition_1.BaseSectionDefinition));
exports.ProfileHeaderSectionDefinition = ProfileHeaderSectionDefinition;
;
