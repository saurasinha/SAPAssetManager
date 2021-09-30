"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var Context_1 = require("../../context/Context");
var IMDKPage_1 = require("../../pages/IMDKPage");
var IControl_1 = require("../../controls/IControl");
var frameModule = require("tns-core-modules/ui/frame");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var ModalFrame_1 = require("../../pages/ModalFrame");
var TabFrame_1 = require("../../pages/TabFrame");
var MDKPage_1 = require("../../pages/MDKPage");
var tabs_1 = require("tns-core-modules/ui/tabs");
var FlexibleColumnFrame_1 = require("../../pages/FlexibleColumnFrame");
var FlexibleColumnLayout_1 = require("../../controls/FlexibleColumnLayout");
var PageSegment = (function (_super) {
    __extends(PageSegment, _super);
    function PageSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PageSegment.prototype.resolve = function () {
        var pageName = this.specifier;
        var page = null;
        if (pageName === '-Previous') {
            page = this.findPreviousPage();
        }
        else {
            page = this.findPageByName(pageName);
        }
        return page.context;
    };
    PageSegment.prototype.findPageByName = function (pageName) {
        var pageFromContext = this.pageFromContext();
        if (this.isTargetPage(pageFromContext, pageName)) {
            return pageFromContext;
        }
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        var currentPage = topFrame ? topFrame.currentPage : null;
        if (this.isTargetPage(currentPage, pageName)) {
            return currentPage;
        }
        var backStack = topFrame.backStack;
        for (var _i = 0, backStack_1 = backStack; _i < backStack_1.length; _i++) {
            var entry = backStack_1[_i];
            if (this.isTargetPage(entry.resolvedPage, pageName)) {
                return entry.resolvedPage;
            }
        }
        var targetPage;
        if (ModalFrame_1.ModalFrame.isModal(topFrame)) {
            var parentPage = topFrame.parentPage;
            if (this.isTargetPage(parentPage, pageName)) {
                return parentPage;
            }
            var parentBackStack = parentPage.frame.backStack;
            for (var _a = 0, parentBackStack_1 = parentBackStack; _a < parentBackStack_1.length; _a++) {
                var entry = parentBackStack_1[_a];
                if (this.isTargetPage(entry.resolvedPage, pageName)) {
                    return entry.resolvedPage;
                }
            }
            targetPage = this.findPageFromTabParent(parentPage.frame, pageName);
            if (targetPage) {
                return targetPage;
            }
        }
        targetPage = this.findPageFromTabParent(topFrame, pageName);
        if (targetPage) {
            return targetPage;
        }
        targetPage = this.findPageFromFrameStack(pageName);
        if (targetPage) {
            return targetPage;
        }
        throw new Error("Failed to find page with name " + pageName);
    };
    PageSegment.prototype.isTargetPage = function (page, pageName) {
        var wrapper = page;
        return IMDKPage_1.isMDKPage(wrapper) && wrapper.definition.getName() === pageName;
    };
    PageSegment.prototype.findPageFromFrameStack = function (pageName) {
        var frameStack = frameModule.Frame._stack();
        for (var i = 0; i < frameStack.length; i++) {
            var frame = frameStack[i];
            var currentPage = frame ? frame.currentPage : null;
            if (this.isTargetPage(currentPage, pageName)) {
                return currentPage;
            }
            var backStack = frame.backStack;
            for (var _i = 0, backStack_2 = backStack; _i < backStack_2.length; _i++) {
                var entry = backStack_2[_i];
                if (this.isTargetPage(entry.resolvedPage, pageName)) {
                    return entry.resolvedPage;
                }
            }
        }
        return null;
    };
    PageSegment.prototype.findPageFromTabParent = function (frame, pageName) {
        if (TabFrame_1.TabFrame.isTab(frame)) {
            var parentPage = frame.parentPage;
            if (this.isTargetPage(parentPage, pageName)) {
                return parentPage;
            }
            var parentBackStack = parentPage.frame.backStack;
            for (var _i = 0, parentBackStack_2 = parentBackStack; _i < parentBackStack_2.length; _i++) {
                var entry = parentBackStack_2[_i];
                if (this.isTargetPage(entry.resolvedPage, pageName)) {
                    return entry.resolvedPage;
                }
            }
            if (TabFrame_1.TabFrame.isChildTabs(parentPage.frame)) {
                var page = this.findPageWithinTabs(parentPage.frame, pageName);
                if (page) {
                    return page;
                }
            }
        }
        if (TabFrame_1.TabFrame.isChildTabs(frame)) {
            var page = this.findPageWithinTabs(frame, pageName);
            if (page) {
                return page;
            }
        }
        return null;
    };
    PageSegment.prototype.findPageWithinTabs = function (frame, pageName) {
        if (frame) {
            var tabs = TabFrame_1.TabFrame.getTabs(frame.currentPage);
            if (tabs instanceof tabs_1.Tabs) {
                var tabPageFound = null;
                var tabPage = void 0;
                for (var _i = 0, _a = tabs.items; _i < _a.length; _i++) {
                    var tabItemEach = _a[_i];
                    tabPage = TabFrame_1.TabFrame.getTabPageFromTabItem(tabItemEach);
                    if (tabPage && this.isTargetPage(tabPage, pageName)) {
                        tabPageFound = tabPage;
                        break;
                    }
                }
                return tabPageFound;
            }
        }
        return null;
    };
    PageSegment.prototype.pageFromContext = function () {
        if (this.context.element instanceof IControl_1.IControl) {
            var control = this.context.element;
            return control.page();
        }
        else if (IMDKPage_1.isMDKPage(this.context.element)) {
            return this.context.element;
        }
        else {
            return Context_1.Context.fromPage().element;
        }
    };
    PageSegment.prototype.findPreviousPage = function () {
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        var backStack = topFrame.backStack;
        var pageFromContext = this.pageFromContext();
        var previousPage = null;
        try {
            var contextPage = pageFromContext;
            if (contextPage.pageTag === FlexibleColumnLayout_1.FlexibleColumnLayout.LAYOUTTYPE_TAG ||
                FlexibleColumnFrame_1.FlexibleColumnFrame.isFlexibleColumnFrame(contextPage.targetFrameId)) {
                var contextFrame = frameModule.Frame.getFrameById(contextPage.targetFrameId);
                if (contextFrame && contextFrame.backStack.length > 0 && contextFrame.backStack[0] !== pageFromContext) {
                    previousPage = contextFrame.backStack[contextFrame.backStack.length - 1].resolvedPage;
                }
                else {
                    previousPage = pageFromContext;
                }
            }
            else if (ModalFrame_1.ModalFrame.isModal(topFrame) &&
                (backStack.length === 0 || pageFromContext === backStack[0].resolvedPage)) {
                previousPage = topFrame.parentPage;
            }
            else if (pageFromContext === topFrame.currentPage) {
                previousPage = backStack[backStack.length - 1].resolvedPage;
            }
            else {
                var indexOfContext = backStack.findIndex(function (entry) {
                    return entry.resolvedPage === pageFromContext;
                }, this);
                if (indexOfContext === -1) {
                    if (pageFromContext !== topFrame.currentPage && pageFromContext instanceof MDKPage_1.MDKPage && pageFromContext.frame && pageFromContext.frame !== topFrame) {
                        var parentBackStack = pageFromContext.frame ? pageFromContext.frame.backStack : [];
                        previousPage = pageFromContext;
                        if (parentBackStack.length > 0 && pageFromContext !== parentBackStack[0].resolvedPage) {
                            var indexOfContextOfParentFrame = parentBackStack.findIndex(function (entry) {
                                return entry.resolvedPage === pageFromContext;
                            }, this);
                            if (indexOfContextOfParentFrame > 0) {
                                previousPage = parentBackStack[indexOfContextOfParentFrame - 1].resolvedPage;
                            }
                        }
                    }
                    else {
                        previousPage = topFrame.currentPage;
                    }
                }
                else {
                    previousPage = backStack[indexOfContext - 1].resolvedPage;
                }
            }
        }
        catch (e) {
            throw new Error(ErrorMessage_1.ErrorMessage.FAILED_GET_PREVIOUS_PAGE);
        }
        if (!IMDKPage_1.isMDKPage(previousPage)) {
            throw new Error(ErrorMessage_1.ErrorMessage.PREVIOUS_PAGE_NOT_PAGEWRAPPER_OBJECT);
        }
        return previousPage;
    };
    return PageSegment;
}(ISegment_1.ISegment));
exports.PageSegment = PageSegment;
