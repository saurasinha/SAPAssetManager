"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("tns-core-modules/ui/frame");
var TabFrame_1 = require("./TabFrame");
var FlexibleColumnFrame_1 = require("./FlexibleColumnFrame");
var FlexibleColumnLayout_1 = require("../controls/FlexibleColumnLayout");
var ModalFrame_1 = require("./ModalFrame");
var app = require("tns-core-modules/application");
var MDKFrame = (function (_super) {
    __extends(MDKFrame, _super);
    function MDKFrame(id) {
        var _this = _super.call(this) || this;
        _this.id = id;
        return _this;
    }
    MDKFrame.getRootFrameId = function () {
        return this._rootFrameId;
    };
    MDKFrame.setRootFrameId = function (id) {
        this._rootFrameId = id;
    };
    MDKFrame.getRootFrame = function () {
        return frame_1.Frame.getFrameById(this._rootFrameId);
    };
    MDKFrame.createRootFrame = function (id) {
        this._rootFrameId = id;
        return new MDKFrame(id);
    };
    MDKFrame.getCorrectTopmostFrame = function (source, alwaysParentIfChildIsTabs, frameId, findTopmostOfFrameId) {
        if (findTopmostOfFrameId === void 0) { findTopmostOfFrameId = false; }
        var sourceFrame = null;
        if (frameId && frameId !== '') {
            sourceFrame = frame_1.Frame.getFrameById(frameId);
            if (sourceFrame) {
                if (findTopmostOfFrameId) {
                    var flexibleColumnLayoutControl = void 0;
                    if (sourceFrame instanceof FlexibleColumnFrame_1.FlexibleColumnFrame) {
                        flexibleColumnLayoutControl = sourceFrame.getParentLayoutControl();
                    }
                    else if (sourceFrame instanceof TabFrame_1.TabFrame &&
                        sourceFrame.page && sourceFrame.page.frame instanceof FlexibleColumnFrame_1.FlexibleColumnFrame && alwaysParentIfChildIsTabs) {
                        flexibleColumnLayoutControl = sourceFrame.page.frame.getParentLayoutControl();
                    }
                    else {
                        var sourcePage = sourceFrame.currentPage;
                        if (sourcePage.pageTag === FlexibleColumnLayout_1.FlexibleColumnLayout.LAYOUTTYPE_TAG) {
                            flexibleColumnLayoutControl = FlexibleColumnLayout_1.FlexibleColumnLayout.getFlexibleColumnLayoutControl(sourcePage);
                        }
                    }
                    if (flexibleColumnLayoutControl instanceof FlexibleColumnLayout_1.FlexibleColumnLayout) {
                        var targetFrame = flexibleColumnLayoutControl.getTopMostFlexibleColumnFrame();
                        if (app.ios && TabFrame_1.TabFrame.isChildTabs(targetFrame)) {
                            return TabFrame_1.TabFrame.getTabTopmostFrameByFrame(targetFrame, true);
                        }
                        else {
                            return targetFrame;
                        }
                    }
                    else if (!TabFrame_1.TabFrame.isChildBottomNavigation(sourceFrame) && !TabFrame_1.TabFrame.isChildTabs(sourceFrame) &&
                        !(sourceFrame.currentPage && sourceFrame.currentPage.modal instanceof ModalFrame_1.ModalFrame)) {
                        return sourceFrame;
                    }
                }
                else {
                    return sourceFrame;
                }
            }
        }
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame(source, alwaysParentIfChildIsTabs);
        return topFrame;
    };
    MDKFrame._rootFrameId = null;
    MDKFrame.WELCOME_FRAME_ID = "welcomePage";
    MDKFrame.PASSCODE_FRAME_ID = "passcodePage";
    MDKFrame.STARTUPPAGE_FRAME_ID = "startupPage";
    return MDKFrame;
}(frame_1.Frame));
exports.MDKFrame = MDKFrame;
