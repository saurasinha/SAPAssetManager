"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var frameModule = require("tns-core-modules/ui/frame");
var IMDKPage_1 = require("../../pages/IMDKPage");
var I18nHelper_1 = require("../../utils/I18nHelper");
var TabFrame_1 = require("../../pages/TabFrame");
var BannerDataBuilder = (function (_super) {
    __extends(BannerDataBuilder, _super);
    function BannerDataBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {
            topFrame: true,
            onActionLabelPress: true,
            onCompletionActionLabelPress: true
        };
        return _this;
    }
    BannerDataBuilder.prototype.build = function () {
        var _this = this;
        return _super.prototype.build.call(this).then(function (data) {
            data.CloseButtonCaption = I18nHelper_1.I18nHelper.localizeMDKText('dismiss');
            return _this._getToolbarHeight().then(function (height) {
                _this.setBottomOffset(height);
                data.bottomOffset = height;
                var view = TabFrame_1.TabFrame.getBannerAnchorLayout(data.topFrame);
                if (view) {
                    data.view = view;
                }
                return data;
            });
        });
    };
    BannerDataBuilder.prototype.buildError = function (message, topFrame, type) {
        var error = {
            message: message,
            topFrame: topFrame,
            type: type,
        };
        return error;
    };
    BannerDataBuilder.prototype.setAnimated = function (animated) {
        this.data.animated = animated;
        return this;
    };
    BannerDataBuilder.prototype.setBottomOffset = function (offset) {
        this.data.bottomOffset = offset;
        return this;
    };
    BannerDataBuilder.prototype.setDuration = function (duration) {
        this.data.duration = duration;
        return this;
    };
    BannerDataBuilder.prototype.setMaxNumberOfLines = function (maxNumberOfLines) {
        this.data.maxNumberOfLines = maxNumberOfLines;
        return this;
    };
    BannerDataBuilder.prototype.setMessage = function (message) {
        this.data.message = message;
        return this;
    };
    BannerDataBuilder.prototype.setTopFrame = function (frame) {
        this.data.topFrame = frame;
        return this;
    };
    BannerDataBuilder.prototype.setType = function (type) {
        this.data.type = type;
        return this;
    };
    BannerDataBuilder.prototype.setActionLabel = function (actionLabel) {
        this.data.actionLabel = actionLabel;
        return this;
    };
    BannerDataBuilder.prototype.setOnActionLabelPress = function (onActionLabelPress) {
        this.data.onActionLabelPress = this._getPressValue(onActionLabelPress);
        return this;
    };
    BannerDataBuilder.prototype.setCompletionActionLabel = function (completionActionLabel) {
        this.data.completionActionLabel = completionActionLabel;
        return this;
    };
    BannerDataBuilder.prototype.setOnCompletionActionLabelPress = function (onCompletionActionLabelPress) {
        this.data.onCompletionActionLabelPress = this._getPressValue(onCompletionActionLabelPress);
        return this;
    };
    BannerDataBuilder.prototype.setDismissBannerOnAction = function (dismissBannerOnAction) {
        this.data.dismissBannerOnAction = dismissBannerOnAction;
        return this;
    };
    BannerDataBuilder.prototype._getPressValue = function (value) {
        if (value && value.constructor === Object) {
            return JSON.stringify(value);
        }
        return value;
    };
    BannerDataBuilder.prototype._getToolbarHeight = function () {
        var topFrame = frameModule.Frame.topmost();
        var getToolbarHeight;
        if (topFrame) {
            var wrapper = topFrame.currentPage;
            if (IMDKPage_1.isMDKPage(wrapper)) {
                getToolbarHeight = topFrame.currentPage.getToolbar().then(function (toolbar) {
                    return toolbar ? toolbar.view().getMeasuredHeight() : 0;
                });
            }
        }
        if (!getToolbarHeight) {
            getToolbarHeight = Promise.resolve(0);
        }
        return getToolbarHeight;
    };
    return BannerDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.BannerDataBuilder = BannerDataBuilder;
