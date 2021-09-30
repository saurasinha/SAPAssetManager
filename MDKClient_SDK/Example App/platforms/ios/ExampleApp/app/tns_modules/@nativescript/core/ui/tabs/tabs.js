function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var tab_strip_1 = require("../tab-navigation-base/tab-strip");
var tab_strip_item_1 = require("../tab-navigation-base/tab-strip-item");
var color_1 = require("../../color");
var image_source_1 = require("../../image-source");
var platform_1 = require("../../platform");
var utils_1 = require("../../utils/utils");
var view_1 = require("../core/view");
var frame_1 = require("../frame");
var font_1 = require("../styling/font");
var tab_navigation_base_1 = require("../tab-navigation-base/tab-navigation-base");
var tabs_common_1 = require("./tabs-common");
__export(require("./tabs-common"));
var majorVersion = utils_1.ios.MajorVersion;
var isPhone = platform_1.device.deviceType === "Phone";
var invokeOnRunLoop = (function () {
    var runloop = CFRunLoopGetMain();
    return function (action) {
        CFRunLoopPerformBlock(runloop, kCFRunLoopDefaultMode, action);
        CFRunLoopWakeUp(runloop);
    };
}());
var MDCTabBarDelegateImpl = (function (_super) {
    __extends(MDCTabBarDelegateImpl, _super);
    function MDCTabBarDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCTabBarDelegateImpl.initWithOwner = function (owner) {
        var delegate = MDCTabBarDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    MDCTabBarDelegateImpl.prototype.tabBarShouldSelectItem = function (tabBar, item) {
        var owner = this._owner.get();
        var shouldSelectItem = owner._canSelectItem;
        var selectedIndex = owner.tabBarItems.indexOf(item);
        if (owner.selectedIndex !== selectedIndex) {
            owner._canSelectItem = false;
        }
        var tabStrip = owner.tabStrip;
        var tabStripItems = tabStrip && tabStrip.items;
        if (tabStripItems && tabStripItems[selectedIndex]) {
            tabStripItems[selectedIndex]._emit(tab_strip_item_1.TabStripItem.tapEvent);
            tabStrip.notify({ eventName: tab_strip_1.TabStrip.itemTapEvent, object: tabStrip, index: selectedIndex });
        }
        return shouldSelectItem;
    };
    MDCTabBarDelegateImpl.prototype.tabBarDidSelectItem = function (tabBar, selectedItem) {
        var owner = this._owner.get();
        var tabBarItems = owner.tabBarItems;
        var selectedIndex = tabBarItems.indexOf(selectedItem);
        owner.selectedIndex = selectedIndex;
    };
    MDCTabBarDelegateImpl.ObjCProtocols = [MDCTabBarDelegate];
    return MDCTabBarDelegateImpl;
}(NSObject));
var BackgroundIndicatorTemplate = (function (_super) {
    __extends(BackgroundIndicatorTemplate, _super);
    function BackgroundIndicatorTemplate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BackgroundIndicatorTemplate.prototype.indicatorAttributesForContext = function (context) {
        var attributes = new MDCTabBarIndicatorAttributes();
        attributes.path = UIBezierPath.bezierPathWithRect(context.bounds);
        return attributes;
    };
    BackgroundIndicatorTemplate.ObjCProtocols = [MDCTabBarIndicatorTemplate];
    return BackgroundIndicatorTemplate;
}(NSObject));
var UIPageViewControllerImpl = (function (_super) {
    __extends(UIPageViewControllerImpl, _super);
    function UIPageViewControllerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIPageViewControllerImpl.initWithOwner = function (owner) {
        var handler = UIPageViewControllerImpl.alloc().initWithTransitionStyleNavigationOrientationOptions(1, 0, null);
        handler._owner = owner;
        return handler;
    };
    UIPageViewControllerImpl.prototype.viewDidLoad = function () {
        var owner = this._owner.get();
        var tabBarItems = owner.tabBarItems;
        var tabBar = MDCTabBar.alloc().initWithFrame(this.view.bounds);
        if (tabBarItems && tabBarItems.length) {
            tabBar.items = NSArray.arrayWithArray(tabBarItems);
        }
        tabBar.delegate = this.tabBarDelegate = MDCTabBarDelegateImpl.initWithOwner(new WeakRef(owner));
        if (majorVersion <= 12 || !UIColor.labelColor) {
            tabBar.tintColor = UIColor.blueColor;
            tabBar.barTintColor = UIColor.whiteColor;
            tabBar.setTitleColorForState(UIColor.blackColor, 0);
            tabBar.setTitleColorForState(UIColor.blackColor, 1);
        }
        else {
            tabBar.tintColor = UIColor.systemBlueColor;
            tabBar.barTintColor = UIColor.systemBackgroundColor;
            tabBar.setTitleColorForState(UIColor.labelColor, 0);
            tabBar.setTitleColorForState(UIColor.labelColor, 1);
            tabBar.inkColor = UIColor.clearColor;
        }
        tabBar.autoresizingMask = 2 | 32;
        tabBar.alignment = 1;
        tabBar.sizeToFit();
        this.tabBar = tabBar;
        this.view.addSubview(tabBar);
    };
    UIPageViewControllerImpl.prototype.viewWillAppear = function (animated) {
        _super.prototype.viewWillAppear.call(this, animated);
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        view_1.ios.updateAutoAdjustScrollInsets(this, owner);
        if (!owner.isLoaded) {
            owner.callLoaded();
        }
    };
    UIPageViewControllerImpl.prototype.viewDidLayoutSubviews = function () {
        _super.prototype.viewDidLayoutSubviews.call(this);
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        var safeAreaInsetsBottom = 0;
        var safeAreaInsetsTop = 0;
        if (majorVersion > 10) {
            safeAreaInsetsBottom = this.view.safeAreaInsets.bottom;
            safeAreaInsetsTop = this.view.safeAreaInsets.top;
        }
        else {
            safeAreaInsetsTop = this.topLayoutGuide.length;
        }
        var conditionalSafeAreaBottom = owner.iosOverflowSafeArea ? safeAreaInsetsBottom : 0;
        var scrollViewTop = 0;
        var scrollViewHeight = this.view.bounds.size.height + conditionalSafeAreaBottom;
        if (owner.tabStrip) {
            var tabBarHeight = this.tabBar.frame.size.height;
            var tabBarTop = safeAreaInsetsTop;
            scrollViewTop = tabBarHeight;
            scrollViewHeight = this.view.bounds.size.height - tabBarHeight + conditionalSafeAreaBottom;
            var tabsPosition = owner.tabsPosition;
            if (tabsPosition === "bottom") {
                tabBarTop = this.view.frame.size.height - tabBarHeight - safeAreaInsetsBottom;
                scrollViewTop = this.view.frame.origin.y;
                scrollViewHeight = this.view.frame.size.height - tabBarHeight;
            }
            var parent_1 = owner.parent;
            while (parent_1 && !parent_1.nativeViewProtected) {
                parent_1 = parent_1.parent;
            }
            if (parent_1 && majorVersion > 10) {
                tabBarTop = Math.max(tabBarTop, parent_1.nativeView.safeAreaInsets.top);
            }
            this.tabBar.frame = CGRectMake(0, tabBarTop, this.tabBar.frame.size.width, tabBarHeight);
        }
        else {
            this.tabBar.hidden = true;
        }
        var subViews = this.view.subviews;
        var scrollView = null;
        for (var i = 0; i < subViews.count; i++) {
            var view = subViews[i];
            if (view instanceof UIScrollView) {
                scrollView = view;
            }
        }
        if (scrollView) {
            this.scrollView = scrollView;
            if (!owner.swipeEnabled) {
                scrollView.scrollEnabled = false;
            }
            scrollView.frame = CGRectMake(0, scrollViewTop, this.view.bounds.size.width, scrollViewHeight);
        }
    };
    UIPageViewControllerImpl.prototype.traitCollectionDidChange = function (previousTraitCollection) {
        _super.prototype.traitCollectionDidChange.call(this, previousTraitCollection);
        if (majorVersion >= 13) {
            var owner = this._owner.get();
            if (owner &&
                this.traitCollection.hasDifferentColorAppearanceComparedToTraitCollection &&
                this.traitCollection.hasDifferentColorAppearanceComparedToTraitCollection(previousTraitCollection)) {
                owner.notify({ eventName: view_1.ios.traitCollectionColorAppearanceChangedEvent, object: owner });
            }
        }
    };
    UIPageViewControllerImpl.prototype.viewWillTransitionToSizeWithTransitionCoordinator = function (size, coordinator) {
        var _this = this;
        _super.prototype.viewWillTransitionToSizeWithTransitionCoordinator.call(this, size, coordinator);
        coordinator.animateAlongsideTransitionCompletion(function () {
            var owner = _this._owner.get();
            if (owner && owner.tabStrip && owner.tabStrip.items) {
                var tabStrip_1 = owner.tabStrip;
                tabStrip_1.items.forEach(function (tabStripItem) {
                    updateBackgroundPositions(tabStrip_1, tabStripItem, _this.tabBar.alignment !== 1 || (owner.selectedIndex !== tabStripItem._index) ? owner._defaultItemBackgroundColor : null);
                    var index = tabStripItem._index;
                    var tabBarItemController = owner.viewControllers[index];
                    updateTitleAndIconPositions(tabStripItem, tabBarItemController.tabBarItem, tabBarItemController);
                });
            }
        }, null);
    };
    return UIPageViewControllerImpl;
}(UIPageViewController));
var UIPageViewControllerDataSourceImpl = (function (_super) {
    __extends(UIPageViewControllerDataSourceImpl, _super);
    function UIPageViewControllerDataSourceImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIPageViewControllerDataSourceImpl.initWithOwner = function (owner) {
        var dataSource = UIPageViewControllerDataSourceImpl.new();
        dataSource._owner = owner;
        return dataSource;
    };
    UIPageViewControllerDataSourceImpl.prototype.pageViewControllerViewControllerBeforeViewController = function (pageViewController, viewController) {
        var owner = this._owner.get();
        var selectedIndex = owner.selectedIndex;
        if (selectedIndex === 0) {
            return null;
        }
        selectedIndex--;
        var prevItem = owner.items[selectedIndex];
        var prevViewController = prevItem.__controller;
        owner._setCanBeLoaded(selectedIndex);
        owner._loadUnloadTabItems(selectedIndex);
        return prevViewController;
    };
    UIPageViewControllerDataSourceImpl.prototype.pageViewControllerViewControllerAfterViewController = function (pageViewController, viewController) {
        var owner = this._owner.get();
        var selectedIndex = owner.selectedIndex;
        if (selectedIndex === owner.items.length - 1) {
            return null;
        }
        selectedIndex++;
        var nextItem = owner.items[selectedIndex];
        var nextViewController = nextItem.__controller;
        owner._setCanBeLoaded(selectedIndex);
        owner._loadUnloadTabItems(selectedIndex);
        return nextViewController;
    };
    UIPageViewControllerDataSourceImpl.prototype.presentationCountForPageViewController = function (pageViewController) {
        return 0;
    };
    UIPageViewControllerDataSourceImpl.prototype.presentationIndexForPageViewController = function (pageViewController) {
        return 0;
    };
    UIPageViewControllerDataSourceImpl.ObjCProtocols = [UIPageViewControllerDataSource];
    return UIPageViewControllerDataSourceImpl;
}(NSObject));
var UIPageViewControllerDelegateImpl = (function (_super) {
    __extends(UIPageViewControllerDelegateImpl, _super);
    function UIPageViewControllerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIPageViewControllerDelegateImpl.initWithOwner = function (owner) {
        var delegate = UIPageViewControllerDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    UIPageViewControllerDelegateImpl.prototype.pageViewControllerWillTransitionToViewControllers = function (pageViewController, viewControllers) {
    };
    UIPageViewControllerDelegateImpl.prototype.pageViewControllerDidFinishAnimatingPreviousViewControllersTransitionCompleted = function (pageViewController, didFinishAnimating, previousViewControllers, transitionCompleted) {
        if (!transitionCompleted) {
            return;
        }
        var owner = this._owner.get();
        var ownerViewControllers = owner.viewControllers;
        var selectedIndex = owner.selectedIndex;
        var nextViewController = pageViewController.viewControllers[0];
        var nextViewControllerIndex = ownerViewControllers.indexOf(nextViewController);
        if (selectedIndex !== nextViewControllerIndex) {
            owner.selectedIndex = nextViewControllerIndex;
            owner._canSelectItem = true;
        }
    };
    UIPageViewControllerDelegateImpl.ObjCProtocols = [UIPageViewControllerDelegate];
    return UIPageViewControllerDelegateImpl;
}(NSObject));
function iterateIndexRange(index, eps, lastIndex, callback) {
    var rangeStart = Math.max(0, index - eps);
    var rangeEnd = Math.min(index + eps, lastIndex);
    for (var i = rangeStart; i <= rangeEnd; i++) {
        callback(i);
    }
}
function updateBackgroundPositions(tabStrip, tabStripItem, color) {
    if (color === void 0) { color = null; }
    var bgView = tabStripItem.bgView;
    var index = tabStripItem._index;
    var width = tabStrip.nativeView.frame.size.width / tabStrip.items.length;
    var frame = CGRectMake(width * index, 0, width, tabStrip.nativeView.frame.size.width);
    if (!bgView) {
        bgView = UIView.alloc().initWithFrame(frame);
        tabStrip.nativeView.insertSubviewAtIndex(bgView, 0);
        tabStripItem.bgView = bgView;
    }
    else {
        bgView.frame = frame;
    }
    var backgroundColor = tabStripItem.style.backgroundColor;
    bgView.backgroundColor = color || (backgroundColor instanceof color_1.Color ? backgroundColor.ios : backgroundColor);
}
function updateTitleAndIconPositions(tabStripItem, tabBarItem, controller) {
    if (!tabStripItem || !tabBarItem) {
        return;
    }
    var orientation = controller.interfaceOrientation;
    var isPortrait = orientation !== 4 && orientation !== 3;
    var isIconAboveTitle = (majorVersion < 11) || (isPhone && isPortrait);
    if (!tabStripItem.iconSource) {
        if (isIconAboveTitle) {
            tabBarItem.titlePositionAdjustment = { horizontal: 0, vertical: -20 };
        }
        else {
            tabBarItem.titlePositionAdjustment = { horizontal: 0, vertical: 0 };
        }
    }
    if (!tabStripItem.title) {
        if (isIconAboveTitle) {
            tabBarItem.imageInsets = new UIEdgeInsets({ top: 6, left: 0, bottom: -6, right: 0 });
        }
        else {
            tabBarItem.imageInsets = new UIEdgeInsets({ top: 0, left: 0, bottom: 0, right: 0 });
        }
    }
}
var Tabs = (function (_super) {
    __extends(Tabs, _super);
    function Tabs() {
        var _this = _super.call(this) || this;
        _this._iconsCache = {};
        _this.viewController = _this._ios = UIPageViewControllerImpl.initWithOwner(new WeakRef(_this));
        return _this;
    }
    Tabs.prototype.createNativeView = function () {
        return this._ios.view;
    };
    Tabs.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this._dataSource = UIPageViewControllerDataSourceImpl.initWithOwner(new WeakRef(this));
        this._delegate = UIPageViewControllerDelegateImpl.initWithOwner(new WeakRef(this));
    };
    Tabs.prototype.disposeNativeView = function () {
        this._dataSource = null;
        this._delegate = null;
        this._ios.tabBarDelegate = null;
        this._ios.tabBar = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Tabs.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.setViewControllers(this.items);
        var selectedIndex = this.selectedIndex;
        var selectedView = this.items && this.items[selectedIndex] && this.items[selectedIndex].content;
        if (selectedView instanceof frame_1.Frame) {
            selectedView._pushInFrameStackRecursive();
        }
        this._ios.dataSource = this._dataSource;
        this._ios.delegate = this._delegate;
    };
    Tabs.prototype.onUnloaded = function () {
        this._ios.dataSource = null;
        this._ios.delegate = null;
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(Tabs.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Tabs.prototype.layoutNativeView = function (left, top, right, bottom) {
    };
    Tabs.prototype._setNativeViewFrame = function (nativeView, frame) {
    };
    Tabs.prototype.onSelectedIndexChanged = function (oldIndex, newIndex) {
        var items = this.items;
        if (!items) {
            return;
        }
        var oldItem = items[oldIndex];
        if (oldItem) {
            oldItem.canBeLoaded = false;
            oldItem.unloadView(oldItem.content);
        }
        var newItem = items[newIndex];
        if (newItem && this.isLoaded) {
            var selectedView = items[newIndex].content;
            if (selectedView instanceof frame_1.Frame) {
                selectedView._pushInFrameStackRecursive();
            }
            newItem.canBeLoaded = true;
            newItem.loadView(newItem.content);
        }
        var tabStripItems = this.tabStrip && this.tabStrip.items;
        if (tabStripItems) {
            if (tabStripItems[newIndex]) {
                tabStripItems[newIndex]._emit(tab_strip_item_1.TabStripItem.selectEvent);
                this.updateItemColors(tabStripItems[newIndex]);
            }
            if (tabStripItems[oldIndex]) {
                tabStripItems[oldIndex]._emit(tab_strip_item_1.TabStripItem.unselectEvent);
                this.updateItemColors(tabStripItems[oldIndex]);
            }
        }
        this._loadUnloadTabItems(newIndex);
        _super.prototype.onSelectedIndexChanged.call(this, oldIndex, newIndex);
    };
    Tabs.prototype._loadUnloadTabItems = function (newIndex) {
        var _this = this;
        var items = this.items;
        if (!items) {
            return;
        }
        var lastIndex = items.length - 1;
        var offsideItems = this.offscreenTabLimit;
        var toUnload = [];
        var toLoad = [];
        iterateIndexRange(newIndex, offsideItems, lastIndex, function (i) { return toLoad.push(i); });
        items.forEach(function (item, i) {
            var indexOfI = toLoad.indexOf(i);
            if (indexOfI < 0) {
                toUnload.push(i);
            }
        });
        toUnload.forEach(function (index) {
            var item = items[index];
            if (items[index]) {
                item.unloadView(item.content);
            }
        });
        var newItem = items[newIndex];
        var selectedView = newItem && newItem.content;
        if (selectedView instanceof frame_1.Frame) {
            selectedView._pushInFrameStackRecursive();
        }
        toLoad.forEach(function (index) {
            var item = items[index];
            if (_this.isLoaded && items[index]) {
                item.loadView(item.content);
            }
        });
    };
    Tabs.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = utils_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var widthAndState = view_1.View.resolveSizeAndState(width, width, widthMode, 0);
        var heightAndState = view_1.View.resolveSizeAndState(height, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Tabs.prototype._onViewControllerShown = function (viewController) {
        if (this._ios.viewControllers && this._ios.viewControllers.containsObject(viewController)) {
            this.selectedIndex = this._ios.viewControllers.indexOfObject(viewController);
        }
        else {
        }
    };
    Tabs.prototype.getViewController = function (item) {
        var newController = item.content ? item.content.viewController : null;
        if (newController) {
            item.setViewController(newController, newController.view);
            return newController;
        }
        if (item.content.ios instanceof UIViewController) {
            newController = item.content.ios;
            item.setViewController(newController, newController.view);
        }
        else if (item.content.ios && item.content.ios.controller instanceof UIViewController) {
            newController = item.content.ios.controller;
            item.setViewController(newController, newController.view);
        }
        else {
            newController = view_1.ios.UILayoutViewController.initWithOwner(new WeakRef(item.content));
            newController.view.addSubview(item.content.nativeViewProtected);
            item.content.viewController = newController;
            item.setViewController(newController, item.content.nativeViewProtected);
        }
        return newController;
    };
    Tabs.prototype._setCanBeLoaded = function (index) {
        var items = this.items;
        if (!this.items) {
            return;
        }
        var lastIndex = items.length - 1;
        var offsideItems = this.offscreenTabLimit;
        iterateIndexRange(index, offsideItems, lastIndex, function (i) {
            if (items[i]) {
                items[i].canBeLoaded = true;
            }
        });
    };
    Tabs.prototype.setViewControllers = function (items) {
        var _this = this;
        var length = items ? items.length : 0;
        if (length === 0) {
            this.viewControllers = null;
            return;
        }
        var viewControllers = [];
        var tabBarItems = [];
        if (this.tabStrip) {
            this.tabStrip.setNativeView(this._ios.tabBar);
        }
        var tabStripItems = this.tabStrip && this.tabStrip.items;
        if (tabStripItems) {
            if (tabStripItems[this.selectedIndex]) {
                tabStripItems[this.selectedIndex]._emit(tab_strip_item_1.TabStripItem.selectEvent);
            }
        }
        items.forEach(function (item, i) {
            var controller = _this.getViewController(item);
            if (_this.tabStrip && _this.tabStrip.items && _this.tabStrip.items[i]) {
                var tabStripItem = _this.tabStrip.items[i];
                var tabBarItem = _this.createTabBarItem(tabStripItem, i);
                updateTitleAndIconPositions(tabStripItem, tabBarItem, controller);
                _this.setViewTextAttributes(tabStripItem.label, i === _this.selectedIndex);
                controller.tabBarItem = tabBarItem;
                tabStripItem._index = i;
                tabBarItems.push(tabBarItem);
                tabStripItem.setNativeView(tabBarItem);
            }
            item.canBeLoaded = true;
            viewControllers.push(controller);
        });
        this.setItemImages();
        this.viewControllers = viewControllers;
        this.tabBarItems = tabBarItems;
        if (this.viewController && this.viewController.tabBar) {
            this.viewController.tabBar.itemAppearance = this.getTabBarItemAppearance();
            this.viewController.tabBar.items = NSArray.arrayWithArray(this.tabBarItems);
            this.viewController.tabBar.sizeToFit();
            if (this.selectedIndex) {
                this.viewController.tabBar.setSelectedItemAnimated(this.tabBarItems[this.selectedIndex], false);
            }
        }
    };
    Tabs.prototype.setItemImages = function () {
        var _this = this;
        if (this._selectedItemColor || this._unSelectedItemColor) {
            if (this.tabStrip && this.tabStrip.items) {
                this.tabStrip.items.forEach(function (item) {
                    if (_this._unSelectedItemColor && item.nativeView) {
                        item.nativeView.image = _this.getIcon(item, _this._unSelectedItemColor);
                    }
                    if (_this._selectedItemColor && item.nativeView) {
                        if (_this.selectedIndex === item._index) {
                            item.nativeView.image = _this.getIcon(item, _this._selectedItemColor);
                        }
                    }
                });
            }
        }
    };
    Tabs.prototype.updateAllItemsColors = function () {
        var _this = this;
        this._defaultItemBackgroundColor = null;
        this.setItemColors();
        if (this.tabStrip && this.tabStrip.items) {
            this.tabStrip.items.forEach(function (tabStripItem) {
                _this.updateItemColors(tabStripItem);
            });
        }
    };
    Tabs.prototype.updateItemColors = function (tabStripItem) {
        updateBackgroundPositions(this.tabStrip, tabStripItem);
        this.setIconColor(tabStripItem, true);
    };
    Tabs.prototype.createTabBarItem = function (item, index) {
        var image;
        var title;
        if (item.isLoaded) {
            image = this.getIcon(item);
            title = item.label.text;
            if (!this.tabStrip._hasImage) {
                this.tabStrip._hasImage = !!image;
            }
            if (!this.tabStrip._hasTitle) {
                this.tabStrip._hasTitle = !!title;
            }
        }
        var tabBarItem = UITabBarItem.alloc().initWithTitleImageTag(title, image, index);
        return tabBarItem;
    };
    Tabs.prototype.getTabBarItemAppearance = function () {
        var itemAppearance;
        if (this.tabStrip && this.tabStrip._hasImage && this.tabStrip._hasTitle) {
            itemAppearance = 2;
        }
        else if (this.tabStrip && this.tabStrip._hasImage) {
            itemAppearance = 1;
        }
        else {
            itemAppearance = 0;
        }
        return itemAppearance;
    };
    Tabs.prototype.getIconRenderingMode = function () {
        switch (this.tabStrip && this.tabStrip.iosIconRenderingMode) {
            case "alwaysOriginal":
                return 1;
            case "alwaysTemplate":
                return 2;
            case "automatic":
            default:
                var hasItemColor = this._selectedItemColor || this._unSelectedItemColor;
                return hasItemColor ? 2 : 1;
        }
    };
    Tabs.prototype.getIcon = function (tabStripItem, color) {
        var iconSource = tabStripItem.image && tabStripItem.image.src;
        if (!iconSource) {
            return null;
        }
        var target = tabStripItem.image;
        var font = target.style.fontInternal || font_1.Font.default;
        if (!color) {
            color = target.style.color;
        }
        var iconTag = [iconSource, font.fontStyle, font.fontWeight, font.fontSize, font.fontFamily, color].join(";");
        var isFontIcon = false;
        var image = this._iconsCache[iconTag];
        if (!image) {
            var is = new image_source_1.ImageSource;
            if (utils_1.isFontIconURI(iconSource)) {
                isFontIcon = true;
                var fontIconCode = iconSource.split("//")[1];
                is = image_source_1.ImageSource.fromFontIconCodeSync(fontIconCode, font, color);
            }
            else {
                is = image_source_1.ImageSource.fromFileOrResourceSync(iconSource);
            }
            if (is && is.ios) {
                image = is.ios;
                if (this.tabStrip && this.tabStrip.isIconSizeFixed) {
                    image = this.getFixedSizeIcon(image);
                }
                var renderingMode = 0;
                if (!isFontIcon) {
                    renderingMode = this.getIconRenderingMode();
                }
                var originalRenderedImage = image.imageWithRenderingMode(renderingMode);
                this._iconsCache[iconTag] = originalRenderedImage;
                image = originalRenderedImage;
            }
        }
        return image;
    };
    Tabs.prototype.getFixedSizeIcon = function (image) {
        var inWidth = image.size.width;
        var inHeight = image.size.height;
        var iconSpecSize = tab_navigation_base_1.getIconSpecSize({ width: inWidth, height: inHeight });
        var widthPts = iconSpecSize.width;
        var heightPts = iconSpecSize.height;
        UIGraphicsBeginImageContextWithOptions({ width: widthPts, height: heightPts }, false, utils_1.layout.getDisplayDensity());
        image.drawInRect(CGRectMake(0, 0, widthPts, heightPts));
        var resultImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return resultImage;
    };
    Tabs.prototype.getTabBarBackgroundColor = function () {
        return this._ios.tabBar.barTintColor;
    };
    Tabs.prototype.setTabBarBackgroundColor = function (value) {
        this._ios.tabBar.barTintColor = value instanceof color_1.Color ? value.ios : value;
        this.updateAllItemsColors();
    };
    Tabs.prototype.setTabBarItemTitle = function (tabStripItem, value) {
        tabStripItem.nativeView.title = value;
    };
    Tabs.prototype.equalUIColor = function (first, second) {
        if (!first && !second) {
            return true;
        }
        if (!first || !second) {
            return false;
        }
        var firstComponents = CGColorGetComponents(first.CGColor);
        var secondComponents = CGColorGetComponents(second.CGColor);
        return firstComponents[0] === secondComponents[0]
            && firstComponents[1] === secondComponents[1]
            && firstComponents[2] === secondComponents[2]
            && firstComponents[3] === secondComponents[3];
    };
    Tabs.prototype.isSelectedAndHightlightedItem = function (tabStripItem) {
        return (tabStripItem._index === this.selectedIndex && tabStripItem["_visualState"] === "highlighted");
    };
    Tabs.prototype.setTabBarItemBackgroundColor = function (tabStripItem, value) {
        if (!this.tabStrip || !tabStripItem) {
            return;
        }
        var newColor = value instanceof color_1.Color ? value.ios : value;
        var itemSelectedAndHighlighted = this.isSelectedAndHightlightedItem(tabStripItem);
        if (!this._defaultItemBackgroundColor && !itemSelectedAndHighlighted) {
            this._defaultItemBackgroundColor = newColor;
        }
        if (this.viewController.tabBar.alignment !== 1 && itemSelectedAndHighlighted
            && !this.equalUIColor(this._defaultItemBackgroundColor, newColor)) {
            if (!this._backgroundIndicatorColor) {
                this._backgroundIndicatorColor = newColor;
                this._ios.tabBar.selectionIndicatorTemplate = new BackgroundIndicatorTemplate();
                this._ios.tabBar.tintColor = newColor;
            }
        }
        else {
            updateBackgroundPositions(this.tabStrip, tabStripItem, newColor);
        }
    };
    Tabs.prototype.setTabBarItemColor = function (tabStripItem, value) {
        this.setViewTextAttributes(tabStripItem.label);
    };
    Tabs.prototype.setItemColors = function () {
        if (this._selectedItemColor) {
            this.viewController.tabBar.selectedItemTintColor = this._selectedItemColor.ios;
        }
        if (this._unSelectedItemColor) {
            this.viewController.tabBar.unselectedItemTintColor = this._unSelectedItemColor.ios;
        }
    };
    Tabs.prototype.setIconColor = function (tabStripItem, forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        if (!forceReload && !this._selectedItemColor && !this._unSelectedItemColor) {
            return;
        }
        var image;
        var tabStripColor = (this.selectedIndex === tabStripItem._index) ? this._selectedItemColor : this._unSelectedItemColor;
        image = this.getIcon(tabStripItem, tabStripColor);
        tabStripItem.nativeView.image = image;
    };
    Tabs.prototype.setTabBarIconColor = function (tabStripItem, value) {
        this.setIconColor(tabStripItem, true);
    };
    Tabs.prototype.setTabBarIconSource = function (tabStripItem, value) {
        this.updateItemColors(tabStripItem);
    };
    Tabs.prototype.setTabBarItemFontInternal = function (tabStripItem, value) {
        this.setViewTextAttributes(tabStripItem.label);
    };
    Tabs.prototype.getTabBarFontInternal = function () {
        return this._ios.tabBar.unselectedItemTitleFont;
    };
    Tabs.prototype.setTabBarFontInternal = function (value) {
        var defaultTabItemFontSize = 10;
        var tabItemFontSize = this.tabStrip.style.fontSize || defaultTabItemFontSize;
        var font = (this.tabStrip.style.fontInternal || font_1.Font.default).getUIFont(UIFont.systemFontOfSize(tabItemFontSize));
        this._ios.tabBar.unselectedItemTitleFont = font;
        this._ios.tabBar.selectedItemTitleFont = font;
    };
    Tabs.prototype.getTabBarTextTransform = function () {
        switch (this._ios.tabBar.titleTextTransform) {
            case 1:
                return "none";
            case 0:
                return "initial";
            case 2:
            default:
                return "uppercase";
        }
    };
    Tabs.prototype.setTabBarTextTransform = function (value) {
        if (value === "none") {
            this._ios.tabBar.titleTextTransform = 1;
        }
        else if (value === "uppercase") {
            this._ios.tabBar.titleTextTransform = 2;
        }
        else if (value === "initial") {
            this._ios.tabBar.titleTextTransform = 0;
        }
    };
    Tabs.prototype.getTabBarColor = function () {
        return this._ios.tabBar.titleColorForState(0);
    };
    Tabs.prototype.setTabBarColor = function (value) {
        var nativeColor = value instanceof color_1.Color ? value.ios : value;
        this._ios.tabBar.setTitleColorForState(nativeColor, 0);
        this._ios.tabBar.setTitleColorForState(nativeColor, 1);
    };
    Tabs.prototype.getTabBarHighlightColor = function () {
        return this._ios.tabBar.tintColor;
    };
    Tabs.prototype.setTabBarHighlightColor = function (value) {
        var nativeColor = value instanceof color_1.Color ? value.ios : value;
        this._ios.tabBar.tintColor = nativeColor;
    };
    Tabs.prototype.getTabBarSelectedItemColor = function () {
        return this._selectedItemColor;
    };
    Tabs.prototype.setTabBarSelectedItemColor = function (value) {
        this._selectedItemColor = value;
        this.updateAllItemsColors();
    };
    Tabs.prototype.getTabBarUnSelectedItemColor = function () {
        return this._unSelectedItemColor;
    };
    Tabs.prototype.setTabBarUnSelectedItemColor = function (value) {
        this._unSelectedItemColor = value;
        this.updateAllItemsColors();
    };
    Tabs.prototype.visitFrames = function (view, operation) {
        var _this = this;
        if (view instanceof frame_1.Frame) {
            operation(view);
        }
        view.eachChild(function (child) {
            _this.visitFrames(child, operation);
            return true;
        });
    };
    Tabs.prototype[tab_navigation_base_1.selectedIndexProperty.setNative] = function (value) {
        var _this = this;
        if (value > -1) {
            var item_1 = this.items[value];
            var controllers_1 = NSMutableArray.alloc().initWithCapacity(1);
            var itemController = item_1.__controller;
            controllers_1.addObject(itemController);
            var navigationDirection_1 = 0;
            if (this._currentNativeSelectedIndex && this._currentNativeSelectedIndex > value) {
                navigationDirection_1 = 1;
            }
            this._currentNativeSelectedIndex = value;
            this.visitFrames(item_1, function (frame) { return frame._animationInProgress = true; });
            invokeOnRunLoop(function () { return _this.viewController.setViewControllersDirectionAnimatedCompletion(controllers_1, navigationDirection_1, _this.animationEnabled, function (finished) {
                _this.visitFrames(item_1, function (frame) { return frame._animationInProgress = false; });
                if (finished) {
                    invokeOnRunLoop(function () { return _this.viewController.setViewControllersDirectionAnimatedCompletion(controllers_1, navigationDirection_1, false, null); });
                    _this._canSelectItem = true;
                    _this._setCanBeLoaded(value);
                    _this._loadUnloadTabItems(value);
                }
            }); });
            if (this.tabBarItems && this.tabBarItems.length && this.viewController && this.viewController.tabBar) {
                this.viewController.tabBar.setSelectedItemAnimated(this.tabBarItems[value], this.animationEnabled);
            }
        }
    };
    Tabs.prototype[tab_navigation_base_1.itemsProperty.getDefault] = function () {
        return null;
    };
    Tabs.prototype[tab_navigation_base_1.itemsProperty.setNative] = function (value) {
        if (value) {
            value.forEach(function (item, i) {
                item.index = i;
            });
        }
        this.setViewControllers(value);
        tab_navigation_base_1.selectedIndexProperty.coerce(this);
    };
    Tabs.prototype[tab_navigation_base_1.tabStripProperty.getDefault] = function () {
        return null;
    };
    Tabs.prototype[tab_navigation_base_1.tabStripProperty.setNative] = function (value) {
        this.setViewControllers(this.items);
        tab_navigation_base_1.selectedIndexProperty.coerce(this);
    };
    Tabs.prototype[tabs_common_1.swipeEnabledProperty.getDefault] = function () {
        return true;
    };
    Tabs.prototype[tabs_common_1.swipeEnabledProperty.setNative] = function (value) {
        if (this.viewController && this.viewController.scrollView) {
            this.viewController.scrollView.scrollEnabled = value;
        }
    };
    Tabs.prototype[tabs_common_1.iOSTabBarItemsAlignmentProperty.getDefault] = function () {
        if (!this.viewController || !this.viewController.tabBar) {
            return "justified";
        }
        var alignment = this.viewController.tabBar.alignment.toString();
        return (alignment.charAt(0).toLowerCase() + alignment.substring(1));
    };
    Tabs.prototype[tabs_common_1.iOSTabBarItemsAlignmentProperty.setNative] = function (value) {
        if (!this.viewController || !this.viewController.tabBar) {
            return;
        }
        var alignment = 1;
        switch (value) {
            case "leading":
                alignment = 0;
                break;
            case "center":
                alignment = 2;
                break;
            case "centerSelected":
                alignment = 3;
                break;
        }
        this.viewController.tabBar.alignment = alignment;
    };
    Tabs.prototype.setViewTextAttributes = function (view, setSelected) {
        if (setSelected === void 0) { setSelected = false; }
        if (!view) {
            return null;
        }
        var defaultTabItemFontSize = 10;
        var tabItemFontSize = view.style.fontSize || defaultTabItemFontSize;
        var font = (view.style.fontInternal || font_1.Font.default).getUIFont(UIFont.systemFontOfSize(tabItemFontSize));
        this.viewController.tabBar.unselectedItemTitleFont = font;
        this.viewController.tabBar.selectedItemTitleFont = font;
        var tabItemTextColor = view.style.color;
        var textColor = tabItemTextColor instanceof color_1.Color ? tabItemTextColor.ios : null;
        if (textColor) {
            this.viewController.tabBar.setTitleColorForState(textColor, 0);
            this.viewController.tabBar.setImageTintColorForState(textColor, 0);
            if (setSelected) {
                this.viewController.tabBar.setTitleColorForState(textColor, 1);
                this.viewController.tabBar.setImageTintColorForState(textColor, 1);
            }
        }
        if (this._selectedItemColor) {
            this.viewController.tabBar.selectedItemTintColor = this._selectedItemColor.ios;
        }
        if (this._unSelectedItemColor) {
            this.viewController.tabBar.unselectedItemTintColor = this._unSelectedItemColor.ios;
        }
    };
    return Tabs;
}(tabs_common_1.TabsBase));
exports.Tabs = Tabs;
//# sourceMappingURL=tabs.ios.js.map