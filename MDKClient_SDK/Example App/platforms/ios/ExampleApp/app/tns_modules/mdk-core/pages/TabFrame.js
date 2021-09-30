"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("tns-core-modules/ui/frame");
var MDKPage_1 = require("./MDKPage");
var bottom_navigation_1 = require("tns-core-modules/ui/bottom-navigation");
var tabs_1 = require("tns-core-modules/ui/tabs");
var stack_layout_1 = require("tns-core-modules/ui/layouts/stack-layout");
var ExecuteSource_1 = require("../common/ExecuteSource");
var ModalFrame_1 = require("./ModalFrame");
var dock_layout_1 = require("tns-core-modules/ui/layouts/dock-layout");
var content_view_1 = require("tns-core-modules/ui/content-view");
var app = require("tns-core-modules/application");
var TabFrame = (function (_super) {
    __extends(TabFrame, _super);
    function TabFrame(_parentPage, id, _isActive) {
        if (_isActive === void 0) { _isActive = true; }
        var _this = _super.call(this) || this;
        _this._parentPage = _parentPage;
        _this._isActive = _isActive;
        _this.id = id;
        return _this;
    }
    TabFrame.isTab = function (frame) {
        return frame instanceof TabFrame;
    };
    TabFrame.isTopMostTab = function () {
        return TabFrame.isTab(frame_1.Frame.topmost());
    };
    TabFrame.isTabsTabFrame = function (frame) {
        return frame instanceof TabFrame && !frame.isActive;
    };
    TabFrame.isBottomNavigationTabFrame = function (frame) {
        return frame instanceof TabFrame && frame.isActive;
    };
    TabFrame.getParentTopmostFrame = function (frame) {
        var topFrame = frame_1.Frame.topmost();
        if (frame) {
            topFrame = frame;
        }
        var parentComponent = topFrame.parent ? topFrame.parent.parent ?
            topFrame.parent.parent.parent ? topFrame.parent.parent.parent : null : null : null;
        if (parentComponent instanceof tabs_1.Tabs) {
            parentComponent = parentComponent.parent ? parentComponent.parent.parent ?
                parentComponent.parent.parent : parentComponent.parent : parentComponent;
        }
        if (parentComponent instanceof dock_layout_1.DockLayout) {
            parentComponent = parentComponent.parent ? parentComponent.parent : parentComponent;
        }
        else if (parentComponent instanceof stack_layout_1.StackLayout) {
            if (parentComponent.parent instanceof dock_layout_1.DockLayout) {
                parentComponent = parentComponent.parent ? parentComponent.parent.parent : null;
            }
            else {
                parentComponent = parentComponent.parent ? parentComponent.parent : parentComponent;
            }
        }
        if (parentComponent instanceof MDKPage_1.MDKPage) {
            topFrame = parentComponent.frame;
        }
        return topFrame;
    };
    TabFrame.isParentBottomNavigation = function () {
        var topFrame = frame_1.Frame.topmost();
        var parent = topFrame.parent ? topFrame.parent.parent ?
            topFrame.parent.parent : null : null;
        return parent instanceof bottom_navigation_1.BottomNavigation;
    };
    TabFrame.isChildBottomNavigation = function (frame) {
        if (frame === null) {
            return false;
        }
        var currentPage = frame.currentPage;
        return currentPage && currentPage.content && currentPage.content instanceof bottom_navigation_1.BottomNavigation;
    };
    TabFrame.isChildTabs = function (frame) {
        if (frame === null) {
            return false;
        }
        var tabs = this.getTabs(frame.currentPage);
        return tabs ? true : false;
    };
    TabFrame.getTabControl = function (frame) {
        var currentPage = frame.currentPage;
        if (currentPage && currentPage.content && currentPage.content instanceof bottom_navigation_1.BottomNavigation) {
            return currentPage.content;
        }
        else {
            return this.getTabs(currentPage);
        }
    };
    TabFrame.getTabTopmostFrame = function (includeTabs) {
        return this.getTabTopmostFrameByFrame(frame_1.Frame.topmost(), includeTabs);
    };
    TabFrame.getTabTopmostFrameByFrame = function (frame, includeTabs) {
        var topFrame = frame;
        var currentPage = frame.currentPage;
        if (currentPage && currentPage.content && currentPage.content instanceof bottom_navigation_1.BottomNavigation) {
            var bottomNavSelectedIndex = currentPage.content.selectedIndex;
            if (bottomNavSelectedIndex >= 0 &&
                currentPage.content.items.length > bottomNavSelectedIndex) {
                var activeTabContentItem = currentPage.content.items[bottomNavSelectedIndex];
                if (activeTabContentItem instanceof bottom_navigation_1.TabContentItem && activeTabContentItem.content instanceof frame_1.Frame) {
                    topFrame = activeTabContentItem.content;
                }
            }
        }
        else if (includeTabs) {
            var tabs = this.getTabs(currentPage);
            if (tabs) {
                var tabsTabFrame = this.getTabsSelectedTabFrame(tabs);
                if (tabsTabFrame) {
                    topFrame = tabsTabFrame;
                }
            }
        }
        return topFrame;
    };
    TabFrame.getTabStrip = function (page) {
        if (page.content) {
            if (page.content instanceof bottom_navigation_1.BottomNavigation) {
                return page.content.tabStrip;
            }
        }
    };
    TabFrame.getCorrectTopmostFrame = function (source, alwaysParentIfChildIsTabs) {
        var topFrame = frame_1.Frame.topmost();
        if (topFrame) {
            if (alwaysParentIfChildIsTabs) {
                if (TabFrame.isTabsTabFrame(topFrame)) {
                    if (this._hasModalFrame(topFrame)) {
                        return this._getModalFrame(topFrame);
                    }
                    topFrame = TabFrame.getParentTopmostFrame();
                    return topFrame;
                }
                else if (this.isChildTabs(topFrame)) {
                    return topFrame;
                }
            }
            var correctFrameConfirmed = false;
            if (source && source.sourceType) {
                if (ExecuteSource_1.ExecuteSource.isExecuteSourceTabParent(source) && !TabFrame.isChildTabs(topFrame)) {
                    topFrame = this.getParentTopmostFrame();
                }
                else if (ExecuteSource_1.ExecuteSource.isExecuteSourceTabChild(source) && TabFrame.isChildTabs(topFrame)) {
                    topFrame = this.getTabTopmostFrameByFrame(topFrame, true);
                }
                else if (ExecuteSource_1.ExecuteSource.isExecuteSourceTab(source) && !this.isTopMostTab()) {
                    topFrame = this.getTabTopmostFrame(true);
                    correctFrameConfirmed = true;
                }
                else if (ExecuteSource_1.ExecuteSource.isExecuteSourceParent(source) && this.isTopMostTab()) {
                    topFrame = this.getParentTopmostFrame();
                }
                else if (ExecuteSource_1.ExecuteSource.isExecuteSourceModal(source) && !ModalFrame_1.ModalFrame.isModal(topFrame)) {
                    if (this.isTab(topFrame) && this._hasModalFrame(topFrame)) {
                        topFrame = this._getModalFrame(topFrame);
                    }
                    else {
                        var parentTopFrame = this.getParentTopmostFrame();
                        if (parentTopFrame && this._hasModalFrame(parentTopFrame)) {
                            topFrame = this._getModalFrame(parentTopFrame);
                        }
                    }
                }
            }
            else {
                if (!this.isTopMostTab()) {
                    if (this.isChildBottomNavigation(topFrame)) {
                        topFrame = this.getTabTopmostFrame();
                        correctFrameConfirmed = true;
                    }
                    else if (topFrame.currentPage && topFrame.currentPage.id === 'SideDrawerShellPage') {
                        topFrame = this.getSideDrawerSelectedTabFrame(topFrame.currentPage.content);
                        correctFrameConfirmed = true;
                    }
                }
                if (this.isSideDrawerTabFrame(topFrame) && this.isChildBottomNavigation(topFrame)) {
                    topFrame = this.getTabTopmostFrameByFrame(topFrame);
                    correctFrameConfirmed = true;
                }
                if (this.isChildTabs(topFrame)) {
                    topFrame = this.getTabTopmostFrame(true);
                    correctFrameConfirmed = true;
                }
            }
            if (this.isTab(topFrame) && !correctFrameConfirmed) {
                if (this.isTabsTabFrame(topFrame)) {
                    var tabs = this.getTabs(topFrame.page);
                    if (tabs) {
                        var tabsTabFrame = this.getTabsSelectedTabFrame(tabs);
                        if (tabsTabFrame) {
                            topFrame = tabsTabFrame;
                        }
                    }
                }
                else {
                    var bottomNav = this.getBottomNavigation(topFrame.page);
                    if (bottomNav) {
                        var bnTabFrame = this.getBottomNavSelectedTabFrame(bottomNav);
                        if (bnTabFrame) {
                            topFrame = bnTabFrame;
                        }
                    }
                }
            }
            topFrame = this._getModalFrame(topFrame);
        }
        return topFrame;
    };
    TabFrame.getBannerTopFrame = function (frame) {
        var bannerFrame = frame;
        if (TabFrame.isBottomNavigationTabFrame(frame) && frame.currentPage && frame.currentPage.actionBarHidden) {
            bannerFrame = TabFrame.getParentTopmostFrame(frame);
        }
        return bannerFrame;
    };
    TabFrame._getStackLayout = function (page) {
        var stackLayout = null;
        if (page && page.content && page.content instanceof dock_layout_1.DockLayout) {
            var dockLayoutChildCount = page.content.getChildrenCount();
            if (dockLayoutChildCount >= 1) {
                var child = void 0;
                for (var i = 0; i < dockLayoutChildCount; i++) {
                    child = page.content.getChildAt(i);
                    if (child instanceof stack_layout_1.StackLayout) {
                        stackLayout = child;
                        break;
                    }
                }
            }
        }
        else if (page && page.content && page.content instanceof stack_layout_1.StackLayout) {
            stackLayout = page.content;
        }
        else if (page && page.content && page.content instanceof content_view_1.ContentView) {
            stackLayout = page.content.content;
        }
        return stackLayout;
    };
    TabFrame.getTabs = function (parentPage) {
        var stackLayout = this._getStackLayout(parentPage);
        if (stackLayout) {
            var stackLayoutChildCount = stackLayout.getChildrenCount();
            if (stackLayoutChildCount >= 1) {
                var child = void 0;
                var tabsChild = null;
                for (var i = 0; i < stackLayoutChildCount; i++) {
                    child = stackLayout.getChildAt(i);
                    if (child instanceof stack_layout_1.StackLayout && (parentPage.isTabsTabPage || parentPage._isTabFrameWithHeader)) {
                        if (child.getChildrenCount() >= 0) {
                            child = child.getChildAt(0);
                            if (child instanceof tabs_1.Tabs) {
                                tabsChild = child;
                                break;
                            }
                        }
                    }
                    else if (child instanceof tabs_1.Tabs) {
                        tabsChild = child;
                        break;
                    }
                }
                return tabsChild;
            }
        }
        return null;
    };
    TabFrame.getBottomNavigation = function (parentPage) {
        if (parentPage && parentPage.content && parentPage.content instanceof bottom_navigation_1.BottomNavigation) {
            return parentPage.content;
        }
        return null;
    };
    TabFrame.getTabsSelectedTabFrame = function (tabs) {
        if (tabs && tabs instanceof tabs_1.Tabs) {
            var selectedIndex = tabs.selectedIndex;
            if (selectedIndex >= 0 &&
                tabs.items.length > selectedIndex) {
                var selectedTabcontentItem = tabs.items[selectedIndex];
                if (selectedTabcontentItem && selectedTabcontentItem.content &&
                    selectedTabcontentItem.content instanceof stack_layout_1.StackLayout) {
                    if (selectedTabcontentItem.content.getChildrenCount() === 1) {
                        var selectedItemStackLayoutChild = selectedTabcontentItem.content.getChildAt(0);
                        if (selectedItemStackLayoutChild && selectedItemStackLayoutChild instanceof TabFrame &&
                            selectedItemStackLayoutChild.currentPage) {
                            return selectedItemStackLayoutChild;
                        }
                    }
                }
            }
        }
        return null;
    };
    TabFrame.getBottomNavSelectedTabFrame = function (bottomNav) {
        if (bottomNav && bottomNav instanceof bottom_navigation_1.BottomNavigation) {
            var selectedIndex = bottomNav.selectedIndex;
            if (selectedIndex >= 0 &&
                bottomNav.items.length > selectedIndex) {
                var selectedTabcontentItem = bottomNav.items[selectedIndex];
                if (selectedTabcontentItem && selectedTabcontentItem.content &&
                    selectedTabcontentItem.content instanceof TabFrame && selectedTabcontentItem.content.currentPage) {
                    return selectedTabcontentItem.content;
                }
            }
        }
        return null;
    };
    TabFrame.getTabPageFromTabItem = function (tabContentItem) {
        if (tabContentItem && tabContentItem.content) {
            if (tabContentItem.content instanceof stack_layout_1.StackLayout) {
                if (tabContentItem.content.getChildrenCount() === 1) {
                    var stackLayoutChild = tabContentItem.content.getChildAt(0);
                    if (stackLayoutChild && stackLayoutChild instanceof TabFrame) {
                        return stackLayoutChild.currentPage;
                    }
                }
            }
            else if (tabContentItem.content instanceof TabFrame &&
                tabContentItem.content.currentPage instanceof MDKPage_1.MDKPage) {
                return tabContentItem.content.currentPage;
            }
        }
        return null;
    };
    TabFrame._getModalFrame = function (frame) {
        var frameToCheck = frame;
        if (this.isTabsTabFrame(frame)) {
            frameToCheck = this.getParentTopmostFrame(frame);
        }
        if (this._hasModalFrame(frameToCheck)) {
            frame = frameToCheck.currentPage.modal;
        }
        return frame;
    };
    TabFrame._hasModalFrame = function (frame) {
        return frame && frame.currentPage && frame.currentPage.modal &&
            frame.currentPage.modal instanceof ModalFrame_1.ModalFrame;
    };
    TabFrame.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(TabFrame.prototype, "parentPage", {
        get: function () {
            return this._parentPage;
        },
        set: function (page) {
            this._parentPage = page;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabFrame.prototype, "initialPage", {
        get: function () {
            return this._initialPage;
        },
        set: function (page) {
            this._initialPage = page;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabFrame.prototype, "isActive", {
        get: function () {
            return this._isActive;
        },
        enumerable: true,
        configurable: true
    });
    TabFrame.getBannerAnchorLayout = function (frame) {
        var topFrame = TabFrame.getCorrectTopmostFrame();
        if (topFrame && topFrame.currentPage && topFrame.currentPage.isTabsTabPage) {
            var container = null;
            var stackLayout = this._getStackLayout(topFrame.currentPage);
            if (stackLayout) {
                var stackLayoutChildCount = stackLayout.getChildrenCount();
                if (stackLayoutChildCount >= 1) {
                    var child = void 0;
                    for (var i = 0; i < stackLayoutChildCount; i++) {
                        child = stackLayout.getChildAt(i);
                        if (child instanceof stack_layout_1.StackLayout && child.id === 'BannerAnchor') {
                            container = stackLayout;
                            break;
                        }
                    }
                }
            }
            if (container !== null) {
                for (var i = 0; i < container.getChildrenCount(); i++) {
                    var child = container.getChildAt(i);
                    if (child instanceof stack_layout_1.StackLayout && child.id === 'BannerAnchor') {
                        var view = app.ios ? child.ios : child.android;
                        return view !== null ? view : null;
                    }
                }
            }
        }
        return null;
    };
    TabFrame.isSideDrawerTabFrame = function (frame) {
        return frame instanceof TabFrame && frame.parentPage instanceof MDKPage_1.MDKPage && frame.parentPage.definition.name === 'SideDrawerShellPage';
    };
    TabFrame.getSideDrawerSelectedTabFrame = function (tabs) {
        if (tabs && tabs instanceof tabs_1.Tabs) {
            var sideDrawerSelectedItem = tabs.selectedIndex;
            if (sideDrawerSelectedItem >= 0 && tabs.items.length > sideDrawerSelectedItem) {
                var activeTabContentItem = tabs.items[sideDrawerSelectedItem];
                if (activeTabContentItem instanceof bottom_navigation_1.TabContentItem && activeTabContentItem.content instanceof TabFrame) {
                    var tabFrame = activeTabContentItem.content;
                    return tabFrame;
                }
            }
        }
        return null;
    };
    return TabFrame;
}(frame_1.Frame));
exports.TabFrame = TabFrame;
