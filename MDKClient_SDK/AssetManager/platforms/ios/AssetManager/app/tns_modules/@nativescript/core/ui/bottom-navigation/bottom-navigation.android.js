function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var tab_strip_1 = require("../tab-navigation-base/tab-strip");
var tab_strip_item_1 = require("../tab-navigation-base/tab-strip-item");
var application = require("../../application");
var image_source_1 = require("../../image-source");
var utils_1 = require("../../utils/utils");
var view_1 = require("../core/view");
var frame_1 = require("../frame");
var tab_navigation_base_1 = require("../tab-navigation-base/tab-navigation-base");
var text_base_1 = require("../text-base");
__export(require("../tab-navigation-base/tab-content-item"));
__export(require("../tab-navigation-base/tab-navigation-base"));
__export(require("../tab-navigation-base/tab-strip"));
__export(require("../tab-navigation-base/tab-strip-item"));
var PRIMARY_COLOR = "colorPrimary";
var DEFAULT_ELEVATION = 8;
var TABID = "_tabId";
var INDEX = "_index";
var ownerSymbol = Symbol("_owner");
var TabFragment;
var BottomNavigationBar;
var AttachStateChangeListener;
var appResources;
var IconInfo = (function () {
    function IconInfo() {
    }
    return IconInfo;
}());
function makeFragmentName(viewId, id) {
    return "android:bottomnavigation:" + viewId + ":" + id;
}
function getTabById(id) {
    var ref = exports.tabs.find(function (ref) {
        var tab = ref.get();
        return tab && tab._domId === id;
    });
    return ref && ref.get();
}
function initializeNativeClasses() {
    if (BottomNavigationBar) {
        return;
    }
    var TabFragmentImplementation = (function (_super) {
        __extends(TabFragmentImplementation, _super);
        function TabFragmentImplementation() {
            var _this = _super.call(this) || this;
            _this.backgroundBitmap = null;
            return global.__native(_this);
        }
        TabFragmentImplementation.newInstance = function (tabId, index) {
            var args = new android.os.Bundle();
            args.putInt(TABID, tabId);
            args.putInt(INDEX, index);
            var fragment = new TabFragmentImplementation();
            fragment.setArguments(args);
            return fragment;
        };
        TabFragmentImplementation.prototype.onCreate = function (savedInstanceState) {
            _super.prototype.onCreate.call(this, savedInstanceState);
            var args = this.getArguments();
            this.owner = getTabById(args.getInt(TABID));
            this.index = args.getInt(INDEX);
            if (!this.owner) {
                throw new Error("Cannot find BottomNavigation");
            }
        };
        TabFragmentImplementation.prototype.onCreateView = function (inflater, container, savedInstanceState) {
            var tabItem = this.owner.items[this.index];
            return tabItem.nativeViewProtected;
        };
        TabFragmentImplementation.prototype.onDestroyView = function () {
            var hasRemovingParent = this.getRemovingParentFragment();
            if (hasRemovingParent && this.owner.selectedIndex === this.index) {
                var bitmapDrawable = new android.graphics.drawable.BitmapDrawable(appResources, this.backgroundBitmap);
                this.owner._originalBackground = this.owner.backgroundColor || new view_1.Color("White");
                this.owner.nativeViewProtected.setBackgroundDrawable(bitmapDrawable);
                this.backgroundBitmap = null;
                var thisView = this.getView();
                if (thisView) {
                    var thisViewParent = thisView.getParent();
                    if (thisViewParent && thisViewParent instanceof android.view.ViewGroup) {
                        thisViewParent.removeView(thisView);
                    }
                }
            }
            _super.prototype.onDestroyView.call(this);
        };
        TabFragmentImplementation.prototype.onPause = function () {
            var hasRemovingParent = this.getRemovingParentFragment();
            if (hasRemovingParent && this.owner.selectedIndex === this.index) {
                this.backgroundBitmap = this.loadBitmapFromView(this.owner.nativeViewProtected);
            }
            _super.prototype.onPause.call(this);
        };
        TabFragmentImplementation.prototype.loadBitmapFromView = function (view) {
            view.setDrawingCacheEnabled(true);
            var bitmap = android.graphics.Bitmap.createBitmap(view.getDrawingCache());
            view.setDrawingCacheEnabled(false);
            return bitmap;
        };
        return TabFragmentImplementation;
    }(org.nativescript.widgets.FragmentBase));
    var BottomNavigationBarImplementation = (function (_super) {
        __extends(BottomNavigationBarImplementation, _super);
        function BottomNavigationBarImplementation(context, owner) {
            var _this = _super.call(this, context) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        BottomNavigationBarImplementation.prototype.onSelectedPositionChange = function (position, prevPosition) {
            var owner = this.owner;
            if (!owner) {
                return;
            }
            owner.changeTab(position);
            var tabStripItems = owner.tabStrip && owner.tabStrip.items;
            if (position >= 0 && tabStripItems && tabStripItems[position]) {
                tabStripItems[position]._emit(tab_strip_item_1.TabStripItem.selectEvent);
            }
            if (prevPosition >= 0 && tabStripItems && tabStripItems[prevPosition]) {
                tabStripItems[prevPosition]._emit(tab_strip_item_1.TabStripItem.unselectEvent);
            }
            owner._setItemsColors(owner.tabStrip.items);
        };
        BottomNavigationBarImplementation.prototype.onTap = function (position) {
            var owner = this.owner;
            if (!owner) {
                return false;
            }
            var tabStrip = owner.tabStrip;
            var tabStripItems = tabStrip && tabStrip.items;
            if (position >= 0 && tabStripItems[position]) {
                tabStripItems[position]._emit(tab_strip_item_1.TabStripItem.tapEvent);
                tabStrip.notify({ eventName: tab_strip_1.TabStrip.itemTapEvent, object: tabStrip, index: position });
            }
            if (!owner.items[position]) {
                return false;
            }
            return true;
        };
        return BottomNavigationBarImplementation;
    }(org.nativescript.widgets.BottomNavigationBar));
    var AttachListener = (function (_super) {
        __extends(AttachListener, _super);
        function AttachListener() {
            var _this = _super.call(this) || this;
            return global.__native(_this);
        }
        AttachListener.prototype.onViewAttachedToWindow = function (view) {
            var owner = view[ownerSymbol];
            if (owner) {
                owner._onAttachedToWindow();
            }
        };
        AttachListener.prototype.onViewDetachedFromWindow = function (view) {
            var owner = view[ownerSymbol];
            if (owner) {
                owner._onDetachedFromWindow();
            }
        };
        AttachListener = __decorate([
            Interfaces([android.view.View.OnAttachStateChangeListener])
        ], AttachListener);
        return AttachListener;
    }(java.lang.Object));
    TabFragment = TabFragmentImplementation;
    BottomNavigationBar = BottomNavigationBarImplementation;
    AttachStateChangeListener = new AttachListener();
    appResources = application.android.context.getResources();
}
function setElevation(bottomNavigationBar) {
    var compat = androidx.core.view.ViewCompat;
    if (compat.setElevation) {
        var val = DEFAULT_ELEVATION * utils_1.layout.getDisplayDensity();
        compat.setElevation(bottomNavigationBar, val);
    }
}
exports.tabs = new Array();
function iterateIndexRange(index, eps, lastIndex, callback) {
    var rangeStart = Math.max(0, index - eps);
    var rangeEnd = Math.min(index + eps, lastIndex);
    for (var i = rangeStart; i <= rangeEnd; i++) {
        callback(i);
    }
}
var BottomNavigation = (function (_super) {
    __extends(BottomNavigation, _super);
    function BottomNavigation() {
        var _this = _super.call(this) || this;
        _this._contentViewId = -1;
        _this._attachedToWindow = false;
        _this._textTransform = "none";
        exports.tabs.push(new WeakRef(_this));
        return _this;
    }
    Object.defineProperty(BottomNavigation.prototype, "_hasFragments", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    BottomNavigation.prototype.onItemsChanged = function (oldItems, newItems) {
        _super.prototype.onItemsChanged.call(this, oldItems, newItems);
        if (oldItems) {
            oldItems.forEach(function (item, i, arr) {
                item.index = 0;
                item.tabItemSpec = null;
                item.setNativeView(null);
            });
        }
    };
    BottomNavigation.prototype.createNativeView = function () {
        initializeNativeClasses();
        var context = this._context;
        var nativeView = new org.nativescript.widgets.GridLayout(context);
        nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
        nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
        var contentView = new org.nativescript.widgets.ContentLayout(this._context);
        var contentViewLayoutParams = new org.nativescript.widgets.CommonLayoutParams();
        contentViewLayoutParams.row = 0;
        contentView.setLayoutParams(contentViewLayoutParams);
        nativeView.addView(contentView);
        nativeView.contentView = contentView;
        var bottomNavigationBar = new BottomNavigationBar(context, this);
        var bottomNavigationBarLayoutParams = new org.nativescript.widgets.CommonLayoutParams();
        bottomNavigationBarLayoutParams.row = 1;
        bottomNavigationBar.setLayoutParams(bottomNavigationBarLayoutParams);
        nativeView.addView(bottomNavigationBar);
        nativeView.bottomNavigationBar = bottomNavigationBar;
        setElevation(bottomNavigationBar);
        var primaryColor = utils_1.ad.resources.getPaletteColor(PRIMARY_COLOR, context);
        if (primaryColor) {
            bottomNavigationBar.setBackgroundColor(primaryColor);
        }
        return nativeView;
    };
    BottomNavigation.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        if (this._contentViewId < 0) {
            this._contentViewId = android.view.View.generateViewId();
        }
        var nativeView = this.nativeViewProtected;
        nativeView.addOnAttachStateChangeListener(AttachStateChangeListener);
        nativeView[ownerSymbol] = this;
        this._contentView = nativeView.contentView;
        this._contentView.setId(this._contentViewId);
        this._bottomNavigationBar = nativeView.bottomNavigationBar;
        this._bottomNavigationBar.owner = this;
        if (this.tabStrip) {
            this.tabStrip.setNativeView(this._bottomNavigationBar);
        }
    };
    BottomNavigation.prototype._loadUnloadTabItems = function (newIndex) {
        var _this = this;
        var items = this.items;
        var lastIndex = this.items.length - 1;
        var offsideItems = 0;
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
    BottomNavigation.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        if (this._originalBackground) {
            this.backgroundColor = null;
            this.backgroundColor = this._originalBackground;
            this._originalBackground = null;
        }
        if (this.tabStrip) {
            this.setTabStripItems(this.tabStrip.items);
        }
        else {
            this._bottomNavigationBar.setVisibility(android.view.View.GONE);
        }
        this.changeTab(this.selectedIndex);
    };
    BottomNavigation.prototype._onAttachedToWindow = function () {
        _super.prototype._onAttachedToWindow.call(this);
        if (this._manager && this._manager.isDestroyed()) {
            return;
        }
        this._attachedToWindow = true;
        this.changeTab(this.selectedIndex);
    };
    BottomNavigation.prototype._onDetachedFromWindow = function () {
        _super.prototype._onDetachedFromWindow.call(this);
        this._attachedToWindow = false;
    };
    BottomNavigation.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
        if (this.tabStrip) {
            this.setTabStripItems(null);
        }
        var fragmentToDetach = this._currentFragment;
        if (fragmentToDetach) {
            this.destroyItem(fragmentToDetach.index, fragmentToDetach);
            this.removeFragment(fragmentToDetach);
        }
    };
    BottomNavigation.prototype.disposeNativeView = function () {
        this._bottomNavigationBar.setItems(null);
        this._bottomNavigationBar = null;
        this.nativeViewProtected.removeOnAttachStateChangeListener(AttachStateChangeListener);
        this.nativeViewProtected[ownerSymbol] = null;
        _super.prototype.disposeNativeView.call(this);
    };
    BottomNavigation.prototype._onRootViewReset = function () {
        _super.prototype._onRootViewReset.call(this);
        this.disposeTabFragments();
    };
    BottomNavigation.prototype.disposeTabFragments = function () {
        var fragmentManager = this._getFragmentManager();
        var fragments = fragmentManager.getFragments().toArray();
        for (var i = 0; i < fragments.length; i++) {
            this.removeFragment(fragments[i]);
        }
    };
    BottomNavigation.prototype.attachFragment = function (fragment, id, name) {
        var fragmentManager = this._getFragmentManager();
        if (fragment) {
            if (fragment.isAdded() || fragment.isRemoving()) {
            }
            else {
                var fragmentExitTransition = fragment.getExitTransition();
                if (fragmentExitTransition && fragmentExitTransition instanceof org.nativescript.widgets.CustomTransition) {
                    fragmentExitTransition.setResetOnTransitionEnd(true);
                }
                if (fragmentManager) {
                    if (!fragmentManager.isDestroyed()) {
                        try {
                            if (fragmentManager.isStateSaved()) {
                                if (id && name) {
                                    fragmentManager.beginTransaction().add(id, fragment, name).commitNowAllowingStateLoss();
                                }
                                else {
                                    fragmentManager.beginTransaction().attach(fragment).commitNowAllowingStateLoss();
                                }
                            }
                            else {
                                if (id && name) {
                                    fragmentManager.beginTransaction().add(id, fragment, name).commitNow();
                                }
                                else {
                                    fragmentManager.beginTransaction().attach(fragment).commitNow();
                                }
                            }
                        }
                        catch (e) { }
                    }
                }
            }
        }
    };
    BottomNavigation.prototype.changeTab = function (index) {
        if (index === -1 || !this._attachedToWindow) {
            return;
        }
        var fragmentToDetach = this._currentFragment;
        if (fragmentToDetach) {
            this.destroyItem(fragmentToDetach.index, fragmentToDetach);
        }
        var fragment = this.instantiateItem(this._contentView, index);
        this.setPrimaryItem(index, fragment);
    };
    BottomNavigation.prototype.instantiateItem = function (container, position) {
        var name = makeFragmentName(container.getId(), position);
        var fragmentManager = this._getFragmentManager();
        var fragment = fragmentManager.findFragmentByTag(name);
        if (fragment != null) {
            this.attachFragment(fragment);
        }
        else {
            fragment = TabFragment.newInstance(this._domId, position);
            this.attachFragment(fragment, container.getId(), name);
        }
        if (fragment !== this._currentFragment) {
            fragment.setMenuVisibility(false);
            fragment.setUserVisibleHint(false);
        }
        return fragment;
    };
    BottomNavigation.prototype.setPrimaryItem = function (position, fragment) {
        if (fragment !== this._currentFragment) {
            if (this._currentFragment != null) {
                this._currentFragment.setMenuVisibility(false);
                this._currentFragment.setUserVisibleHint(false);
            }
            if (fragment != null) {
                fragment.setMenuVisibility(true);
            }
            this._currentFragment = fragment;
            this.selectedIndex = position;
            var tabItems = this.items;
            var tabItem = tabItems ? tabItems[position] : null;
            if (tabItem) {
                tabItem.canBeLoaded = true;
                this._loadUnloadTabItems(position);
            }
        }
    };
    BottomNavigation.prototype.destroyItem = function (position, fragment) {
        if (fragment) {
            this.removeFragment(fragment);
            if (this._currentFragment === fragment) {
                this._currentFragment = null;
            }
        }
        if (this.items && this.items[position]) {
            this.items[position].canBeLoaded = false;
        }
    };
    BottomNavigation.prototype.removeFragment = function (fragment, fragmentManager) {
        if (!fragmentManager) {
            fragmentManager = this._getFragmentManager();
        }
        if (fragment) {
            if (!fragment.isAdded() || fragment.isRemoving()) {
                return;
            }
            else {
                var fragmentExitTransition = fragment.getExitTransition();
                if (fragmentExitTransition && fragmentExitTransition instanceof org.nativescript.widgets.CustomTransition) {
                    fragmentExitTransition.setResetOnTransitionEnd(true);
                }
                if (fragment && fragment.isAdded() && !fragment.isRemoving()) {
                    var pfm = fragment.getParentFragmentManager ? fragment.getParentFragmentManager() : fragmentManager;
                    if (pfm) {
                        try {
                            if (pfm.isStateSaved()) {
                                pfm.beginTransaction().remove(fragment).commitNowAllowingStateLoss();
                            }
                            else {
                                pfm.beginTransaction().remove(fragment).commitNow();
                            }
                        }
                        catch (e) { }
                    }
                }
            }
        }
    };
    BottomNavigation.prototype.setTabStripItems = function (items) {
        var _this = this;
        if (!this.tabStrip || !items) {
            this._bottomNavigationBar.setItems(null);
            return;
        }
        var tabItems = new Array();
        items.forEach(function (tabStripItem, i, arr) {
            tabStripItem._index = i;
            if (items[i]) {
                var tabItemSpec = _this.createTabItemSpec(items[i]);
                tabItems.push(tabItemSpec);
            }
        });
        this._bottomNavigationBar.setItems(tabItems);
        items.forEach(function (item, i, arr) {
            var textView = _this._bottomNavigationBar.getTextViewForItemAt(i);
            item.setNativeView(textView);
            _this._setItemColor(item);
        });
    };
    BottomNavigation.prototype.getItemLabelTextTransform = function (tabStripItem) {
        var nestedLabel = tabStripItem.label;
        var textTransform = null;
        if (nestedLabel && nestedLabel.style.textTransform !== "initial") {
            textTransform = nestedLabel.style.textTransform;
        }
        else if (tabStripItem.style.textTransform !== "initial") {
            textTransform = tabStripItem.style.textTransform;
        }
        return textTransform || this._textTransform;
    };
    BottomNavigation.prototype.createTabItemSpec = function (tabStripItem) {
        var tabItemSpec = new org.nativescript.widgets.TabItemSpec();
        if (tabStripItem.isLoaded) {
            var titleLabel = tabStripItem.label;
            var title = titleLabel.text;
            var textTransform = this.getItemLabelTextTransform(tabStripItem);
            title = text_base_1.getTransformedText(title, textTransform);
            tabItemSpec.title = title;
            var backgroundColor = tabStripItem.style.backgroundColor;
            tabItemSpec.backgroundColor = backgroundColor ? backgroundColor.android : this.getTabBarBackgroundArgbColor();
            var itemColor = this.selectedIndex === tabStripItem._index ? this._selectedItemColor : this._unSelectedItemColor;
            var color = itemColor || titleLabel.style.color;
            tabItemSpec.color = color && color.android;
            var fontInternal = titleLabel.style.fontInternal;
            if (fontInternal) {
                tabItemSpec.fontSize = fontInternal.fontSize;
                tabItemSpec.typeFace = fontInternal.getAndroidTypeface();
            }
            var iconSource = tabStripItem.image && tabStripItem.image.src;
            if (iconSource) {
                var iconInfo = this.getIconInfo(tabStripItem, itemColor);
                if (iconInfo) {
                    tabItemSpec.iconDrawable = iconInfo.drawable;
                    tabItemSpec.imageHeight = iconInfo.height;
                }
                else {
                }
            }
        }
        return tabItemSpec;
    };
    BottomNavigation.prototype.getOriginalIcon = function (tabStripItem, color) {
        var iconSource = tabStripItem.image && tabStripItem.image.src;
        if (!iconSource) {
            return null;
        }
        var is;
        if (utils_1.isFontIconURI(iconSource)) {
            var fontIconCode = iconSource.split("//")[1];
            var target = tabStripItem.image ? tabStripItem.image : tabStripItem;
            var font = target.style.fontInternal;
            if (!color) {
                color = target.style.color;
            }
            is = image_source_1.ImageSource.fromFontIconCodeSync(fontIconCode, font, color);
        }
        else {
            is = image_source_1.ImageSource.fromFileOrResourceSync(iconSource);
        }
        return is && is.android;
    };
    BottomNavigation.prototype.getDrawableInfo = function (image) {
        if (image) {
            if (this.tabStrip && this.tabStrip.isIconSizeFixed) {
                image = this.getFixedSizeIcon(image);
            }
            var imageDrawable = new android.graphics.drawable.BitmapDrawable(application.android.context.getResources(), image);
            return {
                drawable: imageDrawable,
                height: image.getHeight()
            };
        }
        return new IconInfo();
    };
    BottomNavigation.prototype.getIconInfo = function (tabStripItem, color) {
        var originalIcon = this.getOriginalIcon(tabStripItem, color);
        return this.getDrawableInfo(originalIcon);
    };
    BottomNavigation.prototype.getFixedSizeIcon = function (image) {
        var inWidth = image.getWidth();
        var inHeight = image.getHeight();
        var iconSpecSize = tab_navigation_base_1.getIconSpecSize({ width: inWidth, height: inHeight });
        var widthPixels = iconSpecSize.width * utils_1.layout.getDisplayDensity();
        var heightPixels = iconSpecSize.height * utils_1.layout.getDisplayDensity();
        var scaledImage = android.graphics.Bitmap.createScaledBitmap(image, widthPixels, heightPixels, true);
        return scaledImage;
    };
    BottomNavigation.prototype.updateAndroidItemAt = function (index, spec) {
        try {
            this._bottomNavigationBar.updateItemAt(index, spec);
        }
        catch (err) {
        }
    };
    BottomNavigation.prototype.getTabBarBackgroundColor = function () {
        return this._bottomNavigationBar.getBackground();
    };
    BottomNavigation.prototype.setTabBarBackgroundColor = function (value) {
        if (value instanceof view_1.Color) {
            this._bottomNavigationBar.setBackgroundColor(value.android);
        }
        else {
            this._bottomNavigationBar.setBackground(tryCloneDrawable(value, this.nativeViewProtected.getResources()));
        }
        this.updateTabStripItems();
    };
    BottomNavigation.prototype.updateTabStripItems = function () {
        var _this = this;
        this.tabStrip.items.forEach(function (tabStripItem) {
            if (tabStripItem.nativeView) {
                var tabItemSpec = _this.createTabItemSpec(tabStripItem);
                _this.updateAndroidItemAt(tabStripItem._index, tabItemSpec);
            }
        });
    };
    BottomNavigation.prototype._setItemsColors = function (items) {
        var _this = this;
        items.forEach(function (item) {
            if (item.nativeView) {
                _this._setItemColor(item);
            }
        });
    };
    BottomNavigation.prototype.getTabBarSelectedItemColor = function () {
        return this._selectedItemColor;
    };
    BottomNavigation.prototype.setTabBarSelectedItemColor = function (value) {
        this._selectedItemColor = value;
        this._setItemsColors(this.tabStrip.items);
    };
    BottomNavigation.prototype.getTabBarUnSelectedItemColor = function () {
        return this._unSelectedItemColor;
    };
    BottomNavigation.prototype.setTabBarUnSelectedItemColor = function (value) {
        this._unSelectedItemColor = value;
        this._setItemsColors(this.tabStrip.items);
    };
    BottomNavigation.prototype.updateItem = function (tabStripItem) {
        var tabStripItemIndex = this.tabStrip.items.indexOf(tabStripItem);
        var tabItemSpec = this.createTabItemSpec(tabStripItem);
        this.updateAndroidItemAt(tabStripItemIndex, tabItemSpec);
    };
    BottomNavigation.prototype.setTabBarItemTitle = function (tabStripItem, value) {
        this.updateItem(tabStripItem);
    };
    BottomNavigation.prototype.setTabBarItemBackgroundColor = function (tabStripItem, value) {
        this.updateItem(tabStripItem);
    };
    BottomNavigation.prototype._setItemColor = function (tabStripItem) {
        var itemColor = (tabStripItem._index === this.selectedIndex) ? this._selectedItemColor : this._unSelectedItemColor;
        if (!itemColor) {
            return;
        }
        tabStripItem.nativeViewProtected.setTextColor(itemColor.android);
        this.setIconColor(tabStripItem, itemColor);
    };
    BottomNavigation.prototype.setIconColor = function (tabStripItem, color) {
        try {
            var tabBarItem = this._bottomNavigationBar.getViewForItemAt(tabStripItem._index);
            var drawableInfo = this.getIconInfo(tabStripItem, color);
            var imgView = tabBarItem.getChildAt(0);
            imgView.setImageDrawable(drawableInfo.drawable);
            if (color) {
                imgView.setColorFilter(color.android);
            }
        }
        catch (err) {
        }
    };
    BottomNavigation.prototype.setTabBarItemColor = function (tabStripItem, value) {
        var itemColor = (tabStripItem._index === this.selectedIndex) ? this._selectedItemColor : this._unSelectedItemColor;
        if (itemColor) {
            return;
        }
        var androidColor = value instanceof view_1.Color ? value.android : value;
        tabStripItem.nativeViewProtected.setTextColor(androidColor);
    };
    BottomNavigation.prototype.setTabBarIconColor = function (tabStripItem, value) {
        var itemColor = (tabStripItem._index === this.selectedIndex) ? this._selectedItemColor : this._unSelectedItemColor;
        if (itemColor) {
            return;
        }
        this.setIconColor(tabStripItem);
    };
    BottomNavigation.prototype.setTabBarIconSource = function (tabStripItem, value) {
        this.updateItem(tabStripItem);
    };
    BottomNavigation.prototype.setTabBarItemFontInternal = function (tabStripItem, value) {
        if (value.fontSize) {
            tabStripItem.nativeViewProtected.setTextSize(value.fontSize);
        }
        tabStripItem.nativeViewProtected.setTypeface(value.getAndroidTypeface());
    };
    BottomNavigation.prototype.setTabBarItemTextTransform = function (tabStripItem, value) {
        var titleLabel = tabStripItem.label;
        var title = text_base_1.getTransformedText(titleLabel.text, value);
        tabStripItem.nativeViewProtected.setText(title);
    };
    BottomNavigation.prototype.getTabBarTextTransform = function () {
        return this._textTransform;
    };
    BottomNavigation.prototype.setTabBarTextTransform = function (value) {
        var items = this.tabStrip && this.tabStrip.items;
        if (items) {
            items.forEach(function (tabStripItem) {
                if (tabStripItem.label && tabStripItem.nativeViewProtected) {
                    var nestedLabel = tabStripItem.label;
                    var title = text_base_1.getTransformedText(nestedLabel.text, value);
                    tabStripItem.nativeViewProtected.setText(title);
                }
            });
        }
        this._textTransform = value;
    };
    BottomNavigation.prototype[tab_navigation_base_1.selectedIndexProperty.setNative] = function (value) {
        if (this.tabStrip) {
            this._bottomNavigationBar.setSelectedPosition(value);
        }
        else {
            this.changeTab(value);
        }
    };
    BottomNavigation.prototype[tab_navigation_base_1.itemsProperty.getDefault] = function () {
        return null;
    };
    BottomNavigation.prototype[tab_navigation_base_1.itemsProperty.setNative] = function (value) {
        if (value) {
            value.forEach(function (item, i) {
                item.index = i;
            });
        }
        tab_navigation_base_1.selectedIndexProperty.coerce(this);
    };
    BottomNavigation.prototype[tab_navigation_base_1.tabStripProperty.getDefault] = function () {
        return null;
    };
    BottomNavigation.prototype[tab_navigation_base_1.tabStripProperty.setNative] = function (value) {
        var items = this.tabStrip ? this.tabStrip.items : null;
        this.setTabStripItems(items);
    };
    BottomNavigation = __decorate([
        view_1.CSSType("BottomNavigation")
    ], BottomNavigation);
    return BottomNavigation;
}(tab_navigation_base_1.TabNavigationBase));
exports.BottomNavigation = BottomNavigation;
function tryCloneDrawable(value, resources) {
    if (value) {
        var constantState = value.getConstantState();
        if (constantState) {
            return constantState.newDrawable(resources);
        }
    }
    return value;
}
//# sourceMappingURL=bottom-navigation.android.js.map