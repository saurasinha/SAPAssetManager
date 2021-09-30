"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("tns-core-modules/ui/frame");
var Context_1 = require("../context/Context");
var PageContentFactory_1 = require("../controls/PageContentFactory");
var StackLayoutStrategy_1 = require("../controls/StackLayoutStrategy");
var dock_layout_1 = require("tns-core-modules/ui/layouts/dock-layout");
var MDKPage_1 = require("./MDKPage");
var PageDefinition_1 = require("../definitions/PageDefinition");
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var WelcomePage_1 = require("./WelcomePage");
var ToolbarContainer_1 = require("../controls/ToolbarContainer");
var RestoreInfoPage_1 = require("./RestoreInfoPage");
var Logger_1 = require("../utils/Logger");
var IMDKPage_1 = require("../pages/IMDKPage");
var ModalFrame_1 = require("./ModalFrame");
var TabFrame_1 = require("./TabFrame");
var scroll_view_1 = require("tns-core-modules/ui/scroll-view");
var app = require("tns-core-modules/application");
var ControlFactorySync_1 = require("../controls/ControlFactorySync");
var FlexibleColumnFrame_1 = require("./FlexibleColumnFrame");
var MDKFrame_1 = require("./MDKFrame");
var ExecuteSource_1 = require("../common/ExecuteSource");
var MDKNavigationType_1 = require("../common/MDKNavigationType");
var Application_1 = require("../Application");
var ENTRY_OBSERVER = Symbol();
var PageRenderer = (function () {
    function PageRenderer() {
        if (PageRenderer._instance) {
            throw new Error('Error: Instantiation failed. Use getInstance() instead of new.');
        }
    }
    PageRenderer.instance = function () {
        return PageRenderer._instance;
    };
    PageRenderer.setPageReference = function (pageRef) {
        PageRenderer._pageReference = pageRef;
    };
    PageRenderer.initializeAppLevelSideDrawer = function () {
        if (app.ios || app.android) {
            var applicationParams = Application_1.Application.getApplicationParams();
            var mainPageRef = applicationParams && applicationParams.hasOwnProperty('mainPage') ?
                applicationParams.mainPage :
                IDefinitionProvider_1.IDefinitionProvider.instance().getApplicationDefinition().getMainPage();
            return IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(mainPageRef).then(function (mainPageDef) {
                if (mainPageDef.getSideDrawer() !== undefined) {
                    var sideDrawerDef = mainPageDef.getSideDrawer();
                    var mainPage = PageRenderer.instance().createAndInitializePage(mainPageDef, false, false, true);
                    PageRenderer.appLevelSideDrawer = ControlFactorySync_1.ControlFactorySync.Create(mainPage, mainPage.context, mainPageDef, sideDrawerDef);
                }
                else if (PageRenderer.appLevelSideDrawer !== undefined) {
                    delete PageRenderer.appLevelSideDrawer;
                }
            });
        }
        return Promise.resolve();
    };
    PageRenderer.getCurrentlyActiveFrameForNavigation = function (navigationType, executeSource) {
        if (executeSource === void 0) { executeSource = null; }
        if (executeSource && executeSource.frameId) {
            var currentFrame = void 0;
            currentFrame = frame_1.Frame.getFrameById(executeSource.frameId);
            if (currentFrame) {
                var targetFrame = void 0;
                if (currentFrame instanceof FlexibleColumnFrame_1.FlexibleColumnFrame) {
                    switch (navigationType) {
                        case MDKNavigationType_1.MDKNavigationType.Root:
                            var rootFrameId = MDKFrame_1.MDKFrame.getRootFrameId();
                            if (rootFrameId) {
                                targetFrame = frame_1.Frame.getFrameById(rootFrameId);
                            }
                            break;
                        case MDKNavigationType_1.MDKNavigationType.Outer:
                            if (currentFrame.parentPage) {
                                targetFrame = currentFrame.parentPage.frame;
                            }
                            break;
                        case MDKNavigationType_1.MDKNavigationType.Inner:
                            targetFrame = currentFrame;
                            break;
                        case MDKNavigationType_1.MDKNavigationType.Cross:
                        default:
                            targetFrame = currentFrame.getNextFlexibileColumnFrame();
                            break;
                    }
                }
                else if (TabFrame_1.TabFrame.isSideDrawerTabFrame(currentFrame)) {
                    targetFrame = currentFrame;
                }
                else if (currentFrame instanceof TabFrame_1.TabFrame && currentFrame.page) {
                    targetFrame = currentFrame.page.frame;
                }
                if (targetFrame) {
                    return targetFrame;
                }
                else {
                    return currentFrame;
                }
            }
        }
        if (!frame_1.Frame.topmost()) {
            throw new Error("Invalid call to pushNavigation, topmost frame is required.");
        }
        var topFrame = frame_1.Frame.topmost();
        if (navigationType === MDKNavigationType_1.MDKNavigationType.Root) {
            topFrame = TabFrame_1.TabFrame.getParentTopmostFrame();
            while (TabFrame_1.TabFrame.isTab(topFrame)) {
                topFrame = TabFrame_1.TabFrame.getParentTopmostFrame(topFrame);
            }
        }
        else if (navigationType === MDKNavigationType_1.MDKNavigationType.Outer) {
            if (TabFrame_1.TabFrame.isTopMostTab()) {
                topFrame = TabFrame_1.TabFrame.getParentTopmostFrame();
            }
        }
        else {
            if (!TabFrame_1.TabFrame.isTopMostTab()) {
                var includeTabs = false;
                if (TabFrame_1.TabFrame.isChildTabs(topFrame) && navigationType === MDKNavigationType_1.MDKNavigationType.Inner) {
                    includeTabs = true;
                }
                topFrame = TabFrame_1.TabFrame.getTabTopmostFrame(includeTabs);
            }
            else {
                if (TabFrame_1.TabFrame.isTabsTabFrame(topFrame) && navigationType !== MDKNavigationType_1.MDKNavigationType.Inner) {
                    topFrame = TabFrame_1.TabFrame.getParentTopmostFrame();
                }
            }
        }
        if (topFrame.currentPage && topFrame.currentPage.modal) {
            topFrame = topFrame.currentPage.modal;
        }
        return topFrame;
    };
    PageRenderer.pushNavigation = function (pageReference, clearNavStack, navigationType, executeSource, transition, targetFrame) {
        var _this = this;
        if (clearNavStack === void 0) { clearNavStack = false; }
        if (navigationType === void 0) { navigationType = null; }
        if (executeSource === void 0) { executeSource = null; }
        if (transition === void 0) { transition = null; }
        var pageDefinitionPromise = pageReference ? IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(pageReference) : Promise.resolve(undefined);
        return pageDefinitionPromise.then(function (pageDefinition) {
            return _this.pushNavigationByDef(pageDefinition, clearNavStack, navigationType, executeSource, transition, targetFrame);
        });
    };
    PageRenderer.pushNavigationByDef = function (pageDefinition, clearNavStack, navigationType, executeSource, transition, targetFrame) {
        if (clearNavStack === void 0) { clearNavStack = false; }
        if (navigationType === void 0) { navigationType = null; }
        if (executeSource === void 0) { executeSource = null; }
        if (transition === void 0) { transition = null; }
        var isFlexibleColumnFrame;
        var flexibleColumnFrameCheck;
        if (executeSource && executeSource.frameId) {
            isFlexibleColumnFrame = FlexibleColumnFrame_1.FlexibleColumnFrame.isFlexibleColumnFrame(executeSource.frameId) ? true : false;
            flexibleColumnFrameCheck = isFlexibleColumnFrame ? !FlexibleColumnFrame_1.FlexibleColumnFrame.isLastFrameWithinFlexibleColumnLayout(executeSource.frameId) : false;
        }
        if ((!navigationType || navigationType ? navigationType === MDKNavigationType_1.MDKNavigationType.Cross : false) && flexibleColumnFrameCheck) {
            clearNavStack = true;
        }
        if (isFlexibleColumnFrame) {
            if (pageDefinition && (pageDefinition.getFlexibleColumnLayout() || pageDefinition.getBottomNavigation())) {
                navigationType = MDKNavigationType_1.MDKNavigationType.Outer;
            }
        }
        else {
            if (executeSource && ExecuteSource_1.ExecuteSource.isExecuteSourceParent(executeSource)) {
                navigationType = MDKNavigationType_1.MDKNavigationType.Outer;
            }
        }
        return this.pushNavigationForPageDefinition(pageDefinition, clearNavStack, navigationType, executeSource, transition, false, targetFrame);
    };
    PageRenderer.pushNavigationByMetadata = function (pageMetadata, clearNavStack, navigationType, executeSource, transition, targetFrame) {
        if (clearNavStack === void 0) { clearNavStack = false; }
        if (navigationType === void 0) { navigationType = null; }
        if (executeSource === void 0) { executeSource = null; }
        if (transition === void 0) { transition = null; }
        var pageDefinition = this.createPageDefinition(pageMetadata);
        return this.pushNavigationByDef(pageDefinition, clearNavStack, navigationType, executeSource, transition, targetFrame);
    };
    PageRenderer.pushNavigationForPageDefinition = function (pageDefinition, clearNavStack, navigationType, executeSource, transition, isPageShell, targetFrame) {
        var _this = this;
        if (clearNavStack === void 0) { clearNavStack = false; }
        if (navigationType === void 0) { navigationType = null; }
        if (executeSource === void 0) { executeSource = null; }
        if (transition === void 0) { transition = null; }
        if (isPageShell === void 0) { isPageShell = false; }
        return new Promise(function (resolve, reject) {
            var topFrame = targetFrame;
            if (!topFrame) {
                topFrame = _this.getCurrentlyActiveFrameForNavigation(navigationType, executeSource);
            }
            return _this.createNavigationEntryForPageDefinition(pageDefinition, clearNavStack, executeSource, topFrame.id, isPageShell).then(function (navigationEntry) {
                if (transition) {
                    if (transition.noTrans) {
                        navigationEntry.animated = false;
                        navigationEntry.transition = undefined;
                    }
                    else {
                        navigationEntry.transition = transition;
                    }
                }
                if (app.android && !transition) {
                    navigationEntry.animated = true;
                    var appDefinition = IDefinitionProvider_1.IDefinitionProvider.instance().getApplicationDefinition();
                    var transit = (pageDefinition && appDefinition.getMainPage() === pageDefinition.path) ? 'fade' : 'slide';
                    navigationEntry.transition = {
                        name: transit,
                    };
                }
                var currentPage = topFrame.currentPage;
                if ((currentPage instanceof MDKPage_1.MDKPage) && currentPage.isNavigating) {
                    return Promise.reject('isNavigating');
                }
                var mdkPage = currentPage;
                if (!IMDKPage_1.isMDKPage(mdkPage)) {
                }
                else if (topFrame.transition !== undefined) {
                    topFrame.transition = undefined;
                }
                _this.observeEntryChange(topFrame);
                var handler = function (args) {
                    topFrame.off('patched_currentEntryChange', handler);
                    resolve(navigationEntry);
                };
                topFrame.on('patched_currentEntryChange', handler);
                topFrame.navigate(navigationEntry);
            });
        });
    };
    PageRenderer.showPage = function (params) {
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame(params.executeSource);
        if (PageRenderer.appLevelSideDrawer &&
            PageRenderer.appLevelSideDrawer.blankItemSelected &&
            PageRenderer.appLevelSideDrawer.blankItemModalAnchorPage) {
            topFrame = MDKFrame_1.MDKFrame.getCorrectTopmostFrame(null, false, params.executeSource.frameId);
        }
        var isTopmostModal = ModalFrame_1.ModalFrame.isModal(topFrame);
        var usePageMetadata = !!params.pageMetadata;
        if (!isTopmostModal) {
            if (params.isModalPage || params.isFullScreen) {
                if (usePageMetadata) {
                    return PageRenderer.showModalPageByMetadata(params.pageMetadata, false, params.isFullScreen, params.executeSource);
                }
                else {
                    return PageRenderer.showModalPage(params.pageReference, false, params.isFullScreen, params.executeSource);
                }
            }
            else {
                if (usePageMetadata) {
                    return PageRenderer.pushNavigationByMetadata(params.pageMetadata, params.isClearHistory, params.navigationType, params.executeSource, params.transition);
                }
                else {
                    return PageRenderer.pushNavigation(params.pageReference, params.isClearHistory, params.navigationType, params.executeSource, params.transition);
                }
            }
        }
        else {
            var currentPage = topFrame.currentPage;
            if (currentPage && currentPage.definition.path === params.pageReference && params.isModalPage) {
                return Promise.resolve();
            }
            if (usePageMetadata) {
                return PageRenderer.pushNavigationByMetadata(params.pageMetadata, params.isClearHistory, null, params.executeSource, params.transition);
            }
            else {
                return PageRenderer.pushNavigation(params.pageReference, params.isClearHistory, null, params.executeSource, params.transition);
            }
        }
    };
    PageRenderer.createPageDefinition = function (pageMetadata) {
        var currentIdx = PageRenderer._pageMetadataIndex++;
        return new PageDefinition_1.PageDefinition('/_dummy_pages_/_dummy_page_' + currentIdx, typeof (pageMetadata) === 'string' ? JSON.parse(pageMetadata) : pageMetadata);
    };
    PageRenderer.showModalPage = function (pageReference, isPopover, isFullScreen, executeSource) {
        var _this = this;
        try {
            return IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(pageReference).then(function (oPageDefinition) {
                return _this.showModalPageByDef(oPageDefinition, isPopover, isFullScreen, executeSource);
            });
        }
        catch (error) {
            Logger_1.Logger.instance.core.error(error);
        }
    };
    PageRenderer.showModalPageByMetadata = function (pageMetadata, isPopover, isFullScreen, executeSource) {
        var pageDefinition = this.createPageDefinition(pageMetadata);
        return this.showModalPageByDef(pageDefinition, isPopover, isFullScreen, executeSource);
    };
    PageRenderer.showModalPageByDef = function (pageDefinition, isPopover, isFullScreen, executeSource) {
        var topFrame = frame_1.Frame.topmost();
        if (executeSource && executeSource.frameId) {
            topFrame = MDKFrame_1.MDKFrame.getCorrectTopmostFrame(null, false, executeSource.frameId);
        }
        else {
            topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame(executeSource);
        }
        var currentPage = topFrame.currentPage;
        if (!ModalFrame_1.ModalFrame.isTopMostModal() && (currentPage instanceof MDKPage_1.MDKPage) && currentPage.isNavigating) {
            return Promise.reject('Non-modal page is navigating');
        }
        var mdkPage = currentPage;
        return PageRenderer.instance().renderPageAsync(pageDefinition, true, isPopover, isFullScreen, executeSource, true).then(function (modalPage) {
            return new Promise(function (resolve, reject) {
                mdkPage.displayModalPage(modalPage, mdkPage.context, function () {
                    var canceled = mdkPage.context.clientAPIProps.cancelPendingActions;
                    mdkPage.dismissModalPage(canceled, resolve, reject);
                }, isPopover, isFullScreen);
            });
        });
    };
    PageRenderer.showModalPageByDefinition = function (oPageDefinition, isFullScreen) {
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        if (!topFrame) {
            throw new Error("Invalid call to pushNavigation, topmost frame is required.");
        }
        var currentPage = topFrame.currentPage;
        if ((currentPage instanceof MDKPage_1.MDKPage) && currentPage.isNavigating) {
            return Promise.reject('isNavigating');
        }
        return new Promise(function (resolve, reject) {
            return PageRenderer.instance().renderPageAsync(oPageDefinition, true, false, isFullScreen).then(function (modalPage) {
                if (!ModalFrame_1.ModalFrame.isTopMostModal()) {
                    currentPage.displayModalPage(modalPage, currentPage.context, function () {
                        var canceled = currentPage.context.clientAPIProps.cancelPendingActions;
                        currentPage.dismissModalPage(canceled, resolve, reject);
                    }, false, isFullScreen);
                }
                else {
                    var navigationEntry = {
                        clearHistory: false,
                        create: function () {
                            return modalPage;
                        },
                    };
                    if (app.android) {
                        navigationEntry.animated = true;
                        navigationEntry.transition = {
                            name: 'slide',
                        };
                    }
                    topFrame.navigate(navigationEntry);
                    resolve(navigationEntry);
                }
            });
        });
    };
    PageRenderer.showPageByDefinition = function (oPageDefinition) {
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        if (!topFrame) {
            throw new Error("Invalid call to pushNavigation, topmost frame is required.");
        }
        var currentPage = topFrame.currentPage;
        if ((currentPage instanceof MDKPage_1.MDKPage) && currentPage.isNavigating) {
            return Promise.reject('isNavigating');
        }
        return new Promise(function (resolve, reject) {
            if (IMDKPage_1.isMDKPage(currentPage) && topFrame.transition !== undefined) {
                topFrame.transition = undefined;
            }
            return PageRenderer.instance().renderPageAsync(oPageDefinition).then(function (mdkPage) {
                var navigationEntry = {
                    clearHistory: false,
                    create: function () {
                        return mdkPage;
                    },
                };
                if (app.android) {
                    navigationEntry.animated = true;
                    navigationEntry.transition = {
                        name: 'slide',
                    };
                }
                topFrame.navigate(navigationEntry);
                resolve(navigationEntry);
            });
        });
    };
    PageRenderer.showPasscodePage = function () {
        return this.startupNavigation(undefined, false);
    };
    PageRenderer.showWelcomePage = function () {
        return this.startupNavigation(undefined, true);
    };
    PageRenderer.showStartupPage = function (pageReference) {
        return this.startupNavigation(pageReference, false);
    };
    PageRenderer.startupNavigation = function (pageReference, initialLaunch) {
        var _this = this;
        return PageRenderer.initializeAppLevelSideDrawer().then(function () {
            PageRenderer._pageReference = pageReference;
            PageRenderer._initialLaunch = initialLaunch;
            var rootEntry = {
                create: (function () {
                    if (PageRenderer.isControlComingFromOnCreate === true) {
                        PageRenderer.isControlComingFromOnCreate = false;
                        if (PageRenderer._navigationStartupDone === true) {
                            if (app.android && PageRenderer.appLevelSideDrawer !== undefined) {
                                return PageRenderer.appLevelSideDrawer.view();
                            }
                        }
                    }
                    PageRenderer._navigationStartupDone = true;
                    var frame = new MDKFrame_1.MDKFrame();
                    if (PageRenderer._pageReference) {
                        MDKFrame_1.MDKFrame.setRootFrameId(MDKFrame_1.MDKFrame.STARTUPPAGE_FRAME_ID);
                        frame.id = MDKFrame_1.MDKFrame.STARTUPPAGE_FRAME_ID;
                        if (pageReference && PageRenderer._pageReference === pageReference) {
                            if (PageRenderer._initialLaunch) {
                                _this.createNavigationEntry(PageRenderer._pageReference, false).then(function (navEntry) {
                                    frame.navigate(navEntry);
                                });
                            }
                            else {
                                var navEntry = {
                                    create: PageRenderer.instance().renderRestore.bind(PageRenderer.instance()),
                                };
                                frame.navigate(navEntry);
                            }
                        }
                        else {
                            _this.createNavigationEntry(PageRenderer._pageReference, false).then(function (navEntry) {
                                frame.navigate(navEntry);
                            });
                        }
                    }
                    else {
                        var navigationEntry = void 0;
                        if (PageRenderer._initialLaunch) {
                            MDKFrame_1.MDKFrame.setRootFrameId(MDKFrame_1.MDKFrame.WELCOME_FRAME_ID);
                            frame.id = MDKFrame_1.MDKFrame.WELCOME_FRAME_ID;
                            navigationEntry = {
                                create: PageRenderer.instance().renderWelcome.bind(PageRenderer.instance()),
                            };
                        }
                        else {
                            MDKFrame_1.MDKFrame.setRootFrameId(MDKFrame_1.MDKFrame.PASSCODE_FRAME_ID);
                            frame.id = MDKFrame_1.MDKFrame.PASSCODE_FRAME_ID;
                            navigationEntry = {
                                create: PageRenderer.instance().renderRestore.bind(PageRenderer.instance()),
                            };
                        }
                        frame.navigate(navigationEntry);
                    }
                    if ((app.ios || app.android) && PageRenderer.appLevelSideDrawer !== undefined) {
                        PageRenderer.appLevelSideDrawer.view().mainContent = frame;
                        Logger_1.Logger.instance.core.info("-----------Side drawer set as root view of the app----------");
                        return PageRenderer.appLevelSideDrawer.view();
                    }
                    return frame;
                }),
            };
            return rootEntry;
        });
    };
    PageRenderer.fullPageModalTransition = function () {
        return {
            curve: PageRenderer.defaultTransitionCurve,
            duration: PageRenderer.defaultFullPageModalDuration,
            name: PageRenderer.defaultFullPageModalTransitionName,
        };
    };
    PageRenderer.createInitialPage = function (definition, isModal, isPopover, isFullPage, isClearHistory) {
        if (isPopover === void 0) { isPopover = false; }
        if (isFullPage === void 0) { isFullPage = true; }
        if (isClearHistory === void 0) { isClearHistory = false; }
        return this._instance.createInitialPage(definition, isModal, isPopover, isFullPage, null, false, isClearHistory);
    };
    PageRenderer.reset = function () {
        PageRenderer._pageReference = undefined;
        PageRenderer._initialLaunch = true;
    };
    PageRenderer.createNavigationEntry = function (pageReference, clearHistory) {
        var _this = this;
        var pageDefinitionPromise = pageReference ? IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(pageReference) : Promise.resolve(undefined);
        return pageDefinitionPromise.then(function (pageDefinition) {
            return _this.createNavigationEntryForPageDefinition(pageDefinition, clearHistory);
        });
    };
    PageRenderer.createNavigationEntryForPageDefinition = function (pageDefinition, clearHistory, executeSource, frameId, isPageShell) {
        if (executeSource === void 0) { executeSource = null; }
        if (frameId === void 0) { frameId = ''; }
        if (isPageShell === void 0) { isPageShell = false; }
        var navigationEntry;
        if (pageDefinition) {
            var page_1 = PageRenderer.instance().createInitialPage(pageDefinition, false, false, true, executeSource, isPageShell, clearHistory);
            page_1.targetFrameId = frameId;
            page_1._isClearHistoryNavigation = clearHistory;
            PageRenderer.instance().renderPageContentAsync(page_1, pageDefinition);
            ModalFrame_1.ModalFrame.setCurrentModalPage(page_1);
            navigationEntry = {
                clearHistory: clearHistory,
                create: function () {
                    return page_1;
                },
            };
        }
        else {
            navigationEntry = {
                clearHistory: clearHistory,
                create: PageRenderer.instance().renderWelcome.bind(PageRenderer.instance()),
            };
        }
        return Promise.resolve(navigationEntry);
    };
    PageRenderer.prototype.renderWelcome = function () {
        var oPage = new WelcomePage_1.WelcomePage();
        return oPage;
    };
    PageRenderer.prototype.renderRestore = function () {
        var oPage = new RestoreInfoPage_1.RestoreInfoPage();
        return oPage;
    };
    PageRenderer.prototype.createAndInitializePage = function (definition, isModal, isPopover, isFullPage, source, isPageShell, isClearHistory) {
        if (isPageShell === void 0) { isPageShell = false; }
        if (isClearHistory === void 0) { isClearHistory = false; }
        var currentPageContext = Context_1.Context.fromPage(source);
        var binding = null;
        if (currentPageContext) {
            binding = currentPageContext.clientAPIProps.actionBinding;
            if (binding === null || binding === undefined) {
                binding = currentPageContext.binding;
            }
        }
        if (PageRenderer.appLevelSideDrawer) {
            var sdActionBinding = PageRenderer.appLevelSideDrawer.page().context.clientAPIProps.actionBinding;
            if (sdActionBinding) {
                binding = __assign(__assign({}, binding), sdActionBinding);
            }
        }
        var page = new MDKPage_1.MDKPage(definition, isPageShell, isClearHistory);
        var context = new Context_1.Context(binding, page);
        page.initialize(context, isModal, isPopover, isFullPage);
        return page;
    };
    PageRenderer.prototype.renderPageAsync = function (definition, isModal, isPopover, isFullPage, executeSource, isClearHistory) {
        if (isPopover === void 0) { isPopover = false; }
        if (isFullPage === void 0) { isFullPage = true; }
        if (executeSource === void 0) { executeSource = null; }
        if (isClearHistory === void 0) { isClearHistory = false; }
        var page = PageRenderer.instance().createAndInitializePage(definition, isModal, isPopover, isFullPage, executeSource, false, isClearHistory);
        PageRenderer.currentlyRenderedPage = page;
        return Promise.resolve(page).then(function () {
            var pageContentFactory = new PageContentFactory_1.PageContentFactory(page, page.context, definition, null);
            pageContentFactory.createContentAsync();
            return page;
        });
    };
    PageRenderer.prototype.createInitialPage = function (definition, isModal, isPopover, isFullPage, executeSource, isPageShell, isClearHistory) {
        if (isPopover === void 0) { isPopover = false; }
        if (isFullPage === void 0) { isFullPage = true; }
        if (executeSource === void 0) { executeSource = null; }
        if (isPageShell === void 0) { isPageShell = false; }
        if (isClearHistory === void 0) { isClearHistory = false; }
        var page = PageRenderer.instance().createAndInitializePage(definition, isModal, isPopover, isFullPage, executeSource, isPageShell, isClearHistory);
        PageRenderer.currentlyRenderedPage = page;
        return page;
    };
    PageRenderer.prototype.renderPageContentAsync = function (page, definition) {
        return Promise.resolve(page).then(function () {
            var pageContentFactory = new PageContentFactory_1.PageContentFactory(page, page.context, definition, null);
            pageContentFactory.createContentAsync();
            return page;
        });
    };
    PageRenderer.observeEntryChange = function (frame) {
        if (frame[ENTRY_OBSERVER]) {
            return;
        }
        frame[ENTRY_OBSERVER] = true;
        var currentEntry = frame._currentEntry;
        Object.defineProperty(frame, '_currentEntry', {
            get: function () {
                return currentEntry;
            },
            set: function (v) {
                currentEntry = v;
                frame.notify({
                    eventName: 'patched_currentEntryChange',
                    value: v,
                    object: frame,
                });
            }
        });
    };
    PageRenderer.prototype.renderPageSync = function (definition, isModal, isPopover, isFullPage) {
        if (isPopover === void 0) { isPopover = false; }
        if (isFullPage === void 0) { isFullPage = true; }
        var page = PageRenderer.instance().createAndInitializePage(definition, isModal, isPopover, isFullPage);
        var stackLayoutFactory = new StackLayoutStrategy_1.StackLayoutStrategy(page, page.context, definition, null);
        var pageContent;
        return stackLayoutFactory.createLayout().then(function (layout) {
            if (app.ios) {
                pageContent = new scroll_view_1.ScrollView();
                pageContent.content = layout;
            }
            else {
                pageContent = layout;
            }
        }).then(function () {
            return page.getToolbar().then((function (toolbar) {
                if (toolbar) {
                    var dock = new dock_layout_1.DockLayout();
                    dock_layout_1.DockLayout.setDock(toolbar.view(), toolbar.getPosition() === ToolbarContainer_1.ToolbarPosition.bottom ? 'bottom' : 'top');
                    dock.addChild(toolbar.view());
                    dock.addChild(pageContent);
                    dock.stretchLastChild = true;
                    page.content = dock;
                    toolbar.view().update();
                }
                else {
                    page.content = pageContent;
                }
                PageRenderer.currentlyRenderedPage = page;
                return page;
            }));
        });
    };
    PageRenderer.currentlyRenderedPage = undefined;
    PageRenderer.appLevelSideDrawer = undefined;
    PageRenderer._pageMetadataIndex = 0;
    PageRenderer._pageReference = undefined;
    PageRenderer._initialLaunch = true;
    PageRenderer._navigationStartupDone = false;
    PageRenderer.isControlComingFromOnCreate = false;
    PageRenderer._instance = new PageRenderer();
    PageRenderer.defaultTransitionCurve = 'easeIn';
    PageRenderer.defaultFullPageModalDuration = 300;
    PageRenderer.defaultFullPageModalTransitionName = 'slideTop';
    return PageRenderer;
}());
exports.PageRenderer = PageRenderer;
;
