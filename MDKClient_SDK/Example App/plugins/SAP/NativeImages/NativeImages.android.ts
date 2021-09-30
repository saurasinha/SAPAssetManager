import * as application from 'tns-core-modules/application';
import { DataConverter } from '../Common/DataConverter';
import * as utils from "tns-core-modules/utils/utils";
import { ImageSource } from 'tns-core-modules/image-source';

const DEFAULT_ICON_TEXT_BG_COLOR = "#286EB4"
const DEFAULT_ICON_TEXT_FONT_COLOR = "#FFFFFF"
const DEFAULT_ICON_TEXT_FONT_SIZE = 15;

export class NativeImages {
  private static _instance: NativeImages = new NativeImages();

  public static getInstance(): NativeImages {
    return NativeImages._instance;
  }

  public getIconTextImage(text: string,imageWidth: number, imageHeight: number,stylesJSON?: string,scale: number = 1): any {
    let conf: android.graphics.Bitmap.Config  = android.graphics.Bitmap.Config.ARGB_8888;
    let wid = utils.layout.toDevicePixels(imageWidth * scale);
    let hght = utils.layout.toDevicePixels(imageHeight * scale);
    let bmp: android.graphics.Bitmap = android.graphics.Bitmap.createBitmap(wid,hght,conf);
    let canvas: android.graphics.Canvas = new android.graphics.Canvas(bmp);
    let paint: android.graphics.Paint = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
    let stylesObject;
    if (stylesJSON) {
      stylesObject = JSON.parse(stylesJSON);
    }
    let styles = DataConverter.toJavaObject(stylesObject);
    let textColor = styles.optString("FontColor",DEFAULT_ICON_TEXT_FONT_COLOR);
    let backgroundColor = styles.optString("BackgroundColor", DEFAULT_ICON_TEXT_BG_COLOR);
    let textSize = styles.optInt("FontSize",DEFAULT_ICON_TEXT_FONT_SIZE);
    paint.setColor(android.graphics.Color.parseColor(textColor));
    paint.setTextSize(utils.layout.toDevicePixels(textSize * scale));
    let bounds: android.graphics.Rect = new android.graphics.Rect();
    paint.getTextBounds(text, 0, text.length, bounds);
    let x = (bmp.getWidth() - bounds.width())/2;
    let y = (bmp.getHeight() + bounds.height())/2;
    canvas.drawColor(android.graphics.Color.parseColor(backgroundColor));
    canvas.drawText(text, x, y, paint);
    return bmp;
  } 
  
  /* 
    Returns a circular image of a square bitmap image, the parameter passed here should be a bitmap
    which can be obtained by using the ImageSource.android property
  */
  public getCircularImage(imageSource: ImageSource): any {
    let bitmap: android.graphics.Bitmap = imageSource.android;
    let output: android.graphics.Bitmap  = android.graphics.Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
    let canvas: android.graphics.Canvas  = new android.graphics.Canvas(output);
    let paint: android.graphics.Paint = new android.graphics.Paint();
    let rect: android.graphics.Rect= new android.graphics.Rect(0, 0, bitmap.getWidth(), bitmap.getHeight());
    paint.setAntiAlias(true);
    canvas.drawARGB(0, 0, 0, 0);
    canvas.drawCircle(bitmap.getWidth() / 2, bitmap.getHeight() / 2, bitmap.getWidth() / 2, paint);
    paint.setXfermode(new android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.SRC_IN));
    canvas.drawBitmap(bitmap, rect, rect, paint);
    return output;
  }
}
