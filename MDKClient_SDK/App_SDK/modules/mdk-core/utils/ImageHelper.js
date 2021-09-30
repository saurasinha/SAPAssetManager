"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mdk_sap_1 = require("mdk-sap");
var file_system_1 = require("tns-core-modules/file-system");
var image_source_1 = require("tns-core-modules/image-source");
var app = require("tns-core-modules/application");
var Logger_1 = require("./Logger");
var utils_1 = require("tns-core-modules/utils/utils");
var I18nFormatter_1 = require("./I18nFormatter");
var font_1 = require("tns-core-modules/ui/styling/font");
var color_1 = require("tns-core-modules/color");
var CssPropertyParser_1 = require("./CssPropertyParser");
var StyleHelper_1 = require("./StyleHelper");
var sha256 = require("crypto-js/sha256");
var page_1 = require("tns-core-modules/ui/page");
var mdk_sap_2 = require("mdk-sap");
var ClientSettings_1 = require("../storage/ClientSettings");
var IMAGE_CACHE_FOLDER_NAME = 'imageCache';
var ImageHelper = (function () {
    function ImageHelper() {
    }
    ImageHelper.resExist = function (resUrl) {
        return !!image_source_1.ImageSource.fromResourceSync(resUrl.substring('res://'.length));
    };
    ImageHelper.fileExist = function (filePath) {
        return file_system_1.File.exists(filePath);
    };
    ImageHelper.processIcon = function (icon, width, height, isIconCircular) {
        var _this = this;
        var itemIconPromise;
        if (icon.lastIndexOf('https', 0) === 0) {
            var cachedImagePath = void 0;
            if (isIconCircular) {
                cachedImagePath = this.checkIfImageAlreadyDownloaded(icon + '/circular');
            }
            else {
                cachedImagePath = this.checkIfImageAlreadyDownloaded(icon);
            }
            if (cachedImagePath) {
                itemIconPromise = Promise.resolve(cachedImagePath);
            }
            else if (ClientSettings_1.ClientSettings.isDemoMode()) {
                itemIconPromise = Promise.reject();
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
                    var dispImgSource = image_source_1.fromNativeSource(image);
                    var fileExtension = mimeType.substring(mimeType.lastIndexOf('/') + 1);
                    var pathDest = _this.resizeAndSaveImageSourceToFile(dispImgSource, fileExtension, icon, width, height, isIconCircular);
                    if (pathDest && pathDest !== '') {
                        if (isIconCircular) {
                            ImageHelper.cache.set(icon + '/circular', pathDest);
                        }
                        else {
                            ImageHelper.cache.set(icon, pathDest);
                        }
                    }
                    return pathDest;
                })
                    .catch(function (e) {
                    Logger_1.Logger.instance.core.error("Failed to process icon: " + e);
                    return Promise.reject();
                });
            }
        }
        else if (utils_1.isDataURI(icon)) {
            var base64Data = icon.split(',')[1];
            if (base64Data !== undefined) {
                return image_source_1.ImageSource.fromBase64(base64Data).then(function (dispImgSource) {
                    var fileExt = '';
                    if (icon.lastIndexOf('data:image/png', 0) === 0) {
                        fileExt = 'png';
                    }
                    else if (icon.lastIndexOf('data:image/jpg', 0) === 0) {
                        fileExt = 'jpg';
                    }
                    else if (icon.lastIndexOf('data:image/jpeg', 0) === 0) {
                        fileExt = 'jpeg';
                    }
                    var pathDest = _this.resizeAndSaveImageSourceToFile(dispImgSource, fileExt, icon, width, height, isIconCircular);
                    return pathDest;
                });
            }
            else {
                itemIconPromise = Promise.resolve(icon);
            }
        }
        else if (utils_1.isFontIconURI(icon)) {
            var fontCode = icon.replace('font://&#', '0').replace(';', '');
            if (fontCode !== '') {
                var fontCodeNum = I18nFormatter_1.I18nFormatter.validateNumber(fontCode);
                if (fontCodeNum) {
                    itemIconPromise = Promise.resolve("font://" + String.fromCharCode(fontCodeNum));
                }
                else {
                    Logger_1.Logger.instance.ui.warn(Logger_1.Logger.INVALID_FONTICON_UNICODE, fontCode);
                    itemIconPromise = Promise.resolve(icon);
                }
            }
        }
        else {
            itemIconPromise = Promise.resolve(icon);
        }
        return itemIconPromise;
    };
    ImageHelper.convertFontIconToBase64 = function (icon, styleClass) {
        var result = icon;
        var cacheName = icon + (styleClass && styleClass !== '' ? styleClass : '');
        if (utils_1.isFontIconURI(icon)) {
            var cachedImage = this.cache.get(cacheName);
            if (cachedImage) {
                result = cachedImage;
            }
            else {
                var fontCode = icon.replace('font://&#', '0').replace(';', '');
                if (fontCode !== '') {
                    var fontCodeNum = I18nFormatter_1.I18nFormatter.validateNumber(fontCode);
                    if (fontCodeNum) {
                        var base64ImageTag = 'alwaystemplate';
                        var style = void 0;
                        var font = font_1.Font.default.withFontFamily('SAP-icons');
                        var itemColor = void 0;
                        if (styleClass) {
                            style = StyleHelper_1.StyleHelper.getStyle(CssPropertyParser_1.Selectors.ClassSelector, styleClass);
                            if (style) {
                                if (style.fontFamily) {
                                    font = font_1.Font.default.withFontFamily(style.fontFamily);
                                }
                                if (style.fontSize) {
                                    var imgFontSize = 0;
                                    imgFontSize = (Number(style.fontSize) + this._getFontIconSizeAdjustment(true, true));
                                    font = font.withFontSize(imgFontSize);
                                    base64ImageTag += ';customsize';
                                }
                                if (style.color && style.color instanceof color_1.Color) {
                                    itemColor = style.color;
                                    base64ImageTag = base64ImageTag.replace('alwaystemplate', '');
                                }
                            }
                        }
                        var fontCodeString = "font://" + String.fromCharCode(fontCodeNum);
                        var fontIconCode = fontCodeString.split('//')[1];
                        var imgSource = image_source_1.ImageSource.fromFontIconCodeSync(fontIconCode, font, itemColor);
                        result = 'data:image/png;base64;' + base64ImageTag + ',' + imgSource.toBase64String('png');
                        this.cache.set(cacheName, result);
                    }
                }
            }
        }
        return result;
    };
    ImageHelper._getFontIconSizeAdjustment = function (adjustAndroid, adjustIOS) {
        if (adjustAndroid === void 0) { adjustAndroid = true; }
        if (adjustIOS === void 0) { adjustIOS = true; }
        var adjustment = 0;
        var layoutDensity = page_1.layout.getDisplayDensity();
        if (adjustAndroid === true && app.android) {
            if (layoutDensity >= 3) {
                adjustment = 0;
            }
            else if (layoutDensity >= 2.5) {
                adjustment = 2;
            }
            else {
                adjustment = 4;
            }
        }
        else if (adjustIOS === true && app.ios) {
            if (layoutDensity >= 3) {
                adjustment = -5;
            }
        }
        return adjustment;
    };
    ImageHelper.clearCache = function () {
        this.cache.clear();
    };
    ImageHelper.deleteCachedImages = function () {
        try {
            var folderDest = file_system_1.knownFolders.documents();
            var imageCacheFolderDest = folderDest.getFolder(IMAGE_CACHE_FOLDER_NAME);
            this.clearCache();
            imageCacheFolderDest.clear();
        }
        catch (err) {
            Logger_1.Logger.instance.core.error('Failed to clear cache directory: ', err);
        }
    };
    ImageHelper.checkIfImageAlreadyDownloaded = function (icon) {
        var _this = this;
        var imageCachedPath;
        if (this.cache.has(icon)) {
            imageCachedPath = this.cache.get(icon);
            return imageCachedPath;
        }
        try {
            var folderDest = file_system_1.knownFolders.documents();
            var imageCacheFolderDest = folderDest.getFolder(IMAGE_CACHE_FOLDER_NAME);
            var fileName_1 = this.getHashedFileName(icon);
            var entities = imageCacheFolderDest.getEntitiesSync();
            if (entities.length > 0) {
                entities.forEach(function (entity) {
                    if (entity.name === (fileName_1 + '.jpg') ||
                        entity.name === (fileName_1 + '.jpeg') ||
                        entity.name === (fileName_1 + '.png')) {
                        imageCachedPath = entity.path;
                        _this.cache.set(icon, entity.path);
                    }
                });
            }
        }
        catch (err) {
            Logger_1.Logger.instance.core.error('Failed to access cache directory: ', err);
        }
        return imageCachedPath;
    };
    ImageHelper.resizeImageForIOS = function (image, iconWidth, iconHeight) {
        if (image.size.height > iconHeight || image.size.width > iconWidth) {
            var newSize = CGSizeMake(iconWidth, iconHeight);
            UIGraphicsBeginImageContextWithOptions(newSize, false, 0.0);
            image.drawInRect(CGRectMake(0, 0, newSize.width, newSize.height));
            var newImage = UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();
            return newImage;
        }
        return image;
    };
    ImageHelper.resizeImageForAndroid = function (image, iconWidth, iconHeight) {
        return android.graphics.Bitmap.createScaledBitmap(image, iconWidth, iconHeight, true);
    };
    ImageHelper.getIconTextInitials = function (text) {
        if (!text) {
            return '';
        }
        var textArray = text.split(' ');
        var output;
        if (textArray.length > 1) {
            textArray = textArray.slice(0, 2);
            var first = textArray[0].charAt(0);
            var second = textArray[1].charAt(0);
            output = first.concat(second);
        }
        else {
            output = textArray[0].substr(0, 2);
        }
        return output.toUpperCase();
    };
    ImageHelper.resizeAndSaveImageSourceToFile = function (imgSource, fileExt, url, imageWidth, imageHeight, isIconCircular) {
        var pathDest = '';
        var resizedImage;
        if (imageWidth && imageHeight) {
            if (app.ios) {
                resizedImage = this.resizeImageForIOS(imgSource.ios, imageWidth, imageHeight);
            }
            else if (app.android) {
                resizedImage = this.resizeImageForAndroid(imgSource.android, imageWidth, imageHeight);
            }
        }
        imgSource = image_source_1.fromNativeSource(resizedImage);
        if (isIconCircular) {
            resizedImage = mdk_sap_1.NativeImages.getInstance().getCircularImage(imgSource);
            fileExt = 'png';
        }
        imgSource = image_source_1.fromNativeSource(resizedImage);
        if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg') {
            var folderDest = file_system_1.knownFolders.documents();
            var imageCacheFolderDest = folderDest.getFolder(IMAGE_CACHE_FOLDER_NAME);
            var fileName = void 0;
            if (isIconCircular) {
                url = url + '/circular';
            }
            fileName = this.getHashedFileName(url);
            pathDest = file_system_1.path.join(imageCacheFolderDest.path, fileName);
            pathDest = pathDest + '.' + fileExt;
            var fileNameWithExt = fileName + '.' + fileExt;
            if (!this.isFileCached(fileNameWithExt, imageCacheFolderDest)) {
                var save = imgSource.saveToFile(pathDest, fileExt);
                if (!save) {
                    pathDest = '';
                }
            }
        }
        return pathDest;
    };
    ImageHelper.getHashedFileName = function (fileUrl) {
        var fileName;
        var checksum = sha256(fileUrl);
        fileName = checksum.toString();
        return fileName;
    };
    ImageHelper.isFileCached = function (fileName, cacheFolder) {
        var isCached = false;
        try {
            isCached = cacheFolder.contains(fileName);
        }
        catch (err) {
            Logger_1.Logger.instance.core.error(Logger_1.Logger.CACHE_DIRECTORY_ACCESS_FAILED, err);
        }
        return isCached;
    };
    ImageHelper.imageFontIconClassName = 'sap-icons';
    ImageHelper.imageFontIconFontFamilyName = 'SAP-icons';
    ImageHelper.imageFontIconInternalClassName = '-mdk-internal';
    ImageHelper.cache = new Map();
    return ImageHelper;
}());
exports.ImageHelper = ImageHelper;
;
