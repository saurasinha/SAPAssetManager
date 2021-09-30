"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var profiling_1 = require("tns-core-modules/profiling");
var app = require("tns-core-modules/application");
var view_1 = require("tns-core-modules/ui/core/view");
var mdk_sap_1 = require("mdk-sap");
var image_cache_1 = require("tns-core-modules/ui/image-cache");
var file_system_1 = require("tns-core-modules/file-system");
var image_source_1 = require("tns-core-modules/image-source");
var utils_1 = require("tns-core-modules/utils/utils");
var font_1 = require("tns-core-modules/ui/styling/font");
var mdk_sap_2 = require("mdk-sap");
var cache = new image_cache_1.Cache();
__export(require("tns-core-modules/ui/core/view"));
var ToolBarBase = (function (_super) {
    __extends(ToolBarBase, _super);
    function ToolBarBase() {
        var _this = _super.call(this) || this;
        _this._iconFontSize = 24;
        _this._toolbarItems = new ToolBarItems(_this);
        return _this;
    }
    Object.defineProperty(ToolBarBase.prototype, "barItems", {
        get: function () {
            return this._toolbarItems;
        },
        set: function (value) {
            throw new Error('barItems property is read-only');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolBarBase.prototype, "itemDisabledStyle", {
        get: function () {
            return this._itemDisabledStyle;
        },
        set: function (style) {
            this._itemDisabledStyle = style;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolBarBase.prototype, "containedItemStyle", {
        get: function () {
            return this._containedItemStyle;
        },
        set: function (style) {
            this._containedItemStyle = style;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolBarBase.prototype, "containedItemDisabledStyle", {
        get: function () {
            return this._containedItemDisabledStyle;
        },
        set: function (style) {
            this._containedItemDisabledStyle = style;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolBarBase.prototype, "itemFontIconStyle", {
        get: function () {
            return this._itemFontIconStyle;
        },
        set: function (style) {
            this._itemFontIconStyle = style;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolBarBase.prototype, "_childrenCount", {
        get: function () {
            var actionViewsCount = 0;
            this._toolbarItems.getItems().forEach(function (actionItem) {
                actionViewsCount++;
            });
            return actionViewsCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolBarBase.prototype, "android", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    ToolBarBase.prototype.update = function () {
    };
    ToolBarBase.prototype._onPositionChanged = function () {
    };
    ToolBarBase.prototype.eachChild = function (callback) {
        this.barItems.getItems().forEach(function (item) {
            callback(item);
        });
    };
    ToolBarBase.prototype._isEmpty = function () {
        if (this.barItems.getItems().length > 0) {
            return false;
        }
        return true;
    };
    ToolBarBase.prototype.getImageSourceFromIcon = function (icon, style) {
        var _this = this;
        var fileExtension;
        var imgSourcePromise = Promise.resolve(null);
        var dispImgSource;
        if (icon.lastIndexOf('https', 0) === 0) {
            var cachedImageSource = cache.get(icon);
            if (cachedImageSource) {
                imgSourcePromise = Promise.resolve(image_source_1.fromNativeSource(cachedImageSource));
            }
            else {
                return mdk_sap_1.CpmsSession.getInstance().sendRequest(icon)
                    .then(function (responseAndData) {
                    var mimeType = mdk_sap_2.HttpResponse.getMimeType(responseAndData);
                    var statusCode = mdk_sap_2.HttpResponse.getStatusCode(responseAndData);
                    if (statusCode >= 400 || mimeType.indexOf('image') === -1) {
                        return null;
                    }
                    var image = mdk_sap_2.HttpResponse.toImage(responseAndData);
                    dispImgSource = image_source_1.fromNativeSource(image);
                    if (app.android) {
                        cache.set(icon, dispImgSource.android);
                    }
                    else if (app.ios) {
                        fileExtension = mimeType.substring(mimeType.lastIndexOf('/') + 1);
                        dispImgSource = _this.resizeAndSaveImageSourceToFile(dispImgSource, icon, fileExtension);
                        cache.set(icon, dispImgSource.ios);
                    }
                    return dispImgSource;
                })
                    .catch(function () {
                    return null;
                });
            }
        }
        else if (utils_1.isDataURI(icon)) {
            var base64Data = icon.split(',')[1];
            if (base64Data !== undefined) {
                dispImgSource = image_source_1.ImageSource.fromBase64Sync(base64Data);
                if (app.ios) {
                    if (icon.lastIndexOf('data:image/png', 0) === 0) {
                        fileExtension = 'png';
                    }
                    else if (icon.lastIndexOf('data:image/jpg', 0) === 0) {
                        fileExtension = 'jpg';
                    }
                    else if (icon.lastIndexOf('data:image/jpeg', 0) === 0) {
                        fileExtension = 'jpeg';
                    }
                    dispImgSource = this.resizeAndSaveImageSourceToFile(dispImgSource, icon, fileExtension);
                }
                imgSourcePromise = Promise.resolve(dispImgSource);
            }
        }
        else if (utils_1.isFileOrResourcePath(icon)) {
            dispImgSource = image_source_1.ImageSource.fromFileOrResourceSync(icon);
            imgSourcePromise = Promise.resolve(dispImgSource);
        }
        else if (utils_1.isFontIconURI(icon)) {
            var fontCode = icon.replace('font://&#', '0').replace(';', '');
            if (fontCode !== '') {
                var fontCodeNum = void 0;
                if (typeof fontCode === 'string') {
                    fontCodeNum = Number(fontCode);
                }
                if (fontCodeNum) {
                    var fontCodeString = "font://" + String.fromCharCode(fontCodeNum);
                    var fontIconCode = fontCodeString.split('//')[1];
                    var itemStyle = style && style.color ? style : this.itemFontIconStyle;
                    var font = font_1.Font.default.withFontFamily('SAP-icons');
                    if (app.ios) {
                        font = font.withFontSize(this._iconFontSize);
                    }
                    dispImgSource = image_source_1.ImageSource.fromFontIconCodeSync(fontIconCode, font, itemStyle.color);
                    imgSourcePromise = Promise.resolve(dispImgSource);
                }
            }
        }
        return imgSourcePromise;
    };
    ToolBarBase.prototype.resizeAndSaveImageSourceToFile = function (dispImgSource, icon, fileExtension) {
        var saved = false;
        if (dispImgSource) {
            if (dispImgSource.ios) {
                var folderDest = file_system_1.knownFolders.documents();
                var fileName = this.returnFileName(folderDest);
                var pathDest = file_system_1.path.join(folderDest.path, fileName);
                var resizedImage = this.resizeImage(dispImgSource.ios);
                dispImgSource = image_source_1.fromNativeSource(resizedImage);
                switch (fileExtension) {
                    case 'jpg':
                        pathDest = pathDest + '.jpg';
                        saved = dispImgSource.saveToFile(pathDest, 'jpg');
                        break;
                    case 'jpeg':
                        pathDest = pathDest + '.jpeg';
                        saved = dispImgSource.saveToFile(pathDest, 'jpeg');
                        break;
                    case 'png':
                        pathDest = pathDest + '.png';
                        saved = dispImgSource.saveToFile(pathDest, 'png');
                        break;
                    default:
                        dispImgSource = undefined;
                        break;
                }
                if (saved) {
                    var imgData = NSData.dataWithContentsOfFile(pathDest);
                    dispImgSource = new image_source_1.ImageSource(UIImage.imageWithData(imgData));
                    var imgFile = file_system_1.File.fromPath(pathDest);
                    imgFile.removeSync();
                }
            }
        }
        return dispImgSource;
    };
    ToolBarBase.prototype.resizeImage = function (image) {
        var newSize = CGSizeMake(24, 24);
        UIGraphicsBeginImageContextWithOptions(newSize, false, 0.0);
        image.drawInRect(CGRectMake(0, 0, newSize.width, newSize.height));
        var newImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return newImage;
    };
    ToolBarBase.prototype.returnFileName = function (currentFolder) {
        var fileName;
        var fileNames = [];
        var entities = currentFolder.getEntitiesSync();
        entities.forEach(function (entity) {
            fileNames.push(entity.name.substring(0, entity.name.lastIndexOf('.')));
        });
        fileName = fileNames[0];
        while (fileNames.indexOf(fileName) !== -1) {
            fileName = (Math.floor(Math.random() * 100) + 1).toString();
        }
        return fileName;
    };
    return ToolBarBase;
}(view_1.View));
exports.ToolBarBase = ToolBarBase;
var ToolBarItems = (function () {
    function ToolBarItems(toolBar) {
        this._items = new Array();
        this._toolBar = toolBar;
    }
    ToolBarItems.prototype.addItem = function (item) {
        if (!item) {
            throw new Error('Cannot add empty item');
        }
        this._items.push(item);
        item.toolBar = this._toolBar;
        this._toolBar._addView(item);
    };
    ToolBarItems.prototype.removeItem = function (item) {
        if (!item) {
            throw new Error('Cannot remove empty item');
        }
        var itemIndex = this._items.indexOf(item);
        if (itemIndex < 0) {
            throw new Error('Cannot find item to remove');
        }
        this._items.splice(itemIndex, 1);
        this._toolBar._removeView(item);
        item.toolBar = undefined;
    };
    ToolBarItems.prototype.getItems = function () {
        return this._items.slice();
    };
    ToolBarItems.prototype.getVisibleItems = function () {
        var visibleItems = [];
        this._items.forEach(function (item) {
            if (isVisible(item)) {
                visibleItems.push(item);
            }
        });
        return visibleItems;
    };
    ToolBarItems.prototype.getItemAt = function (index) {
        if (index < 0 || index >= this._items.length) {
            return undefined;
        }
        return this._items[index];
    };
    ToolBarItems.prototype.setItems = function (items) {
        while (this._items.length > 0) {
            this.removeItem(this._items[this._items.length - 1]);
        }
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var i = items_1[_i];
            this.addItem(i);
        }
    };
    return ToolBarItems;
}());
exports.ToolBarItems = ToolBarItems;
var ToolBarItemBase = (function (_super) {
    __extends(ToolBarItemBase, _super);
    function ToolBarItemBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ToolBarItemBase.prototype, "actionView", {
        get: function () {
            return this._actionView;
        },
        set: function (value) {
            if (this._actionView !== value) {
                this.setActionView(value);
                if (this._toolBar) {
                    this._toolBar.update();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolBarItemBase.prototype, "spacingActionView", {
        get: function () {
            return this._spacingActionView;
        },
        set: function (value) {
            if (this._spacingActionView !== value) {
                this.setSpacingActionView(value);
                if (this._toolBar) {
                    this._toolBar.update();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolBarItemBase.prototype, "toolBar", {
        get: function () {
            return this._toolBar;
        },
        set: function (value) {
            if (value !== this._toolBar) {
                this._toolBar = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    ToolBarItemBase.prototype.onLoaded = function () {
        if (this._actionView) {
            this._actionView.style[view_1.horizontalAlignmentProperty.cssName] = 'center';
            this._actionView.style[view_1.verticalAlignmentProperty.cssName] = 'middle';
        }
        if (this._spacingActionView) {
            this._spacingActionView.style[view_1.horizontalAlignmentProperty.cssName] = 'center';
            this._spacingActionView.style[view_1.verticalAlignmentProperty.cssName] = 'middle';
        }
        _super.prototype.onLoaded.call(this);
    };
    ToolBarItemBase.prototype._addChildFromBuilder = function (name, value) {
        this.actionView = value;
    };
    ToolBarItemBase.prototype.eachChild = function (callback) {
        if (this._actionView) {
            callback(this._actionView);
        }
    };
    ToolBarItemBase.prototype.setActionView = function (value) {
        if (this._actionView !== value) {
            if (this._actionView) {
                this._actionView.style[view_1.horizontalAlignmentProperty.cssName] = view_1.unsetValue;
                this._actionView.style[view_1.verticalAlignmentProperty.cssName] = view_1.unsetValue;
                this._removeView(this._actionView);
            }
            this._actionView = value;
            if (this._actionView) {
                this._addView(this._actionView);
            }
        }
    };
    ToolBarItemBase.prototype.setSpacingActionView = function (value) {
        if (this._spacingActionView !== value) {
            if (this._spacingActionView) {
                this._spacingActionView.style[view_1.horizontalAlignmentProperty.cssName] = view_1.unsetValue;
                this._spacingActionView.style[view_1.verticalAlignmentProperty.cssName] = view_1.unsetValue;
                this._removeView(this._spacingActionView);
            }
            this._spacingActionView = value;
            if (this._spacingActionView) {
                this._addView(this._spacingActionView);
            }
        }
    };
    ToolBarItemBase.tapEvent = 'tap';
    __decorate([
        profiling_1.profile,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ToolBarItemBase.prototype, "onLoaded", null);
    return ToolBarItemBase;
}(view_1.View));
exports.ToolBarItemBase = ToolBarItemBase;
function isVisible(item) {
    return item.visibility === 'visible';
}
exports.isVisible = isVisible;
function onBarPropertyChanged(toolBar, oldValue, newValue) {
    toolBar._onPositionChanged();
}
var barPositionProperty = new view_1.Property({
    defaultValue: app.ios ? 0 : 0, name: 'barPosition', valueChanged: onBarPropertyChanged
});
barPositionProperty.register(ToolBarBase);
function onItemChanged(item, oldValue, newValue) {
    if (item.toolBar) {
        item.toolBar.update();
    }
}
var textProperty = new view_1.Property({
    defaultValue: '', name: 'text', valueChanged: onItemChanged
});
textProperty.register(ToolBarItemBase);
var itemStyleProperty = new view_1.Property({
    defaultValue: null, name: 'itemStyle', valueChanged: onItemChanged
});
itemStyleProperty.register(ToolBarItemBase);
var iconProperty = new view_1.Property({
    defaultValue: null, name: 'icon', valueChanged: onItemChanged
});
iconProperty.register(ToolBarItemBase);
var visibilityProperty = new view_1.Property({
    defaultValue: 'visible', name: 'visibility', valueChanged: onItemChanged
});
visibilityProperty.register(ToolBarItemBase);
var enabledProperty = new view_1.Property({
    defaultValue: true, name: 'enabled', valueChanged: onItemChanged
});
enabledProperty.register(ToolBarItemBase);
var clickableProperty = new view_1.Property({
    defaultValue: true, name: 'clickable', valueChanged: onItemChanged
});
clickableProperty.register(ToolBarItemBase);
var tagProperty = new view_1.Property({
    defaultValue: 0, name: 'tag', valueChanged: onItemChanged
});
tagProperty.register(ToolBarItemBase);
var widthProperty = new view_1.Property({
    defaultValue: 0.0, name: 'width', valueChanged: onItemChanged
});
widthProperty.register(ToolBarItemBase);
var systemItemProperty = new view_1.Property({
    defaultValue: undefined, name: 'systemItem', valueChanged: onItemChanged
});
systemItemProperty.register(ToolBarItemBase);
var itemTypeProperty = new view_1.Property({
    defaultValue: 'normal', name: 'itemType', valueChanged: onItemChanged
});
itemTypeProperty.register(ToolBarItemBase);
var nameProperty = new view_1.Property({
    defaultValue: '', name: 'name', valueChanged: onItemChanged
});
nameProperty.register(ToolBarItemBase);
var toolbarProperty = new view_1.Property({
    defaultValue: null, name: '_toolbar', valueChanged: onItemChanged
});
toolbarProperty.register(ToolBarItemBase);
var SystemItemBase = (function () {
    function SystemItemBase() {
    }
    SystemItemBase.isValid = function (key) {
        if (this.systemItemEnum) {
            var item = Object.keys(this.systemItemEnum).filter(function (k) { return k === key; });
            return item ? item.length > 0 : false;
        }
        return false;
    };
    SystemItemBase.parse = function (key, style) {
        if (this.isValid(key)) {
            return this.systemItemEnum[key];
        }
        return undefined;
    };
    Object.defineProperty(SystemItemBase, "systemItemEnum", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    return SystemItemBase;
}());
exports.SystemItemBase = SystemItemBase;
var ItemTypeBase = (function () {
    function ItemTypeBase() {
    }
    ItemTypeBase.isValid = function (key) {
        if (this.itemTypeEnum) {
            var item = Object.keys(this.itemTypeEnum).filter(function (k) { return k === key; });
            return item ? item.length > 0 : false;
        }
        return false;
    };
    ItemTypeBase.parse = function (key) {
        if (this.isValid(key)) {
            return this.itemTypeEnum[key];
        }
        return undefined;
    };
    Object.defineProperty(ItemTypeBase, "itemTypeEnum", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    return ItemTypeBase;
}());
exports.ItemTypeBase = ItemTypeBase;
