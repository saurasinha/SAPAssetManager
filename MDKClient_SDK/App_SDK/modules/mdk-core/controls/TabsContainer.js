"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IControlFactory_1 = require("./IControlFactory");
var Logger_1 = require("../utils/Logger");
var BaseControl_1 = require("./BaseControl");
var StackLayoutStrategy_1 = require("./StackLayoutStrategy");
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var tabs_1 = require("tns-core-modules/ui/tabs");
var tab_strip_1 = require("tns-core-modules/ui/tab-navigation-base/tab-strip");
var tab_content_item_1 = require("tns-core-modules/ui/tab-navigation-base/tab-content-item");
var NavigationActionDefinition_1 = require("../definitions/actions/NavigationActionDefinition");
var NavigationAction_1 = require("../actions/NavigationAction");
var stack_layout_1 = require("tns-core-modules/ui/layouts/stack-layout");
var PageRenderer_1 = require("../pages/PageRenderer");
var TabFrame_1 = require("../pages/TabFrame");
var TabsDataBuilder_1 = require("../builders/ui/TabsDataBuilder");
var PageDefinition_1 = require("../definitions/PageDefinition");
var FlexibleColumnFrame_1 = require("../pages/FlexibleColumnFrame");
var TabsContainer = (function (_super) {
    __extends(TabsContainer, _super);
    function TabsContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._tabItems = [];
        return _this;
    }
    TabsContainer.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
        this._tabsView = new tabs_1.Tabs();
        this._tabsView.id = this.page().debugString + '_Tabs';
    };
    TabsContainer.prototype.bind = function () {
        var _this = this;
        var tabContentItem = new tab_content_item_1.TabContentItem();
        var contentItems = [];
        var tabsDef = this.definition();
        var builder = new TabsDataBuilder_1.TabsDataBuilder(this.context);
        builder.setPosition(tabsDef.position)
            .setSelectedIndex(tabsDef.selectedIndex)
            .setSwipeEnabled(tabsDef.swipeEnabled)
            .setVisible(tabsDef.visible)
            .setStyles(tabsDef.styles);
        return builder.build().then(function (data) {
            var tabStripClassName;
            if (data.styles) {
                if (data.styles.hasOwnProperty('TabStrip')) {
                    if (typeof data.styles.TabStrip === 'string') {
                        tabStripClassName = data.styles.TabStrip;
                    }
                }
            }
            var dataPosition = data.position ? data.position.toLowerCase() : '';
            if (dataPosition === 'top' || dataPosition === 'bottom') {
                _this._tabsView.tabsPosition = dataPosition;
            }
            _this._tabsItemsDefs = tabsDef.getItems();
            _this._tabsView.on('selectedIndexChanged', function (dataArgs) {
                if (_this._tabPages.length - 1 >= dataArgs.newIndex &&
                    _this._tabsItemsDefs.length - 1 >= dataArgs.newIndex) {
                    var tabPage_1 = _this._tabPages[dataArgs.newIndex];
                    if (!tabPage_1.content) {
                        if (_this._tabsItemsDefs[dataArgs.newIndex].pageToOpen) {
                            IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(_this._tabsItemsDefs[dataArgs.newIndex].pageToOpen).then(function (pageDef) {
                                _this._stackLayoutFactory = new StackLayoutStrategy_1.StackLayoutStrategy(tabPage_1, _this.page().context, pageDef, null);
                                _this._stackLayoutFactory.createLayoutAsync();
                            });
                        }
                    }
                    else {
                        var args = {
                            isBackNavigation: true,
                        };
                        tabPage_1.onNavigatedToMDKPage(args);
                    }
                }
            });
            _this._tabPages = [];
            _this._tabContentItems = [];
            var tabItemStackLayoutPromises = [];
            _this._tabsItemsDefs.forEach(function (tabItemDef, idx) {
                tabItemStackLayoutPromises.push(_this._createTabItemView(tabItemDef, idx));
            });
            return Promise.all(tabItemStackLayoutPromises).then(function (tabItemStackLayouts) {
                var itemFrame;
                tabItemStackLayouts.forEach(function (itemStackLayout) {
                    if (itemStackLayout) {
                        tabContentItem = new tab_content_item_1.TabContentItem();
                        tabContentItem.content = itemStackLayout;
                        _this._tabContentItems.push(tabContentItem);
                        contentItems.push(tabContentItem);
                        if (itemStackLayout.getChildrenCount() >= 1) {
                            itemFrame = itemStackLayout.getChildAt(0);
                            _this._tabPages.push(itemFrame.initialPage);
                        }
                    }
                });
                return _this._createTabItems(_this._tabsItemsDefs).then(function (tabItems) {
                    var tabStripItems = [];
                    tabItems.forEach(function (tabItem) {
                        if (tabItem) {
                            _this._tabItems.push(tabItem);
                            tabStripItems.push(tabItem.view());
                        }
                    });
                    var tabStrip = new tab_strip_1.TabStrip();
                    tabStrip.id = _this.definition().name;
                    tabStrip.items = tabStripItems;
                    if (tabStripClassName) {
                        tabStrip.className = tabStripClassName;
                    }
                    _this._tabsView.tabStrip = tabStrip;
                    _this._tabsView.items = contentItems;
                });
            });
        });
    };
    TabsContainer.prototype.redraw = function () {
        var _this = this;
        return this._createTabItems(this._tabsItemsDefs).then(function (tabItems) {
            if (tabItems.length === _this._tabItems.length &&
                _this._tabsView.tabStrip && _this._tabsView.tabStrip.items &&
                _this._tabItems.length === _this._tabsView.tabStrip.items.length) {
                var tabItemView = void 0;
                for (var i = 0; i < _this._tabItems.length; i++) {
                    tabItemView = tabItems[i].view();
                    if (tabItemView) {
                        _this._tabsView.tabStrip.items[i].title = tabItemView.title;
                        if (tabItemView.iconSource) {
                            _this._tabsView.tabStrip.items[i].iconSource = tabItemView.iconSource;
                        }
                    }
                }
            }
            for (var _i = 0, _a = _this._tabPages; _i < _a.length; _i++) {
                var tabPage = _a[_i];
                if (tabPage.content) {
                    tabPage.onDataChanged(null, null);
                }
            }
        });
    };
    TabsContainer.prototype.onDismissingModal = function () {
        _super.prototype.onDismissingModal.call(this);
    };
    TabsContainer.prototype.view = function () {
        return this._tabsView;
    };
    Object.defineProperty(TabsContainer.prototype, "items", {
        get: function () {
            return this._tabItems;
        },
        enumerable: true,
        configurable: true
    });
    TabsContainer.prototype.setStyle = function (style, target) {
        if (style) {
            if ((target && typeof target === 'string' && target === 'TabStrip') || !target) {
                this.view().tabStrip.className = style;
            }
        }
    };
    TabsContainer.prototype.setItemCaption = function (tabItemName, newCaption) {
        var found = false;
        if (this._tabsView.tabStrip && this._tabsView.tabStrip.items &&
            this._tabItems.length === this._tabsView.tabStrip.items.length) {
            var i = 0;
            for (var _i = 0, _a = this._tabItems; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.name === tabItemName) {
                    found = true;
                    this._tabsView.tabStrip.items[i].title = newCaption;
                    break;
                }
                i++;
            }
        }
        if (!found) {
            Logger_1.Logger.instance.ui.warn(Logger_1.Logger.SETITEMCAPTION_TAB_ITEM_NOT_FOUND, tabItemName);
        }
    };
    TabsContainer.prototype.setSelectedTabItemByName = function (tabItemName) {
        var matchingItem = this.items.find(function (item) {
            return item.name === tabItemName;
        });
        this.setSelectedTabItemByIndex(matchingItem.index);
    };
    TabsContainer.prototype.setSelectedTabItemByIndex = function (tabItemIndex) {
        if (tabItemIndex > -1) {
            if (this._tabsView.items.length > tabItemIndex &&
                this._tabsView.selectedIndex !== tabItemIndex) {
                this._tabsView.selectedIndex = tabItemIndex;
            }
        }
    };
    TabsContainer.prototype.getItemCaption = function (tabItemName) {
        var matchingItem = this.items.find(function (item) {
            return item.name === tabItemName;
        });
        if (matchingItem) {
            return matchingItem.view().title;
        }
        else {
            Logger_1.Logger.instance.ui.warn(Logger_1.Logger.GETITEMCAPTION_TAB_ITEM_NOT_FOUND, tabItemName);
        }
        return '';
    };
    TabsContainer.prototype.getSelectedTabItemName = function () {
        var selectedIndex = this._tabsView.selectedIndex;
        var selectedItem = this._tabsView.tabStrip ?
            this._tabsView.tabStrip.items && this._tabsView.tabStrip.items.length > selectedIndex ?
                this._tabsView.tabStrip.items[this._tabsView.selectedIndex] : null : null;
        if (selectedItem) {
            return selectedItem.id;
        }
        return '';
    };
    TabsContainer.prototype.getSelectedTabItemIndex = function () {
        return this._tabsView.selectedIndex;
    };
    TabsContainer.prototype.resetSelectedTabContentItem = function () {
        var selectedIndex = this._tabsView.selectedIndex;
        var navData = {};
        navData.PageToOpen = this._tabsItemsDefs[selectedIndex].pageToOpen;
        navData.ClearHistory = true;
        navData.Transition = { Name: 'None' };
        navData.InnerNavigation = true;
        var navActionDef = new NavigationActionDefinition_1.NavigationActionDefinition('', navData);
        var navAction = new NavigationAction_1.NavigationAction(navActionDef);
        navAction.execute();
    };
    TabsContainer.prototype.getTabsPostion = function () {
        return this._tabsView.tabsPosition;
    };
    TabsContainer.prototype._createTabItems = function (newItemDefs) {
        var _this = this;
        var promises = [];
        var itemIndex = 0;
        newItemDefs.forEach(function (itemDef) {
            promises.push(_this._createTabItem(itemDef, itemIndex));
            itemIndex++;
        });
        return Promise.all(promises).then(function (newItems) {
            return newItems;
        }).catch(function (e) {
            Logger_1.Logger.instance.ui.log('error on _createTabItems: ' + e.message);
        });
    };
    TabsContainer.prototype._createTabItemView = function (tabItemDef, idx) {
        var _this = this;
        var tabItemStackLayout;
        var tabItemFrame;
        var pageDefPromise;
        if (tabItemDef.pageToOpen) {
            pageDefPromise = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(tabItemDef.pageToOpen);
        }
        else {
            var nameVal = 'Tab_' + TabsContainer._pageName.toString();
            pageDefPromise = Promise.resolve(new PageDefinition_1.PageDefinition('', { _Name: nameVal }));
            TabsContainer._pageName++;
        }
        return pageDefPromise.then(function (pageDef) {
            if (pageDef) {
                var tabPage_2 = PageRenderer_1.PageRenderer.createInitialPage(pageDef);
                tabPage_2.isTabsTabPage = true;
                tabPage_2.actionBarHidden = true;
                var id = undefined;
                if (_this.page().targetFrameId) {
                    if (FlexibleColumnFrame_1.FlexibleColumnFrame.isFlexibleColumnFrame(_this.page().targetFrameId)) {
                        id = _this._tabsView.id + "_Tab_" + tabItemDef.name + '_' + idx.toString();
                    }
                }
                tabItemFrame = new TabFrame_1.TabFrame(_this.page(), id, false);
                tabItemFrame.initialPage = tabPage_2;
                tabItemFrame.actionBarVisibility = 'never';
                tabItemFrame.navigate({
                    create: function () {
                        return tabPage_2;
                    },
                });
                tabItemStackLayout = new stack_layout_1.StackLayout();
                tabItemStackLayout.addChild(tabItemFrame);
            }
            return tabItemStackLayout;
        });
    };
    TabsContainer.prototype._createTabItem = function (newItemDef, newItemIndex) {
        var newItem = IControlFactory_1.IControlFactory.Create(this.page(), this.context, null, newItemDef);
        newItem.parent = this;
        return newItem.createTabItem(newItemDef, newItemIndex);
    };
    TabsContainer._pageName = 1;
    return TabsContainer;
}(BaseControl_1.BaseControl));
exports.TabsContainer = TabsContainer;
;
