"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IControlFactory_1 = require("./IControlFactory");
var Logger_1 = require("../utils/Logger");
var BaseControl_1 = require("./BaseControl");
var StackLayoutStrategy_1 = require("./StackLayoutStrategy");
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var TabFrame_1 = require("../pages/TabFrame");
var PageRenderer_1 = require("../pages/PageRenderer");
var bottom_navigation_1 = require("tns-core-modules/ui/bottom-navigation");
var tabs_1 = require("tns-core-modules/ui/tabs");
var tab_strip_1 = require("tns-core-modules/ui/tab-navigation-base/tab-strip");
var tab_content_item_1 = require("tns-core-modules/ui/tab-navigation-base/tab-content-item");
var NavigationActionDefinition_1 = require("../definitions/actions/NavigationActionDefinition");
var NavigationAction_1 = require("../actions/NavigationAction");
var PageDefinition_1 = require("../definitions/PageDefinition");
var TabControlBaseDataBuilder_1 = require("../builders/ui/TabControlBaseDataBuilder");
var PageContentFactory_1 = require("./PageContentFactory");
var ExecuteSource_1 = require("../common/ExecuteSource");
var BottomNavigationContainer = (function (_super) {
    __extends(BottomNavigationContainer, _super);
    function BottomNavigationContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._tabItems = [];
        return _this;
    }
    BottomNavigationContainer.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
        this._bottomNavigationDefs = this.definition();
        if (this._bottomNavigationDefs.hideTabStrips) {
            this._bottomNavigationView = new tabs_1.Tabs();
            this._bottomNavigationView.swipeEnabled = false;
            this._bottomNavigationView.selectedIndex = this._bottomNavigationDefs.selectedIndex;
        }
        else {
            this._bottomNavigationView = new bottom_navigation_1.BottomNavigation();
        }
        this._bottomNavigationView.id = this.page().id + '_BottomNavigation';
    };
    BottomNavigationContainer.prototype.bind = function () {
        var _this = this;
        var tabContentItem = new tab_content_item_1.TabContentItem();
        var contentItems = [];
        var builder = new TabControlBaseDataBuilder_1.TabControlBaseDataBuilder(this.context);
        builder.setStyles(this._bottomNavigationDefs.styles);
        return builder.build().then(function (data) {
            var tabStripClassName;
            if (data.styles) {
                if (data.styles.hasOwnProperty('TabStrip')) {
                    if (typeof data.styles.TabStrip === 'string') {
                        tabStripClassName = data.styles.TabStrip;
                    }
                }
            }
            _this._bottomNavigationItemsDefs = _this.definition().getItems();
            _this._bottomNavigationView.on('selectedIndexChanged', function (dataArgs) {
                if (_this._tabPages.length - 1 >= dataArgs.newIndex &&
                    _this._bottomNavigationItemsDefs.length - 1 >= dataArgs.newIndex) {
                    var tabPage_1 = _this._tabPages[dataArgs.newIndex];
                    if (!tabPage_1.content) {
                        if (_this._bottomNavigationItemsDefs[dataArgs.newIndex].pageToOpen) {
                            IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(_this._bottomNavigationItemsDefs[dataArgs.newIndex].pageToOpen).then(function (pageDef) {
                                if (_this._bottomNavigationItemPageDefs &&
                                    _this._bottomNavigationItemPageDefs.length - 1 >= dataArgs.newIndex) {
                                    _this._bottomNavigationItemPageDefs[dataArgs.newIndex] = pageDef;
                                }
                                _this._createTabPageContent(tabPage_1, pageDef);
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
            _this._bottomNavigationItemPageDefs = [];
            var tabItemFramePromises = [];
            _this._bottomNavigationItemsDefs.forEach(function (tabItemDef, idx) {
                tabItemFramePromises.push(_this._createTabItemView(tabItemDef, idx));
                _this._bottomNavigationItemPageDefs.push({});
            });
            return Promise.all(tabItemFramePromises).then(function (tabItemFrames) {
                tabItemFrames.forEach(function (itemFrame) {
                    if (itemFrame) {
                        tabContentItem = new tab_content_item_1.TabContentItem();
                        tabContentItem.content = itemFrame;
                        contentItems.push(tabContentItem);
                        _this._tabPages.push(itemFrame.initialPage);
                    }
                });
                return _this._createTabItems(_this._bottomNavigationItemsDefs).then(function (tabItems) {
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
                    if (!_this._bottomNavigationDefs.hideTabStrips) {
                        _this._bottomNavigationView.tabStrip = tabStrip;
                    }
                    else {
                        Logger_1.Logger.instance.ui.info('Bottom Nav will be programatically controlled & tab strips are to be hidden - ', _this._bottomNavigationDefs.HideTabStrips);
                        _this.hiddenTabStrip = tabStrip;
                    }
                    _this._bottomNavigationView.items = contentItems;
                });
            });
        });
    };
    BottomNavigationContainer.prototype.redraw = function () {
        var _this = this;
        return this._createTabItems(this._bottomNavigationItemsDefs).then(function (tabItems) {
            if (tabItems.length === _this._tabItems.length &&
                _this._bottomNavigationView.tabStrip && _this._bottomNavigationView.tabStrip.items &&
                _this._tabItems.length === _this._bottomNavigationView.tabStrip.items.length) {
                var tabItemView = void 0;
                for (var i = 0; i < _this._tabItems.length; i++) {
                    tabItemView = tabItems[i].view();
                    if (tabItemView) {
                        _this._bottomNavigationView.tabStrip.items[i].title = tabItemView.title;
                        if (tabItemView.iconSource) {
                            _this._bottomNavigationView.tabStrip.items[i].iconSource = tabItemView.iconSource;
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
    BottomNavigationContainer.prototype.view = function () {
        return this._bottomNavigationView;
    };
    Object.defineProperty(BottomNavigationContainer.prototype, "items", {
        get: function () {
            return this._tabItems;
        },
        enumerable: true,
        configurable: true
    });
    BottomNavigationContainer.prototype.setStyle = function (style, target) {
        if (style) {
            if ((target && typeof target === 'string' && target === 'TabStrip') || !target) {
                this.view().tabStrip.className = style;
            }
        }
    };
    BottomNavigationContainer.prototype.setItemCaption = function (tabItemName, newCaption) {
        var found = false;
        if (this._bottomNavigationView.tabStrip && this._bottomNavigationView.tabStrip.items &&
            this._tabItems.length === this._bottomNavigationView.tabStrip.items.length) {
            var i = 0;
            for (var _i = 0, _a = this._tabItems; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.name === tabItemName) {
                    found = true;
                    this._bottomNavigationView.tabStrip.items[i].title = newCaption;
                    break;
                }
                i++;
            }
        }
        if (!found) {
            Logger_1.Logger.instance.ui.warn(Logger_1.Logger.SETITEMCAPTION_TAB_ITEM_NOT_FOUND, tabItemName);
        }
    };
    BottomNavigationContainer.prototype.setSelectedTabItemByName = function (tabItemName) {
        var matchingItem = this.items.find(function (item) {
            return item.name === tabItemName;
        });
        this.setSelectedTabItemByIndex(matchingItem.index);
    };
    BottomNavigationContainer.prototype.setSelectedTabItemByIndex = function (tabItemIndex) {
        if (tabItemIndex > -1) {
            if (this._bottomNavigationView.items.length > tabItemIndex &&
                this._bottomNavigationView.selectedIndex !== tabItemIndex) {
                this._bottomNavigationView.selectedIndex = tabItemIndex;
            }
        }
    };
    BottomNavigationContainer.prototype.getItemCaption = function (tabItemName) {
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
    BottomNavigationContainer.prototype.getSelectedTabItemName = function () {
        var selectedIndex = this._bottomNavigationView.selectedIndex;
        var tabStrip = this._bottomNavigationView.tabStrip ? this._bottomNavigationView.tabStrip : this.hiddenTabStrip;
        var selectedItem = tabStrip ? tabStrip.items && tabStrip.items.length > selectedIndex ?
            tabStrip.items[this._bottomNavigationView.selectedIndex] : null : null;
        if (selectedItem) {
            return selectedItem.id;
        }
        return '';
    };
    BottomNavigationContainer.prototype.getSelectedTabItemIndex = function () {
        return this._bottomNavigationView.selectedIndex;
    };
    BottomNavigationContainer.prototype.resetSelectedTabContentItem = function () {
        var selectedIndex = this._bottomNavigationView.selectedIndex;
        if (this._bottomNavigationItemsDefs[selectedIndex].pageToOpen) {
            var navData = {};
            navData.PageToOpen = this._bottomNavigationItemsDefs[selectedIndex].pageToOpen;
            navData.ClearHistory = true;
            navData.Transition = { Name: 'None' };
            var navActionDef = new NavigationActionDefinition_1.NavigationActionDefinition('', navData);
            var navAction = new NavigationAction_1.NavigationAction(navActionDef);
            if (this._bottomNavigationDefs.hideTabStrips && this._bottomNavigationItemPageDefs &&
                this._bottomNavigationItemPageDefs.length > selectedIndex) {
                var itemPageDef = this._bottomNavigationItemPageDefs[selectedIndex];
                var itemDef = this._bottomNavigationItemsDefs[selectedIndex];
                if (itemPageDef && itemPageDef !== {} &&
                    itemPageDef.getBottomNavigation() && itemDef) {
                    navAction.source = new ExecuteSource_1.ExecuteSource(itemDef.getName());
                }
            }
            navAction.execute();
        }
    };
    BottomNavigationContainer.prototype._createTabItems = function (newItemDefs) {
        var _this = this;
        var promises = [];
        var itemIndex = 0;
        newItemDefs.forEach(function (itemDef) {
            promises.push(_this._createTabItem(itemDef, itemIndex));
            itemIndex++;
        });
        return Promise.all(promises).then(function (newItems) {
            return newItems;
        });
    };
    BottomNavigationContainer.prototype._createTabItemView = function (tabItemDef, idx) {
        var _this = this;
        var tabItemFrame;
        var pageDefPromise;
        if (tabItemDef.pageToOpen) {
            pageDefPromise = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(tabItemDef.pageToOpen);
        }
        else {
            var nameVal = 'BottomNavTab_' + BottomNavigationContainer._pageName.toString();
            pageDefPromise = Promise.resolve(new PageDefinition_1.PageDefinition('', { _Name: nameVal }));
            BottomNavigationContainer._pageName++;
        }
        return pageDefPromise.then(function (pageDef) {
            if (pageDef) {
                var tabPage_2 = PageRenderer_1.PageRenderer.createInitialPage(pageDef);
                if (_this._bottomNavigationDefs.hideTabStrips) {
                    tabItemFrame = new TabFrame_1.TabFrame(_this.page(), tabItemDef.name);
                }
                else {
                    var id = undefined;
                    var flexibleColumnLayout = pageDef.getFlexibleColumnLayout();
                    if (flexibleColumnLayout) {
                        id = _this._bottomNavigationView.id + "_" + tabItemDef.name + '_' + idx.toString();
                    }
                    tabItemFrame = new TabFrame_1.TabFrame(_this.page(), id);
                }
                tabItemFrame.initialPage = tabPage_2;
                tabItemFrame.navigate({
                    create: function () {
                        return tabPage_2;
                    },
                });
            }
            return tabItemFrame;
        });
    };
    BottomNavigationContainer.prototype._createTabItem = function (newItemDef, newItemIndex) {
        var newItem = IControlFactory_1.IControlFactory.Create(this.page(), this.context, null, newItemDef);
        newItem.parent = this;
        return newItem.createTabItem(newItemDef, newItemIndex);
    };
    BottomNavigationContainer.prototype._createTabPageContent = function (tabPage, pageDef) {
        var _this = this;
        var fclDef = pageDef.getFlexibleColumnLayout();
        var bnDef = pageDef.getBottomNavigation();
        if (fclDef || bnDef) {
            this._pageContentFactory = new PageContentFactory_1.PageContentFactory(tabPage, tabPage.context, pageDef, null);
            this._pageContentFactory.createContentAsync();
        }
        else {
            this._stackLayoutFactory = new StackLayoutStrategy_1.StackLayoutStrategy(tabPage, tabPage.context, pageDef, null);
            setTimeout(function () {
                _this._stackLayoutFactory.createLayoutAsync();
            }, 500);
        }
    };
    BottomNavigationContainer._pageName = 1;
    return BottomNavigationContainer;
}(BaseControl_1.BaseControl));
exports.BottomNavigationContainer = BottomNavigationContainer;
;
