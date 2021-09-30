"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataConverter_1 = require("../Common/DataConverter");
var utils = require("tns-core-modules/utils/utils");
var DEFAULT_ICON_TEXT_BG_COLOR = "#286EB4";
var DEFAULT_ICON_TEXT_FONT_COLOR = "#FFFFFF";
var DEFAULT_ICON_TEXT_FONT_SIZE = 15;
var NativeImages = (function () {
    function NativeImages() {
    }
    NativeImages.getInstance = function () {
        return NativeImages._instance;
    };
    NativeImages.prototype.getIconTextImage = function (text, imageWidth, imageHeight, stylesJSON, scale) {
        if (scale === void 0) { scale = 1; }
        var conf = android.graphics.Bitmap.Config.ARGB_8888;
        var wid = utils.layout.toDevicePixels(imageWidth * scale);
        var hght = utils.layout.toDevicePixels(imageHeight * scale);
        var bmp = android.graphics.Bitmap.createBitmap(wid, hght, conf);
        var canvas = new android.graphics.Canvas(bmp);
        var paint = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
        var stylesObject;
        if (stylesJSON) {
            stylesObject = JSON.parse(stylesJSON);
        }
        var styles = DataConverter_1.DataConverter.toJavaObject(stylesObject);
        var textColor = styles.optString("FontColor", DEFAULT_ICON_TEXT_FONT_COLOR);
        var backgroundColor = styles.optString("BackgroundColor", DEFAULT_ICON_TEXT_BG_COLOR);
        var textSize = styles.optInt("FontSize", DEFAULT_ICON_TEXT_FONT_SIZE);
        paint.setColor(android.graphics.Color.parseColor(textColor));
        paint.setTextSize(utils.layout.toDevicePixels(textSize * scale));
        var bounds = new android.graphics.Rect();
        paint.getTextBounds(text, 0, text.length, bounds);
        var x = (bmp.getWidth() - bounds.width()) / 2;
        var y = (bmp.getHeight() + bounds.height()) / 2;
        canvas.drawColor(android.graphics.Color.parseColor(backgroundColor));
        canvas.drawText(text, x, y, paint);
        return bmp;
    };
    NativeImages.prototype.getCircularImage = function (imageSource) {
        var bitmap = imageSource.android;
        var output = android.graphics.Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
        var canvas = new android.graphics.Canvas(output);
        var paint = new android.graphics.Paint();
        var rect = new android.graphics.Rect(0, 0, bitmap.getWidth(), bitmap.getHeight());
        paint.setAntiAlias(true);
        canvas.drawARGB(0, 0, 0, 0);
        canvas.drawCircle(bitmap.getWidth() / 2, bitmap.getHeight() / 2, bitmap.getWidth() / 2, paint);
        paint.setXfermode(new android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.SRC_IN));
        canvas.drawBitmap(bitmap, rect, rect, paint);
        return output;
    };
    NativeImages._instance = new NativeImages();
    return NativeImages;
}());
exports.NativeImages = NativeImages;
