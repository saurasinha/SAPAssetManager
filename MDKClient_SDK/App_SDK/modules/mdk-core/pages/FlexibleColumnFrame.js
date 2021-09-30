"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("tns-core-modules/ui/frame");
var platform_1 = require("tns-core-modules/platform");
var FlexibleColumnLayout_1 = require("../controls/FlexibleColumnLayout");
var FlexibleColumnFrame = (function (_super) {
    __extends(FlexibleColumnFrame, _super);
    function FlexibleColumnFrame(id, page) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this._parentPage = page;
        return _this;
    }
    Object.defineProperty(FlexibleColumnFrame.prototype, "parentPage", {
        get: function () {
            return this._parentPage;
        },
        set: function (page) {
            this._parentPage = page;
        },
        enumerable: true,
        configurable: true
    });
    FlexibleColumnFrame.prototype.getParentLayoutControl = function () {
        if (this._parentLayoutControl) {
            return this._parentLayoutControl;
        }
        else {
            if (this._parentPage && this._parentPage.pageTag === FlexibleColumnLayout_1.FlexibleColumnLayout.LAYOUTTYPE_TAG) {
                this._parentLayoutControl = FlexibleColumnLayout_1.FlexibleColumnLayout.getFlexibleColumnLayoutControl(this._parentPage);
                return this._parentLayoutControl;
            }
            return null;
        }
    };
    FlexibleColumnFrame.prototype.getNextFlexibileColumnFrame = function () {
        if (this.getParentLayoutControl()) {
            return this.getParentLayoutControl().getNextFlexibileColumnFrame(this);
        }
        return null;
    };
    FlexibleColumnFrame.prototype.isTopMostFlexibleColumnFrame = function () {
        if (this.getParentLayoutControl()) {
            return this.getParentLayoutControl().isTopMostFlexibleColumnFrame(this);
        }
        return false;
    };
    FlexibleColumnFrame.prototype.getTopMostFlexibleColumnFrame = function () {
        if (this.getParentLayoutControl()) {
            return this.getParentLayoutControl().getTopMostFlexibleColumnFrame();
        }
        return null;
    };
    FlexibleColumnFrame.prototype.getAllFlexibleColumnFrames = function () {
        if (this.getParentLayoutControl()) {
            return this.getParentLayoutControl().getAllFlexibleColumnFrames();
        }
        return null;
    };
    FlexibleColumnFrame.isFlexibleColumnFrame = function (id) {
        if (id) {
            var frame = frame_1.Frame.getFrameById(id);
            if (frame && frame instanceof FlexibleColumnFrame) {
                return true;
            }
        }
        return false;
    };
    FlexibleColumnFrame.isLastFrameWithinFlexibleColumnLayout = function (frameId) {
        var frame = frame_1.Frame.getFrameById(frameId);
        if (frame.getParentLayoutControl()) {
            return frame.getParentLayoutControl().isTopMostFlexibleColumnFrame(frame);
        }
        return false;
    };
    FlexibleColumnFrame.isEndColumnWithinFlexibleColumnLayout = function (frameId) {
        if (platform_1.device.deviceType === 'Tablet') {
            var frame = frame_1.Frame.getFrameById(frameId);
            if (frame.getParentLayoutControl()) {
                return frame.getParentLayoutControl().isEndFlexibleColumnFrame(frame);
            }
        }
        return false;
    };
    FlexibleColumnFrame.COLUMN_TAG = 'FlexibleColumn';
    return FlexibleColumnFrame;
}(frame_1.Frame));
exports.FlexibleColumnFrame = FlexibleColumnFrame;
