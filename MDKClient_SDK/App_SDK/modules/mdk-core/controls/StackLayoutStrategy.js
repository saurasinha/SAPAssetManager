"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var dock_layout_1 = require("tns-core-modules/ui/layouts/dock-layout");
var stack_layout_1 = require("tns-core-modules/ui/layouts/stack-layout");
var ControlFactorySync_1 = require("./ControlFactorySync");
var ToolbarContainer_1 = require("./ToolbarContainer");
var UIViewContainer_1 = require("./UIViewContainer");
var ViewContainer_1 = require("./ViewContainer");
var mdk_sap_1 = require("mdk-sap");
var ExtensionBuilder_1 = require("../builders/ui/ExtensionBuilder");
var view_1 = require("tns-core-modules/ui/core/view");
var BaseControlDefinition_1 = require("../definitions/controls/BaseControlDefinition");
var content_view_1 = require("tns-core-modules/ui/content-view");
var FlexibleColumnFrame_1 = require("../pages/FlexibleColumnFrame");
var nativescript_pulltorefresh_1 = require("@nstudio/nativescript-pulltorefresh");
var platform_1 = require("tns-core-modules/platform");
var tab_navigation_base_1 = require("tns-core-modules/ui/tab-navigation-base/tab-navigation-base");
var Logger_1 = require("../utils/Logger");
var CommonUtil_1 = require("../utils/CommonUtil");
var scroll_view_1 = require("tns-core-modules/ui/scroll-view");
var StackLayoutStrategy = (function () {
    function StackLayoutStrategy(page, context, containerDefinition, container) {
        this.page = page;
        this.context = context;
        this.containerDefinition = containerDefinition;
        this.container = container;
    }
    StackLayoutStrategy.prototype.createLayout = function () {
        var _this = this;
        var controls = [];
        this.containerDefinition.getControls().map(function (controlDefinition) {
            controls.push(ControlFactorySync_1.ControlFactorySync.Create(_this.page, _this.context, _this.containerDefinition, controlDefinition));
        });
        var isTabFrameWithHeader = false;
        var isTabsTabPage = this.page.isTabsTabPage;
        var tabsPosition = 'top';
        if (controls.length === 2 &&
            controls[0].type !== BaseControlDefinition_1.BaseControlDefinition.type.Extension &&
            controls[1].type !== BaseControlDefinition_1.BaseControlDefinition.type.Extension) {
            if (controls[0].type === BaseControlDefinition_1.BaseControlDefinition.type.SectionedTable
                && controls[0].isHeaderOnly() && controls[1].type === BaseControlDefinition_1.BaseControlDefinition.type.Tabs) {
                isTabFrameWithHeader = true;
            }
            else {
                Logger_1.Logger.instance.logManager.log(Logger_1.Logger.INVALID_PAGE_DEFINITION);
            }
        }
        var bindingPromises = [];
        controls.forEach(function (control) {
            if (control.isBindable) {
                bindingPromises.push(control.bind().then(function () {
                    return control;
                }));
            }
            else {
                bindingPromises.push(Promise.resolve(control));
            }
        });
        return Promise.all(bindingPromises).then(function (resolvedBindings) {
            var stackLayout = new stack_layout_1.StackLayout();
            stackLayout.orientation = 'vertical';
            stackLayout.id = _this.containerDefinition.getName();
            if (app.android) {
                var progressBar = new mdk_sap_1.ProgressBar();
                stackLayout.addChild(progressBar);
                _this.page.progressBar = progressBar;
            }
            resolvedBindings.forEach(function (control, idx) {
                var controlLayout = stackLayout;
                if (isTabFrameWithHeader) {
                    controlLayout = new stack_layout_1.StackLayout();
                    controlLayout.orientation = 'vertical';
                }
                if (control.type === BaseControlDefinition_1.BaseControlDefinition.type.Tabs) {
                    tabsPosition = control.getTabsPostion();
                }
                _this.page.addChildControl(control);
                control.setStyle();
                var controlView = _this.getControlView(control);
                if (idx === 0 && _this.page.PullDown) {
                    if (app.ios || app.android) {
                        if (_this.page.PullDown.OnPulledDown) {
                            controlView = _this.wrapControlWithPullToRefreshControl(controlView);
                        }
                    }
                    else {
                        Logger_1.Logger.instance.logManager.log(Logger_1.Logger.PULL_TO_REFRESH_NOT_SUPPORTED);
                    }
                }
                if (control.viewIsNative()) {
                    if (_this.container) {
                        if (app.ios) {
                            _this.container.ios.contentView.addSubview(controlView);
                        }
                        else {
                            _this.container.android.contentView.addSubview(controlView);
                        }
                    }
                    else if (app.ios &&
                        (controlView instanceof UIViewController
                            || controlView instanceof UIView)) {
                        controlLayout.addChild(new UIViewContainer_1.UIViewContainer(controlView));
                    }
                    else if (app.android &&
                        !(controlView instanceof view_1.View)) {
                        controlLayout.addChild(new ViewContainer_1.ViewContainer(controlView));
                    }
                    else {
                        controlLayout.addChild(controlView);
                    }
                }
                else {
                    controlLayout.addChild(controlView);
                }
                if (isTabFrameWithHeader) {
                    stackLayout.addChild(controlLayout);
                }
            });
            if (_this.page.isPageOriginalOnLoadedEventExecuted) {
                for (var _i = 0, _a = _this.page.controls; _i < _a.length; _i++) {
                    var control = _a[_i];
                    control.onPageLoaded(!_this.page.isPageHasLoadedOnce);
                }
            }
            if (isTabFrameWithHeader) {
                _this.page._isTabFrameWithHeader = true;
            }
            if (isTabsTabPage) {
                var bannerLayout = new stack_layout_1.StackLayout();
                bannerLayout.orientation = 'vertical';
                bannerLayout.id = 'BannerAnchor';
                stackLayout.insertChild(bannerLayout, 0);
            }
            return stackLayout;
        });
    };
    StackLayoutStrategy.prototype.wrapControlWithPullToRefreshControl = function (control) {
        var _this = this;
        try {
            if (control instanceof tab_navigation_base_1.TabNavigationBase) {
                return control;
            }
            var pullToRefresh_1 = new nativescript_pulltorefresh_1.PullToRefresh();
            if (app.android && (this.page.isStaticSectionPresent || (this.page.sectionCount > 1))) {
                var scrollView = new scroll_view_1.ScrollView();
                scrollView.content = control;
                pullToRefresh_1.content = scrollView;
            }
            else {
                pullToRefresh_1.content = control;
            }
            if (app.ios) {
                pullToRefresh_1.height = platform_1.screen.mainScreen.heightPixels;
            }
            if (this.page.PullDown) {
                var styles = this.page.PullDown.Styles;
                if (styles) {
                    var backGroundColor = CommonUtil_1.CommonUtil.getValidHexCode(styles.BackgroundColor);
                    var indicatorColor = CommonUtil_1.CommonUtil.getValidHexCode(styles.IndicatorColor);
                    if (backGroundColor) {
                        pullToRefresh_1.setProperty('indicatorFillColor', backGroundColor);
                    }
                    if (indicatorColor) {
                        pullToRefresh_1.setProperty('indicatorColor', indicatorColor);
                    }
                }
            }
            pullToRefresh_1.on('refresh', function () {
                return _this.page.executeOnPulledDownActionOrRule()
                    .catch(function (err) { return Logger_1.Logger.instance.ui.error('Failed to execute OnPullDownEvent'); })
                    .finally(function () {
                    pullToRefresh_1.refreshing = false;
                });
            });
            return pullToRefresh_1;
        }
        catch (err) {
            Logger_1.Logger.instance.ui.error('Error occured while wrapping with pullToRefresh');
        }
    };
    StackLayoutStrategy.prototype.createLayoutAsync = function () {
        var _this = this;
        return this.createLayout().then(function (stackLayout) {
            return _this.page.getToolbar().then((function (toolbar) {
                var pageContent;
                if (toolbar) {
                    var dock = new dock_layout_1.DockLayout();
                    dock_layout_1.DockLayout.setDock(toolbar.view(), toolbar.getPosition() === ToolbarContainer_1.ToolbarPosition.bottom ? 'bottom' : 'top');
                    dock.addChild(toolbar.view());
                    dock.addChild(stackLayout);
                    dock.stretchLastChild = true;
                    pageContent = dock;
                }
                else {
                    if (_this.page.targetFrameId && _this.page.targetFrameId.indexOf(FlexibleColumnFrame_1.FlexibleColumnFrame.COLUMN_TAG) !== -1) {
                        var contentContainer = new content_view_1.ContentView();
                        contentContainer.content = stackLayout;
                        pageContent = contentContainer;
                    }
                    else {
                        pageContent = stackLayout;
                    }
                }
                if (app.ios && _this.containerDefinition.getControls().length > 0) {
                    var firstDefinitionControl = _this.containerDefinition.getControls()[0];
                    if (firstDefinitionControl.getType() === BaseControlDefinition_1.BaseControlDefinition.type.Extension) {
                        return setTimeout(function () {
                            _this.page.content = pageContent;
                            if (toolbar) {
                                toolbar.view().update();
                            }
                            return _this.page.content;
                        }, 750);
                    }
                }
                _this.page.content = pageContent;
                if (toolbar) {
                    toolbar.view().update();
                }
                if (app.android) {
                    _this.page.updateProgressBar();
                }
                return _this.page.content;
            }));
        });
    };
    StackLayoutStrategy.prototype.getControlView = function (control) {
        try {
            return control.view();
        }
        catch (error) {
            return ExtensionBuilder_1.ExtensionBuilder.createFallbackExtension(error, { page: this.page }, control.viewIsNative()).view();
        }
    };
    return StackLayoutStrategy;
}());
exports.StackLayoutStrategy = StackLayoutStrategy;
