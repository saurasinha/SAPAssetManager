"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_ICON_TEXT_FONT_SIZE = 10;
var NativeImages = (function () {
    function NativeImages() {
    }
    NativeImages.prototype.convertHexToRGB = function (hexCode) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    NativeImages.getInstance = function () {
        return NativeImages._instance;
    };
    NativeImages.prototype.getCircularImage = function (imageSource) {
        var image = imageSource.ios;
        var imageWidth = imageSource.width;
        var imageHeight = imageSource.height;
        var imageView = new UIImageView({ image: image });
        var layer = imageView.layer;
        var newSize = CGSizeMake(imageWidth, imageHeight);
        imageView.clipsToBounds = true;
        imageView.backgroundColor = UIColor.clearColor;
        imageView.layer.masksToBounds = true;
        imageView.layer.cornerRadius = imageWidth / 2;
        UIGraphicsBeginImageContextWithOptions(newSize, false, 0.0);
        layer.renderInContext(UIGraphicsGetCurrentContext());
        var roundedImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return roundedImage;
    };
    NativeImages.prototype.getIconTextImage = function (iconText, imageWidth, imageHeight, stylesJSON, scale) {
        var stylesObject;
        if (stylesJSON) {
            stylesObject = JSON.parse(stylesJSON);
        }
        var frame = CGRectMake(0, 0, imageWidth, imageHeight);
        var newSize = CGSizeMake(imageWidth, imageHeight);
        var nameLabel = UILabel.new();
        nameLabel.textAlignment = 1;
        nameLabel.frame = frame;
        if (stylesObject && stylesObject.BackgroundColor && stylesObject.BackgroundColor.startsWith('#')) {
            var backgroundColorRGB = this.convertHexToRGB(stylesObject.BackgroundColor);
            nameLabel.backgroundColor = new UIColor({ red: backgroundColorRGB.r / 255.0, green: backgroundColorRGB.g / 255.0, blue: backgroundColorRGB.b / 255.0, alpha: 1.0 });
        }
        else {
            nameLabel.backgroundColor = new UIColor({ hue: 209 / 360, saturation: 95 / 100, brightness: 81 / 100, alpha: 1.0 });
        }
        if (stylesObject && stylesObject.FontColor && stylesObject.FontColor.startsWith('#')) {
            var fontColorRGB = this.convertHexToRGB(stylesObject.FontColor);
            nameLabel.textColor = new UIColor({ red: fontColorRGB.r / 255.0, green: fontColorRGB.g / 255.0, blue: fontColorRGB.b / 255.0, alpha: 1.0 });
        }
        else {
            nameLabel.textColor = UIColor.whiteColor;
        }
        if (stylesObject && stylesObject.FontSize) {
            if (stylesObject.FontSize >= DEFAULT_ICON_TEXT_FONT_SIZE) {
                stylesObject.FontSize = DEFAULT_ICON_TEXT_FONT_SIZE;
            }
            nameLabel.font = UIFont.systemFontOfSize(stylesObject.FontSize);
        }
        else {
            nameLabel.font = UIFont.systemFontOfSize(DEFAULT_ICON_TEXT_FONT_SIZE);
        }
        nameLabel.text = iconText;
        UIGraphicsBeginImageContextWithOptions(newSize, false, 0.0);
        nameLabel.layer.renderInContext(UIGraphicsGetCurrentContext());
        var nameImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return nameImage;
    };
    NativeImages._instance = new NativeImages();
    return NativeImages;
}());
exports.NativeImages = NativeImages;
