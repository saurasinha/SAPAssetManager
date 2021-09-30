"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scroll_view_1 = require("tns-core-modules/ui/scroll-view");
var nativescript_ui_sidedrawer_1 = require("nativescript-ui-sidedrawer");
var label_1 = require("tns-core-modules/ui/label");
var image_1 = require("tns-core-modules/ui/image");
var stack_layout_1 = require("tns-core-modules/ui/layouts/stack-layout");
var stack_layout_2 = require("@nativescript-rtl/ui/stack-layout");
var EventHandler_1 = require("./../EventHandler");
var ExecuteSource_1 = require("../common/ExecuteSource");
var Context_1 = require("../context/Context");
var PageRenderer_1 = require("../pages/PageRenderer");
var PageDefinition_1 = require("../definitions/PageDefinition");
var MDKPage_1 = require("../pages/MDKPage");
var tab_strip_item_1 = require("tns-core-modules/ui/tab-navigation-base/tab-strip-item");
var BaseControl_1 = require("./BaseControl");
var gestures_1 = require("tns-core-modules/ui/gestures");
var SideDrawerItemDefinition_1 = require("../definitions/controls/SideDrawer/SideDrawerItemDefinition");
var SideDrawerDataBuilder_1 = require("../builders/ui/SideDrawer/SideDrawerDataBuilder");
var SideDrawerHeaderDataBuilder_1 = require("../builders/ui/SideDrawer/SideDrawerHeaderDataBuilder");
var SideDrawerSectionDataBuilder_1 = require("../builders/ui/SideDrawer/SideDrawerSectionDataBuilder");
var SideDrawerItemDataBuilder_1 = require("../builders/ui/SideDrawer/SideDrawerItemDataBuilder");
var ImageHelper_1 = require("../utils/ImageHelper");
var utils = require("tns-core-modules/utils/utils");
var enums_1 = require("tns-core-modules/ui/enums");
var ValueResolver_1 = require("../utils/ValueResolver");
var AppSettingsManager_1 = require("../utils/AppSettingsManager");
var app = require("tns-core-modules/application");
var MDKNavigationType_1 = require("../common/MDKNavigationType");
var SideDrawerObservable_1 = require("../observables/SideDrawerObservable");
var PropertyTypeChecker_1 = require("../utils/PropertyTypeChecker");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var DataHelper_1 = require("../utils/DataHelper");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var Logger_1 = require("../utils/Logger");
var mdk_sap_1 = require("mdk-sap");
var image_source_1 = require("tns-core-modules/image-source");
var CssPropertyParser_1 = require("../utils/CssPropertyParser");
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var TabFrame_1 = require("../pages/TabFrame");
var MDKFrame_1 = require("../pages/MDKFrame");
var platform_1 = require("tns-core-modules/platform");
var I18nHelper_1 = require("../utils/I18nHelper");
var SideDrawer = (function (_super) {
    __extends(SideDrawer, _super);
    function SideDrawer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._imageFontIconClassName = 'sap-icons';
        _this._selectedItem = [0, 0];
        _this.MENU_ITEM_IMAGE_WIDTH = 96;
        _this.MENU_ITEM_IMAGE_HEIGHT = 96;
        _this.HEADER_ICON_HEIGHT = 100;
        _this.HEADER_ICON_WIDTH = 100;
        _this.PNG_BASE64_PREFIX = 'data:image/png;base64;alwaystemplate,';
        _this._resolvedDefinition = {};
        _this._lightIdentifier = '-light';
        _this._darkIdentifier = '-dark';
        _this.blankMainPage = false;
        _this.blankItemSelected = false;
        _this.blankItemIndexPath = undefined;
        _this.blankItemModalAnchorPage = null;
        _this.staleDataChanged = false;
        _this._swipeInitiated = false;
        _this._needsBottomNavRedraw = false;
        _this._currentDrawerItems = [];
        _this._isItemsDefinedFromRule = false;
        _this._shellPage = null;
        _this._visibility = false;
        return _this;
    }
    SideDrawer.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
        this.observable();
        this._radSideDrawerView = new nativescript_ui_sidedrawer_1.RadSideDrawer();
        this._drawerContentView = new stack_layout_1.StackLayout();
        this._radSideDrawerView.drawerContent = this._drawerContentView;
        this._radSideDrawerView.on('onLoaded', this.onLoaded);
        this._radSideDrawerView.on(nativescript_ui_sidedrawer_1.RadSideDrawer.drawerPanEvent, this.onDrawerSwipe, this);
        this._radSideDrawerView.on(nativescript_ui_sidedrawer_1.RadSideDrawer.drawerOpenedEvent, this.onDrawerOpened, this);
        this._radSideDrawerView.on(nativescript_ui_sidedrawer_1.RadSideDrawer.drawerClosedEvent, this.onDrawerClosed, this);
    };
    SideDrawer.prototype.bind = function () {
        var _this = this;
        if (app.ios || app.android) {
            return this.resolveDrawerDefinition(this.definition()).then(function () {
                return _this.createDrawer();
            });
        }
        else {
            return Promise.resolve();
        }
    };
    SideDrawer.prototype.renderMainPage = function () {
        var _this = this;
        this._resetDrawerState();
        var firstVisibleMenuItemIndexPath = [0, 0];
        return this.bind().then(function () {
            var sectionIndex = 0;
            while (sectionIndex < _this._resolvedDefinition.sections.length) {
                var section_1 = _this._resolvedDefinition.sections[sectionIndex];
                if (section_1.visible && section_1.items.length > 0) {
                    var itemIndex = 0;
                    while (itemIndex < section_1.items.length) {
                        var item = section_1.items[itemIndex];
                        if (item.visible) {
                            firstVisibleMenuItemIndexPath = [sectionIndex, itemIndex];
                            break;
                        }
                        itemIndex++;
                    }
                    break;
                }
                sectionIndex++;
            }
            _this._selectedMenuItemName = _this._resolvedDefinition.sections[firstVisibleMenuItemIndexPath[0]].items[firstVisibleMenuItemIndexPath[1]].name;
            _this._selectedItem = firstVisibleMenuItemIndexPath;
            if (_this._clearHistory) {
                _this.setMenuItemAsActive(_this._selectedItem[0], _this._selectedItem[1]);
                return _this.navigateToSelectedItem(_this._selectedItem[0], _this._selectedItem[1]);
            }
            else {
                return _this.buildNavStackForMenus();
            }
        }).then(function (navigationEntry) {
            _this.executeOnPressActionFromMenuItem(_this._selectedMenuItemName);
            return navigationEntry;
        });
    };
    SideDrawer.prototype.executeOnPressActionFromMenuItem = function (name) {
        var _this = this;
        var indexPath = this.getMenuItemIndexPathFromName(name);
        var firstMenuItemDef = this._resolvedDefinition.sections[indexPath[0]].items[indexPath[1]];
        if (firstMenuItemDef.action !== undefined) {
            var timeout = this._clearHistory ? 0 : 1500;
            setTimeout(function () {
                if (!firstMenuItemDef.pageToOpen) {
                    _this.blankMainPage = true;
                }
                return _this.executeOnPressActionOrRule(firstMenuItemDef).then(function (result) {
                    _this.blankMainPage = false;
                    return result;
                }).catch(function (error) {
                    _this.blankMainPage = false;
                    throw error;
                });
            }, timeout);
        }
    };
    SideDrawer.prototype.view = function () {
        return this._radSideDrawerView;
    };
    SideDrawer.prototype.closeDrawer = function () {
        this._radSideDrawerView.closeDrawer();
    };
    SideDrawer.prototype.showDrawer = function () {
        this.updateSideDrawer();
        this._radSideDrawerView.showDrawer();
    };
    SideDrawer.prototype.getItemsCountPerSection = function () {
        var itemsCountPerSection = [];
        this._resolvedDefinition.sections.map(function (section) {
            itemsCountPerSection.push(section.items.length);
        });
        return itemsCountPerSection;
    };
    Object.defineProperty(SideDrawer.prototype, "isVisible", {
        get: function () {
            return this._visibility;
        },
        enumerable: true,
        configurable: true
    });
    SideDrawer.prototype.redrawStaleDataChanged = function () {
        if (this.staleDataChanged) {
            this.redraw();
            this.staleDataChanged = false;
        }
    };
    SideDrawer.prototype.getSelectedMenuItemIndexPath = function () {
        return this.getMenuItemIndexPathFromName(this._selectedMenuItemName);
        ;
    };
    SideDrawer.prototype.getSelectedMenuItemName = function () {
        var name = undefined;
        var indexPath = this.getMenuItemIndexPathFromName(this._selectedMenuItemName);
        if (indexPath !== undefined) {
            name = this._selectedMenuItemName;
        }
        return name;
    };
    SideDrawer.prototype.setSelectedMenuItemByName = function (menuItemName) {
        var indexPath = this.getMenuItemIndexPathFromName(menuItemName);
        if (indexPath !== undefined) {
            this.setSelectedMenuItemByIndexPath(indexPath);
        }
        else {
            Logger_1.Logger.instance.ui.warn('Unable to find the item with name ' + menuItemName);
        }
    };
    SideDrawer.prototype.setSelectedMenuItemByIndexPath = function (menuItemIndexPath) {
        if (menuItemIndexPath[0] > -1 && menuItemIndexPath[1] > -1) {
            if (this.getSelectedMenuItemIndexPath() !== menuItemIndexPath) {
                this.menuItemSelected(menuItemIndexPath[0], menuItemIndexPath[1]);
                this._selectedMenuItemName = this._resolvedDefinition.sections[menuItemIndexPath[0]].items[menuItemIndexPath[1]].name;
            }
        }
    };
    SideDrawer.prototype.getSectionCaptions = function () {
        var sectionCaptions = [];
        var sectionIndex = 0;
        while (this.getSectionWithIndex(sectionIndex)) {
            var section_2 = this.getSectionWithIndex(sectionIndex);
            sectionCaptions.push(section_2.getChildAt(0).text);
            sectionIndex++;
        }
        return sectionCaptions;
    };
    SideDrawer.prototype.setSectionVisibilityAtIndex = function (sectionIndex, visibility) {
        this.definition().sections[sectionIndex].visibility = visibility;
        var section = this.getSectionWithIndex(sectionIndex);
        if (visibility) {
            section.visibility = 'visible';
        }
        else {
            section.visibility = 'collapse';
        }
    };
    SideDrawer.prototype.getMenuItemCaption = function (indexPath) {
        var itemView = this.getItemWithIndexPath(indexPath[0], indexPath[1]);
        var labelIndex = itemView.getChildrenCount() == 2 ? 1 : 0;
        return itemView.getChildAt(labelIndex).text;
    };
    SideDrawer.prototype.setMenuItemCaption = function (indexPath, caption) {
        this.definition().sections[indexPath[0]].items[indexPath[1]].title = caption;
        var itemView = this.getItemWithIndexPath(indexPath[0], indexPath[1]);
        var labelIndex = itemView.getChildrenCount() == 2 ? 1 : 0;
        itemView.getChildAt(labelIndex).text = caption;
    };
    SideDrawer.prototype.setMenuItemVisibility = function (indexPath, visibility) {
        this.definition().sections[indexPath[0]].items[indexPath[1]].visible = visibility;
        var itemView = this.getItemWithIndexPath(indexPath[0], indexPath[1]);
        if (visibility) {
            itemView.visibility = 'visible';
        }
        else {
            itemView.visibility = 'collapse';
        }
    };
    SideDrawer.prototype.redraw = function () {
        this.bind();
    };
    SideDrawer.prototype.navigateToBlankFrame = function (sectionIdx, index) {
        var frameIdx = this.getMenuItemIndexFromIndexPath(sectionIdx, index);
        this.navigateToFrame(frameIdx);
        return this.getFrameId();
    };
    SideDrawer.prototype.createObservable = function () {
        return new SideDrawerObservable_1.SideDrawerObservable(this, this.definition(), undefined);
    };
    SideDrawer.prototype.onLoaded = function () {
        this.view().onLoaded();
        this.view().allowEdgeSwipe = true;
    };
    SideDrawer.prototype.onDrawerSwipe = function (args) {
        if (!this._swipeInitiated) {
            this.updateSideDrawer();
            this._swipeInitiated = true;
        }
    };
    SideDrawer.prototype.onDrawerOpened = function (args) {
        this._visibility = true;
        this.redrawStaleDataChanged();
        if (app.android) {
            try {
                var fadeView = args.object.android.resolveFadeLayer().view();
                fadeView.setContentDescription(I18nHelper_1.I18nHelper.localizeMDKText('close_drawer'));
                var onClickListener = new android.view.View.OnClickListener({
                    onClick: function () {
                        args.object.closeDrawer();
                    },
                });
                fadeView.setOnClickListener(onClickListener);
            }
            catch (err) {
                Logger_1.Logger.instance.ui.error(Logger_1.Logger.FAILED_TO_SET_CLICK_LISTENER, err);
            }
        }
        this._swipeInitiated = false;
    };
    SideDrawer.prototype.onDrawerClosed = function (args) {
        this._visibility = false;
    };
    SideDrawer.prototype.updateSideDrawer = function () {
        var _this = this;
        this.checkifDrawerNeedsUpdate().then(function (needsUpdate) {
            if (needsUpdate) {
                _this._currentDrawerItems = _this.getDrawerItemsArray();
                _this.resetSideDrawer();
                _this.redrawSideDrawerUI();
            }
        });
    };
    SideDrawer.prototype.redrawSideDrawerUI = function () {
        var _this = this;
        this.createDrawer().then(function () {
            var indexPath = _this.getMenuItemIndexPathFromName(_this._selectedMenuItemName);
            if (indexPath !== undefined) {
                _this.setMenuItemAsActive(indexPath[0], indexPath[1]);
            }
            else {
                Logger_1.Logger.instance.ui.warn('Unable to find the item with name ' + _this._selectedMenuItemName);
            }
        });
    };
    SideDrawer.prototype.resetSideDrawer = function () {
        this._resetDrawerState();
        this._menuItemDefnsForTabs = undefined;
        if (!this._clearHistory) {
            this._needsBottomNavRedraw = true;
        }
    };
    SideDrawer.prototype.recreateBottomNav = function () {
        this.buildNavStackForMenus();
        this.executeOnPressActionFromMenuItem(this._selectedMenuItemName);
    };
    SideDrawer.prototype.checkifDrawerNeedsUpdate = function () {
        var _this = this;
        if (this._isItemsDefinedFromRule) {
            return this.resolveDrawerDefinition(this.definition()).then(function () {
                var newItemsArray = _this.getDrawerItemsArray();
                if (newItemsArray.length !== _this._currentDrawerItems.length) {
                    return true;
                }
                else {
                    for (var i = 0; i < newItemsArray.length; i++) {
                        if (newItemsArray[i].name !== _this._currentDrawerItems[i].name) {
                            return true;
                        }
                    }
                }
                return false;
            });
        }
        else {
            return Promise.resolve(false);
        }
    };
    SideDrawer.prototype.getBottomNavSelectionItemIndex = function () {
        var indexPath = this.getMenuItemIndexPathFromName(this._selectedMenuItemName);
        return this.getMenuItemIndexFromIndexPath(indexPath[0], indexPath[1]);
    };
    SideDrawer.prototype.getDrawerItemsArray = function () {
        var itemsDefnArray = [];
        if (this._resolvedDefinition.sections.length > 0) {
            for (var _i = 0, _a = this._resolvedDefinition.sections; _i < _a.length; _i++) {
                var section_3 = _a[_i];
                itemsDefnArray = itemsDefnArray.concat(section_3.items);
            }
        }
        return itemsDefnArray;
    };
    SideDrawer.prototype.getItemWithIndexPath = function (sectionIdx, idx) {
        var sectionView = this.getSectionWithIndex(sectionIdx);
        var itemIndex = idx;
        if (sectionView.getChildAt(0).typeName === 'Label') {
            itemIndex++;
        }
        return sectionView.getChildAt(itemIndex);
    };
    SideDrawer.prototype.getSectionWithIndex = function (sectionIdx) {
        return this.getMenuView().getChildAt(sectionIdx);
    };
    SideDrawer.prototype.getMenuView = function () {
        var menuViewIndex = this.definition().header ? 1 : 0;
        return this._radSideDrawerView.drawerContent.getChildAt(menuViewIndex).content;
    };
    SideDrawer.prototype.getMenuItemIndexFromIndexPath = function (sectionIdx, itemIndex) {
        var totalNumOfItemsInPrevSections = 0;
        var idx = sectionIdx;
        while (idx !== 0) {
            totalNumOfItemsInPrevSections += this._resolvedDefinition.sections[idx - 1].items.length;
            idx--;
        }
        return totalNumOfItemsInPrevSections + itemIndex;
    };
    SideDrawer.prototype.getMenuItemIndexPathFromName = function (menuItemName) {
        var _this = this;
        var itemsCountPerSection = this.getItemsCountPerSection();
        var indexPath = undefined;
        itemsCountPerSection.map(function (count, sectionIndex) {
            for (var itemIndex = 0; itemIndex < count; itemIndex++) {
                var item = _this.getItemWithIndexPath(sectionIndex, itemIndex);
                if (item.id === menuItemName) {
                    indexPath = [sectionIndex, itemIndex];
                    break;
                }
            }
        });
        return indexPath;
    };
    SideDrawer.prototype.resolveDrawerDefinition = function (drawerDef) {
        var _this = this;
        this._resolvedDefinition = {};
        var drawerBuilder = new SideDrawerDataBuilder_1.SideDrawerDataBuilder(this.context);
        drawerBuilder.setName(drawerDef.name)
            .setClearHistory(drawerDef.clearHistory)
            .setStyles(drawerDef.styles);
        this._resolvedDefinition.sections = [];
        return drawerBuilder.build().then(function (drawerData) {
            _this._drawerContentView.id = drawerData.name;
            _this._clearHistory = drawerData.clearHistory;
            _this._styles = drawerData.styles;
            var sectionsDef = drawerDef.sections;
            var sectionPromises = [];
            var _loop_1 = function (sectionIdx) {
                var sectionDef = sectionsDef[sectionIdx];
                if (PropertyTypeChecker_1.PropertyTypeChecker.isRule(sectionDef.items) && !_this._isItemsDefinedFromRule) {
                    _this._isItemsDefinedFromRule = true;
                }
                var sectionBuilder = new SideDrawerSectionDataBuilder_1.SideDrawerSectionDataBuilder(_this.context);
                sectionBuilder.setName(sectionDef.name)
                    .setCaption(sectionDef.caption)
                    .setVisible(sectionDef.visible)
                    .setPreserveImageSpacing(sectionDef.preserveImageSpacing)
                    .setSeparatorEnabled(sectionDef.separatorEnabled)
                    .setStyles(sectionDef.styles);
                sectionPromises[sectionIdx] = sectionBuilder.build().then(function (sectionData) {
                    _this.updateResolvedSectionDefinition(sectionData, sectionIdx);
                    if (!(sectionDef.items instanceof Array)) {
                        return ValueResolver_1.ValueResolver.resolveValue(sectionDef.items, _this.context, true).then(function (resolvedItems) {
                            var itemDefns = [];
                            for (var idx = 0; idx < resolvedItems.length; idx++) {
                                var itemDefn = new SideDrawerItemDefinition_1.SideDrawerItemDefinition('', resolvedItems[idx]);
                                itemDefns.push(itemDefn);
                            }
                            _this._resolvedDefinition.sections[sectionIdx].items = itemDefns;
                        });
                    }
                    else {
                        _this._resolvedDefinition.sections[sectionIdx].items = sectionDef.items;
                    }
                });
            };
            for (var sectionIdx = 0; sectionIdx < sectionsDef.length; sectionIdx++) {
                _loop_1(sectionIdx);
            }
            return Promise.all(sectionPromises);
        });
    };
    SideDrawer.prototype.createDrawer = function () {
        var _this = this;
        var drawerLocation = this.isRtl === true ? nativescript_ui_sidedrawer_1.SideDrawerLocation.Right : nativescript_ui_sidedrawer_1.SideDrawerLocation.Left;
        this._radSideDrawerView.drawerLocation = drawerLocation;
        var drawerContentPromises = [];
        if (this.definition().header) {
            drawerContentPromises.push(this.createHeader(this.definition().header));
        }
        drawerContentPromises.push(this.createSections());
        return Promise.all(drawerContentPromises).then(function (drawerContentViews) {
            _this._drawerContentView.removeChildren();
            var sectionsView;
            if (_this.definition().header) {
                var headerView = drawerContentViews[0];
                _this._drawerContentView.addChild(headerView);
                sectionsView = drawerContentViews[1];
            }
            else {
                sectionsView = drawerContentViews[0];
            }
            var drawerItemsContainer = new scroll_view_1.ScrollView();
            drawerItemsContainer.orientation = enums_1.Orientation.vertical;
            drawerItemsContainer.content = sectionsView;
            drawerItemsContainer.height = 'auto';
            _this._drawerContentView.addChild(drawerItemsContainer);
            _this._drawerContentView.className = _this._getAppearanceStyle('drawerContent') + ' ' + (_this._styles ? _this._styles.DrawerBackground : '');
            _this.setMenuItemAsActive(_this._selectedItem[0], _this._selectedItem[1]);
        });
    };
    SideDrawer.prototype.createSections = function () {
        var drawerItemsStack = new stack_layout_1.StackLayout();
        var sectionPromises = [];
        for (var sectionIdx = 0; sectionIdx < this._resolvedDefinition.sections.length; sectionIdx++) {
            sectionPromises.push(this.createSection(sectionIdx));
        }
        return Promise.all(sectionPromises).then(function (sectionViews) {
            sectionViews.forEach(function (sectionView) {
                drawerItemsStack.addChild(sectionView);
            });
            return drawerItemsStack;
        });
    };
    SideDrawer.prototype.createHeader = function (headerDef) {
        var _this = this;
        return this.resolveData(headerDef).then(function (data) {
            var context = new Context_1.Context();
            context.binding = data;
            var headerBuilder = new SideDrawerHeaderDataBuilder_1.SideDrawerHeaderDataBuilder(context);
            headerBuilder.setIcon(headerDef.icon)
                .setIconIsCircular(headerDef.iconIsCircular)
                .setHeadline(headerDef.headline)
                .setSubHeadline(headerDef.subHeadline)
                .setAction(headerDef.action)
                .setDisableIconText(headerDef.disableIconText)
                .setAlignment(headerDef.alignment);
            var headerView = new stack_layout_1.StackLayout();
            headerView.setProperty('accessibilityRole', 'button');
            headerView.className = _this.getDefaultStyle('sidedrawer-header', app.ios ? false : true);
            headerView.className += ' ' + (_this._styles ? _this._styles.HeaderSeparator + ' ' + _this._styles.HeaderBackground : '');
            return headerBuilder.build().then(function (headerData) {
                if (headerData.action) {
                    headerView.on('tap', function () {
                        _this.executeOnPressActionOrRule(headerData);
                        _this.closeDrawer();
                    }, _this);
                }
                var headerIcon = new image_1.Image();
                if (app.android) {
                    headerIcon.className = _this.getClassNameForRtl('sidedrawer-header-icon');
                }
                else {
                    headerIcon.className = 'sidedrawer-header-icon';
                }
                if (headerData.iconIsCircular) {
                    headerIcon.borderRadius = _this.HEADER_ICON_WIDTH / 2;
                }
                headerView.addChild(headerIcon);
                if (headerData.icon && headerData.icon !== '') {
                    ImageHelper_1.ImageHelper.processIcon(headerData.icon, _this.HEADER_ICON_WIDTH, _this.HEADER_ICON_HEIGHT).then(function (resolvedIcon) {
                        if (resolvedIcon !== null) {
                            headerIcon.src = resolvedIcon;
                            if (utils.isFontIconURI(resolvedIcon)) {
                                headerIcon.className += ' ' + _this._imageFontIconClassName;
                            }
                        }
                        else {
                            _this.setHeaderIconWithTextIcon(headerView, headerIcon, headerData);
                        }
                    }).catch(function (error) {
                        Logger_1.Logger.instance.ui.error(Logger_1.Logger.SIDEDRAWER_HEADER_ICON_PARSE_FAILED, error, error ? error.stack : '');
                        _this.setHeaderIconWithTextIcon(headerView, headerIcon, headerData);
                    });
                }
                else {
                    _this.setHeaderIconWithTextIcon(headerView, headerIcon, headerData);
                }
                var headerHeadline = new label_1.Label();
                headerHeadline.text = headerData.headline;
                headerHeadline.className = 'sidedrawer-header-headline ' + (_this._styles ? _this._styles.HeaderHeadline : '');
                headerView.addChild(headerHeadline);
                var headerSubHeadline = new label_1.Label();
                headerSubHeadline.text = headerData.subHeadline;
                headerSubHeadline.className = _this._getAppearanceStyle('sidedrawer-header-subheadline') + ' ' + (_this._styles ? _this._styles.HeaderSubHeadline : '');
                headerView.addChild(headerSubHeadline);
                var custAlignment = _this.getHeaderAlignment(headerData.alignment);
                if (custAlignment !== null) {
                    headerIcon.style.horizontalAlignment = custAlignment;
                    headerHeadline.style.horizontalAlignment = custAlignment;
                    headerSubHeadline.style.horizontalAlignment = custAlignment;
                }
                return headerView;
            });
        });
    };
    SideDrawer.prototype.getHeaderIconTextStyles = function () {
        var fontSizeProperty = 'font-size';
        var fontColorProperty = 'color';
        var backgroundColorProperty = 'background-color';
        var parsedStyles = {};
        if (this._styles && this._styles.HeaderIcon) {
            var iconTextStyles = this._styles.HeaderIcon;
            var fontSize = CssPropertyParser_1.CssPropertyParser.getPropertyFromSelector(CssPropertyParser_1.Selectors.ClassSelector, iconTextStyles, fontSizeProperty);
            if (fontSize) {
                parsedStyles.FontSize = Number(fontSize);
            }
            var fontColor = CssPropertyParser_1.CssPropertyParser.getPropertyFromSelector(CssPropertyParser_1.Selectors.ClassSelector, iconTextStyles, fontColorProperty);
            if (fontColor) {
                parsedStyles.FontColor = fontColor;
            }
            var backgroundColor = CssPropertyParser_1.CssPropertyParser.getPropertyFromSelector(CssPropertyParser_1.Selectors.ClassSelector, iconTextStyles, backgroundColorProperty);
            if (backgroundColor) {
                parsedStyles.BackgroundColor = backgroundColor;
            }
        }
        return parsedStyles;
    };
    SideDrawer.prototype.setHeaderIconWithTextIcon = function (headerView, headerIcon, headerData) {
        if (!headerData.disableIconText && headerData.headline && headerData.headline !== '') {
            var iconTextStyles = this.getHeaderIconTextStyles();
            var iconTextInitials = ImageHelper_1.ImageHelper.getIconTextInitials(headerData.headline);
            var iconTextImage = mdk_sap_1.NativeImages.getInstance().getIconTextImage(iconTextInitials, this.HEADER_ICON_WIDTH / 3, this.HEADER_ICON_HEIGHT / 3, JSON.stringify(iconTextStyles));
            var imgSource = image_source_1.fromNativeSource(iconTextImage);
            var imgbase64String = this.PNG_BASE64_PREFIX + imgSource.toBase64String('png');
            ImageHelper_1.ImageHelper.processIcon(imgbase64String, this.HEADER_ICON_WIDTH, this.HEADER_ICON_WIDTH, headerData.iconIsCircular).then(function (resolvedIcon) {
                if (PropertyTypeChecker_1.PropertyTypeChecker.isFilePath(resolvedIcon)) {
                    if (ImageHelper_1.ImageHelper.fileExist(resolvedIcon)) {
                        headerIcon.src = resolvedIcon;
                    }
                }
            });
        }
        else {
            headerView.removeChild(headerIcon);
        }
    };
    SideDrawer.prototype.getHeaderAlignment = function (alignment) {
        switch (alignment) {
            case 'center':
                return enums_1.HorizontalAlignment.center;
            case 'right':
                return !this.isRtl ? enums_1.HorizontalAlignment.right : enums_1.HorizontalAlignment.left;
            case 'left':
                return !this.isRtl ? enums_1.HorizontalAlignment.left : enums_1.HorizontalAlignment.right;
            default:
                return null;
        }
    };
    SideDrawer.prototype.createSection = function (sectionIdx) {
        var sectionView = new stack_layout_1.StackLayout();
        sectionView.className = 'sidedrawer-section';
        var sectionData = this._resolvedDefinition.sections[sectionIdx];
        if (sectionData.separatorEnabled && sectionIdx !== this.definition().sections.length - 1) {
            var sectionSeparatorStyle = this._styles ? this._styles.SectionSeparator : '';
            sectionSeparatorStyle += sectionData.styles ? ' ' + sectionData.styles.SectionSeparator : '';
            sectionView.className += ' ' + this._getAppearanceStyle('sidedrawer-section-separator') + ' ' + sectionSeparatorStyle;
        }
        sectionView.id = sectionData.name;
        if (sectionData.visible === false) {
            sectionView.visibility = 'collapse';
        }
        if (sectionData.caption && sectionData.caption !== '') {
            var captionView = new label_1.Label();
            captionView.text = sectionData.caption;
            captionView.className = this.getDefaultStyle('sidedrawer-section-caption', true);
            var captionStyle = this._styles ? this._styles.SectionCaption : '';
            captionStyle += sectionData.styles ? ' ' + sectionData.styles.SectionCaption : '';
            captionView.className += ' ' + captionStyle;
            sectionView.addChild(captionView);
        }
        var itemPromises = [];
        for (var idx = 0; idx < sectionData.items.length; idx++) {
            itemPromises.push(this.createMenuItem(sectionData.items[idx], sectionIdx, idx, sectionData.preserveImageSpacing, sectionData.styles));
        }
        return Promise.all(itemPromises).then(function (itemViews) {
            itemViews.forEach(function (itemView) {
                sectionView.addChild(itemView);
            });
            return sectionView;
        });
    };
    SideDrawer.prototype.createMenuItem = function (itemDef, sectionIdx, idx, preserveImageSpacing, sectionStyles) {
        var _this = this;
        var itemBuilder = new SideDrawerItemDataBuilder_1.SideDrawerItemDataBuilder(this.context);
        itemBuilder.setName(itemDef.name)
            .setImage(itemDef.image)
            .setTitle(itemDef.title)
            .setAction(itemDef.action)
            .setVisible(itemDef.visible)
            .setPageToOpen(itemDef.pageToOpen)
            .setResetIfPressedWhenActive(itemDef.resetIfPressedWhenActive)
            .setTextAlignment(itemDef.textAlignment)
            .setStyles(itemDef.styles);
        var itemView = new stack_layout_2.StackLayout();
        itemView.setProperty('accessibilityRole', 'button');
        itemView.isRtl = this.isRtl;
        return itemBuilder.build().then(function (itemData) {
            itemView.orientation = enums_1.Orientation.horizontal;
            itemView.className = _this.getDefaultStyle('sidedrawer-list-item', false);
            var itemInactiveStyle = _this._styles ? _this._styles.SectionItemInactive : '';
            itemInactiveStyle += (sectionStyles && sectionStyles.SectionItemInactive) ? ' ' + sectionStyles.SectionItemInactive : '';
            itemInactiveStyle += (itemData.styles && itemData.styles.SectionItemInactive) ? ' ' + itemData.styles.SectionItemInactive : '';
            itemView.className += ' ' + itemInactiveStyle;
            itemView.id = itemData.name;
            if (itemData.image !== undefined || preserveImageSpacing === true) {
                var itemImage_1 = new image_1.Image();
                itemImage_1.className = 'sidedrawer-list-item-icon';
                itemView.addChild(itemImage_1);
                if (itemData.image && itemData.image !== '') {
                    ImageHelper_1.ImageHelper.processIcon(itemData.image, _this.MENU_ITEM_IMAGE_WIDTH, _this.MENU_ITEM_IMAGE_HEIGHT).then(function (resolvedImage) {
                        if (resolvedImage !== null) {
                            itemImage_1.src = resolvedImage;
                            if (utils.isFontIconURI(resolvedImage)) {
                                itemImage_1.className += ' ' + _this._imageFontIconClassName;
                            }
                        }
                        else if (preserveImageSpacing !== true) {
                            itemView.removeChild(itemImage_1);
                        }
                    });
                }
            }
            var itemLabel = new label_1.Label();
            itemLabel.className = 'sidedrawer-list-item-title';
            if (itemData.textAlignment !== undefined) {
                itemLabel.textAlignment = _this.getTextAlignment(itemData.textAlignment);
            }
            if (app.ios) {
                itemLabel.className = _this.getClassNameForRtl('sidedrawer-list-item-title');
            }
            itemLabel.text = itemData.title;
            itemView.addChild(itemLabel);
            if (itemData.visible === false) {
                itemView.visibility = 'collapse';
            }
            var touchObserver = new gestures_1.GesturesObserver(itemView, function (args) {
                var action = args.action;
                if (action === 'down') {
                    _this.setMenuItemOnPressStyle(sectionIdx, idx);
                }
                else if (action === 'up') {
                    _this.clearMenuItemOnPressStyle(sectionIdx, idx);
                }
            }, _this);
            touchObserver.observe(gestures_1.GestureTypes.touch);
            itemView.on('tap', function () {
                _this._selectedMenuItemName = itemView.id;
                if (_this._needsBottomNavRedraw) {
                    _this._needsBottomNavRedraw = false;
                    _this.recreateBottomNav();
                }
                else {
                    _this.menuItemSelected(sectionIdx, idx);
                }
                _this.closeDrawer();
            }, _this);
            var menuItemDefnForTab = {
                _Name: itemData.name,
                PageToOpen: itemData.pageToOpen,
                _Type: "Control.Type.TabItem",
                ResetIfPressedWhenActive: itemData.resetIfPressedWhenActive
            };
            if (_this._menuItemDefnsForTabs === undefined) {
                _this._menuItemDefnsForTabs = [];
            }
            var tabItemIndex = _this.getMenuItemIndexFromIndexPath(sectionIdx, idx);
            _this._menuItemDefnsForTabs[tabItemIndex] = menuItemDefnForTab;
            return itemView;
        });
    };
    SideDrawer.prototype.updateResolvedSectionDefinition = function (sectionData, sectionIdx) {
        this._resolvedDefinition.sections[sectionIdx] = {};
        this._resolvedDefinition.sections[sectionIdx].name = sectionData.name;
        this._resolvedDefinition.sections[sectionIdx].caption = sectionData.caption;
        this._resolvedDefinition.sections[sectionIdx].preserveImageSpacing = sectionData.preserveImageSpacing;
        this._resolvedDefinition.sections[sectionIdx].visible = sectionData.visible;
        this._resolvedDefinition.sections[sectionIdx].styles = sectionData.styles;
        this._resolvedDefinition.sections[sectionIdx].separatorEnabled = sectionData.separatorEnabled;
        this._resolvedDefinition.sections[sectionIdx].items = [];
    };
    SideDrawer.prototype.getClassNameForRtl = function (baseClass) {
        return baseClass + (this.isRtl ? ' rtl' : ' ltr');
    };
    SideDrawer.prototype.getDefaultStyle = function (baseClass, withRtl) {
        var tabletClassName = baseClass;
        tabletClassName = this._getAppearanceStyle(tabletClassName);
        if (app.android && platform_1.device.deviceType === enums_1.DeviceType.Tablet) {
            tabletClassName += ' tablet';
            if (withRtl === true) {
                tabletClassName += (this.isRtl ? '-rtl' : '-ltr');
            }
        }
        else {
            if (withRtl === true) {
                tabletClassName = this.getClassNameForRtl(tabletClassName);
            }
        }
        return tabletClassName;
    };
    SideDrawer.prototype._getAppearanceStyle = function (style) {
        if (app.systemAppearance() == 'dark') {
            style += this._darkIdentifier;
        }
        else {
            style += this._lightIdentifier;
        }
        return style;
    };
    Object.defineProperty(SideDrawer.prototype, "isRtl", {
        get: function () {
            return AppSettingsManager_1.AppSettingsManager.instance().getBoolean('IsRTL') === true ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    SideDrawer.prototype.getTextAlignment = function (textAlignment) {
        switch (textAlignment) {
            case 'center':
                return enums_1.TextAlignment.center;
            case 'right':
                return !this.isRtl ? enums_1.TextAlignment.right : enums_1.TextAlignment.left;
            default:
                return !this.isRtl ? enums_1.TextAlignment.left : enums_1.TextAlignment.right;
        }
    };
    SideDrawer.prototype.menuItemSelected = function (sectionIdx, index) {
        var _this = this;
        var itemSelectionPromise = Promise.resolve();
        if (sectionIdx < this._resolvedDefinition.sections.length && this._resolvedDefinition.sections[sectionIdx] !== undefined) {
            var sectionDef = this._resolvedDefinition.sections[sectionIdx];
            if (index < sectionDef.items.length && sectionDef.items[index] !== undefined) {
                var itemDef_1 = sectionDef.items[index];
                var itemIndexFromIndexPath = this.getMenuItemIndexFromIndexPath(sectionIdx, index);
                var timeout_1 = 0;
                if (itemDef_1.pageToOpen || itemDef_1.action) {
                    timeout_1 = 500;
                    if (this._clearHistory) {
                        timeout_1 = 1500;
                    }
                }
                if (sectionIdx === this._selectedItem[0] && index === this._selectedItem[1]) {
                    if (this._clearHistory) {
                        var resetValue = this._menuItemDefnsForTabs[itemIndexFromIndexPath].ResetIfPressedWhenActive;
                        if (resetValue === true && itemDef_1.pageToOpen) {
                            itemSelectionPromise = this.navigateToSelectedItem(sectionIdx, index);
                        }
                    }
                    else {
                        this.menuClickedTwice(itemIndexFromIndexPath);
                    }
                }
                else {
                    if (itemDef_1.pageToOpen) {
                        this.resetMenuItemSelectionState();
                        this.setMenuItemAsActive(sectionIdx, index);
                        if (this._clearHistory) {
                            itemSelectionPromise = this.navigateToSelectedItem(sectionIdx, index);
                        }
                        else {
                            this.navigateToFrame(itemIndexFromIndexPath);
                        }
                    }
                }
                itemSelectionPromise.then(function () {
                    setTimeout(function () {
                        if (!itemDef_1.pageToOpen) {
                            _this.blankItemSelected = true;
                            _this.blankItemIndexPath = [sectionIdx, index];
                        }
                        else {
                            var frameId = _this.getFrameId();
                            if (frameId !== undefined) {
                                var itemPage = _this.getCurrentItemPage();
                                if ((itemPage instanceof MDKPage_1.MDKPage) && itemPage.context) {
                                    itemPage.context.clientAPIProps.eventSource = new ExecuteSource_1.ExecuteSource(frameId);
                                }
                            }
                        }
                        _this.executeOnPressActionOrRule(itemDef_1).then(function () {
                            if (_this.blankItemSelected === false && _this.blankItemIndexPath) {
                                _this.resetMenuItemSelectionState();
                                _this.setMenuItemAsActive(_this.blankItemIndexPath[0], _this.blankItemIndexPath[1]);
                            }
                            _this.blankItemSelected = false;
                            _this.blankItemIndexPath = undefined;
                        }).catch(function (error) {
                            if (_this.blankItemSelected === false && _this.blankItemIndexPath) {
                                _this.resetMenuItemSelectionState();
                                _this.setMenuItemAsActive(_this.blankItemIndexPath[0], _this.blankItemIndexPath[1]);
                            }
                            _this.blankItemSelected = false;
                            _this.blankItemIndexPath = undefined;
                            throw error;
                        });
                    }, timeout_1);
                });
            }
        }
    };
    SideDrawer.prototype.navigateToSelectedItem = function (sectionIdx, index) {
        var _this = this;
        var itemIndexFromIndexPath = this.getMenuItemIndexFromIndexPath(sectionIdx, index);
        var pageReference = this._menuItemDefnsForTabs[itemIndexFromIndexPath].PageToOpen;
        var pageDefPromise;
        if (pageReference) {
            pageDefPromise = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(pageReference);
        }
        else {
            var itemName = this._resolvedDefinition.sections[sectionIdx].items[index].name;
            pageDefPromise = Promise.resolve(new PageDefinition_1.PageDefinition('', { _Name: itemName }));
        }
        return pageDefPromise.then(function (pageDef) {
            var executeSource = new ExecuteSource_1.ExecuteSource(_this.getFrameId());
            return PageRenderer_1.PageRenderer.pushNavigationForPageDefinition(pageDef, true, null, executeSource).then(function (navigationEntry) {
                return navigationEntry;
            });
        });
    };
    SideDrawer.prototype.navigateToFrame = function (frameIdx) {
        if (this.bottomNavControl !== undefined) {
            var bottomNav = this.bottomNavControl.view();
            if (bottomNav.items && bottomNav.items.length > 0) {
                if (frameIdx < bottomNav.items.length) {
                    bottomNav.selectedIndex = frameIdx;
                    return true;
                }
            }
        }
        return false;
    };
    SideDrawer.prototype.menuClickedTwice = function (frameIdx) {
        if (this.bottomNavControl && this.bottomNavControl.hiddenTabStrip) {
            this.bottomNavControl.hiddenTabStrip.items[frameIdx].notify({
                eventName: tab_strip_item_1.TabStripItem.tapEvent,
                object: this.view()
            });
        }
    };
    Object.defineProperty(SideDrawer.prototype, "bottomNavControl", {
        get: function () {
            if (this._shellPage) {
                return this._shellPage.controls[0];
            }
            else {
                return undefined;
            }
        },
        enumerable: true,
        configurable: true
    });
    SideDrawer.prototype._resetDrawerState = function () {
        this._selectedItem = [0, 0];
        this.blankItemSelected = false;
        this.blankItemIndexPath = undefined;
        this.blankMainPage = false;
        this.blankItemModalAnchorPage = null;
    };
    SideDrawer.prototype.resetMenuItemSelectionState = function () {
        var _this = this;
        var sectionIdx = this._selectedItem[0];
        var itemIdx = this._selectedItem[1];
        if (sectionIdx < this._resolvedDefinition.sections.length && this._resolvedDefinition.sections[sectionIdx] !== undefined) {
            var sectionDef = this._resolvedDefinition.sections[sectionIdx];
            if (itemIdx < sectionDef.items.length && sectionDef.items[itemIdx] !== undefined) {
                var itemDef_2 = sectionDef.items[itemIdx];
                var itemInactiveStyle_1 = this._styles ? this._styles.SectionItemInactive : '';
                ValueResolver_1.ValueResolver.resolveValue(sectionDef.styles, this.context, true).then(function (sectionStyles) {
                    ValueResolver_1.ValueResolver.resolveValue(itemDef_2.styles, _this.context, true).then(function (itemStyles) {
                        itemInactiveStyle_1 += (sectionStyles && sectionStyles.SectionItemInactive) ? ' ' + sectionStyles.SectionItemInactive : '';
                        itemInactiveStyle_1 += (itemStyles && itemStyles.SectionItemInactive) ? ' ' + itemStyles.SectionItemInactive : '';
                        _this.getItemWithIndexPath(sectionIdx, itemIdx).className = _this.getDefaultStyle('sidedrawer-list-item', false) + ' ' + itemInactiveStyle_1;
                    });
                });
            }
        }
    };
    SideDrawer.prototype.setMenuItemOnPressStyle = function (sectionIdx, idx) {
        var _this = this;
        if (this._selectedItem[0] !== sectionIdx || this._selectedItem[1] !== idx) {
            if (sectionIdx < this._resolvedDefinition.sections.length && this._resolvedDefinition.sections[sectionIdx] !== undefined) {
                var sectionDef = this._resolvedDefinition.sections[sectionIdx];
                if (idx < sectionDef.items.length && sectionDef.items[idx] !== undefined) {
                    var itemDef_3 = sectionDef.items[idx];
                    var itemOnPressStyle_1 = this._styles ? this._styles.SectionItemOnPress : '';
                    ValueResolver_1.ValueResolver.resolveValue(sectionDef.styles, this.context, true).then(function (sectionStyles) {
                        ValueResolver_1.ValueResolver.resolveValue(itemDef_3.styles, _this.context, true).then(function (itemStyles) {
                            itemOnPressStyle_1 += (sectionStyles && sectionStyles.SectionItemOnPress) ? ' ' + sectionStyles.SectionItemOnPress : '';
                            itemOnPressStyle_1 += (itemStyles && itemStyles.SectionItemOnPress) ? ' ' + itemStyles.SectionItemOnPress : '';
                            _this.getItemWithIndexPath(sectionIdx, idx).className = _this.getDefaultStyle('sidedrawer-list-item', false) + ' sidedrawer-list-item-onpress ' + itemOnPressStyle_1;
                        });
                    });
                }
            }
        }
    };
    SideDrawer.prototype.clearMenuItemOnPressStyle = function (sectionIdx, idx) {
        var _this = this;
        if (this._selectedItem[0] !== sectionIdx || this._selectedItem[1] !== idx) {
            if (sectionIdx < this._resolvedDefinition.sections.length && this._resolvedDefinition.sections[sectionIdx] !== undefined) {
                var sectionDef = this._resolvedDefinition.sections[sectionIdx];
                if (idx < sectionDef.items.length && sectionDef.items[idx] !== undefined) {
                    var itemDef_4 = sectionDef.items[idx];
                    var itemInactiveStyle_2 = this._styles ? this._styles.SectionItemInactive : '';
                    ValueResolver_1.ValueResolver.resolveValue(sectionDef.styles, this.context, true).then(function (sectionStyles) {
                        ValueResolver_1.ValueResolver.resolveValue(itemDef_4.styles, _this.context, true).then(function (itemStyles) {
                            itemInactiveStyle_2 += (sectionStyles && sectionStyles.SectionItemInactive) ? ' ' + sectionStyles.SectionItemInactive : '';
                            itemInactiveStyle_2 += (itemStyles && itemStyles.SectionItemInactive) ? ' ' + itemStyles.SectionItemInactive : '';
                            _this.getItemWithIndexPath(sectionIdx, idx).className = _this.getDefaultStyle('sidedrawer-list-item', false) + ' ' + itemInactiveStyle_2;
                        });
                    });
                }
            }
        }
    };
    SideDrawer.prototype.setMenuItemAsActive = function (sectionIdx, idx) {
        var _this = this;
        this._selectedItem = [sectionIdx, idx];
        if (sectionIdx < this._resolvedDefinition.sections.length && this._resolvedDefinition.sections[sectionIdx] !== undefined) {
            var sectionDef = this._resolvedDefinition.sections[sectionIdx];
            if (idx < sectionDef.items.length && sectionDef.items[idx] !== undefined) {
                var itemDef_5 = sectionDef.items[idx];
                var itemActiveStyle_1 = this._styles ? this._styles.SectionItemActive : '';
                ValueResolver_1.ValueResolver.resolveValue(sectionDef.styles, this.context, true).then(function (sectionStyles) {
                    ValueResolver_1.ValueResolver.resolveValue(itemDef_5.styles, _this.context, true).then(function (itemStyles) {
                        itemActiveStyle_1 += (sectionStyles && sectionStyles.SectionItemActive) ? ' ' + sectionStyles.SectionItemActive : '';
                        itemActiveStyle_1 += (itemStyles && itemStyles.SectionItemActive) ? ' ' + itemStyles.SectionItemActive : '';
                        _this.getItemWithIndexPath(sectionIdx, idx).className = _this.getDefaultStyle('sidedrawer-list-item', false) + ' ' + _this._getAppearanceStyle('sidedrawer-list-item-active') + ' ' + itemActiveStyle_1;
                    });
                });
            }
        }
    };
    SideDrawer.prototype.resolveData = function (headerDef) {
        if (headerDef.target) {
            var targetDefinition = headerDef.target;
            if (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(targetDefinition) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isBinding(targetDefinition) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isRule(targetDefinition)) {
                return ValueResolver_1.ValueResolver.resolveValue(targetDefinition, this.context, false).then(function (data) {
                    return Promise.resolve(data || {});
                });
            }
            else {
                return EvaluateTarget_1.asService(headerDef.data, this.context).then(function (service) {
                    return DataHelper_1.DataHelper.readFromService(service).then(function (result) {
                        return result.length > 0 ? result.getItem(0) : {};
                    })
                        .catch(function (error) {
                        Logger_1.Logger.instance.ui.error(Logger_1.Logger.UNABLE_TO_FETCH_DATA_FROM_TARGET_SERVICE, error, error ? error.stack : '');
                    });
                });
            }
        }
        else {
            return Promise.resolve(new observable_array_1.ObservableArray());
        }
    };
    SideDrawer.prototype.executeOnPressActionOrRule = function (selectedItem) {
        var frameId = this.getFrameId();
        if (selectedItem.action && frameId) {
            var executeSource = new ExecuteSource_1.ExecuteSource(frameId);
            executeSource.sourceType = ExecuteSource_1.ExecuteSourceType.ParentPage;
            var eventHandler = new EventHandler_1.EventHandler();
            var context = this.context;
            context.binding = context.binding || {};
            context.clientAPIProps.eventSource = executeSource;
            context.clientAPIProps.actionBinding = selectedItem;
            eventHandler.setEventSource(executeSource);
            return eventHandler.executeActionOrRule(selectedItem.action, context);
        }
        return Promise.resolve();
    };
    SideDrawer.prototype.getFrameId = function () {
        if (this._clearHistory) {
            return MDKFrame_1.MDKFrame.getRootFrameId();
        }
        else {
            var selectedItemFrame = TabFrame_1.TabFrame.getSideDrawerSelectedTabFrame(this._shellPage.content);
            if (selectedItemFrame) {
                return selectedItemFrame.id;
            }
            Logger_1.Logger.instance.ui.warn(Logger_1.Logger.UNABLE_TO_GET_SIDEDRAWER_SELECTED_FRAME);
        }
    };
    SideDrawer.prototype.getCurrentItemPage = function () {
        if (this._clearHistory) {
            return MDKFrame_1.MDKFrame.getRootFrame().currentPage;
        }
        else {
            var selectedItemFrame = TabFrame_1.TabFrame.getSideDrawerSelectedTabFrame(this._shellPage.content);
            if (selectedItemFrame) {
                return selectedItemFrame.currentPage;
            }
            Logger_1.Logger.instance.ui.warn(Logger_1.Logger.UNABLE_TO_GET_SIDEDRAWER_SELECTED_FRAME);
        }
    };
    SideDrawer.prototype.buildNavStackForMenus = function () {
        var _this = this;
        var sideDrawerRootPageData = {
            Caption: "Side Drawer With Botnav",
            ActionBar: {
                Items: []
            },
            Controls: [
                {
                    Items: this._menuItemDefnsForTabs,
                    "Styles": {
                        "TabStrip": "TabStripStyle"
                    },
                    HideTabStrips: true,
                    SelectedIndex: this.getBottomNavSelectionItemIndex(),
                    "_Type": "Control.Type.BottomNavigation",
                    "_Name": "BottomNavigationStyleTest"
                }
            ],
            "_Type": "Page",
            "_Name": "SideDrawerShellPage"
        };
        var sideDrawerRootPageDef = new PageDefinition_1.PageDefinition('/pages/sidedrawerRootPage', sideDrawerRootPageData);
        return PageRenderer_1.PageRenderer
            .pushNavigationForPageDefinition(sideDrawerRootPageDef, true, MDKNavigationType_1.MDKNavigationType.Outer, null, null, true)
            .then(function (navigationEntry) {
            _this._shellPage = navigationEntry.create();
            return navigationEntry;
        });
    };
    return SideDrawer;
}(BaseControl_1.BaseControl));
exports.SideDrawer = SideDrawer;
