"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var BannerMessageActionDefinition = (function (_super) {
    __extends(BannerMessageActionDefinition, _super);
    function BannerMessageActionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BannerMessageActionDefinition.prototype, "Message", {
        get: function () {
            return this.data.Message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerMessageActionDefinition.prototype, "Duration", {
        get: function () {
            return this.data.Duration === undefined ? 2 : this.data.Duration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerMessageActionDefinition.prototype, "Animated", {
        get: function () {
            if (this.data.hasOwnProperty('Animated')) {
                return !!this.data.Animated;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerMessageActionDefinition.prototype, "ActionLabel", {
        get: function () {
            return this.data.ActionLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerMessageActionDefinition.prototype, "OnActionLabelPress", {
        get: function () {
            return this.data.OnActionLabelPress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerMessageActionDefinition.prototype, "DismissBannerOnAction", {
        get: function () {
            if (this.data.hasOwnProperty('DismissBannerOnAction')) {
                return !!this.data.DismissBannerOnAction;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return BannerMessageActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.BannerMessageActionDefinition = BannerMessageActionDefinition;
;
