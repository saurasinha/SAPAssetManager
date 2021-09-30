"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var ProgressBannerActionDefinition = (function (_super) {
    __extends(ProgressBannerActionDefinition, _super);
    function ProgressBannerActionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ProgressBannerActionDefinition.prototype, "message", {
        get: function () {
            return this.data.Message || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBannerActionDefinition.prototype, "completionMessage", {
        get: function () {
            return this.data.CompletionMessage || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBannerActionDefinition.prototype, "completionTimeout", {
        get: function () {
            return this.data.CompletionTimeout || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBannerActionDefinition.prototype, "animated", {
        get: function () {
            if (this.data.hasOwnProperty('Animated')) {
                return !!this.data.Animated;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBannerActionDefinition.prototype, "actionLabel", {
        get: function () {
            return this.data.ActionLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBannerActionDefinition.prototype, "onActionLabelPress", {
        get: function () {
            return this.data.OnActionLabelPress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBannerActionDefinition.prototype, "completionActionLabel", {
        get: function () {
            return this.data.CompletionActionLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBannerActionDefinition.prototype, "onCompletionActionLabelPress", {
        get: function () {
            return this.data.OnCompletionActionLabelPress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBannerActionDefinition.prototype, "dismissBannerOnAction", {
        get: function () {
            if (this.data.hasOwnProperty('DismissBannerOnAction')) {
                return !!this.data.DismissBannerOnAction;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return ProgressBannerActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.ProgressBannerActionDefinition = ProgressBannerActionDefinition;
;
