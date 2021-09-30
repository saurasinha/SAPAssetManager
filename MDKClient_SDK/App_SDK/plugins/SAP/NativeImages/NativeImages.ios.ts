import { ImageSource } from 'tns-core-modules/image-source';

const DEFAULT_ICON_TEXT_FONT_SIZE = 10;

export class NativeImages {
  private static _instance: NativeImages = new NativeImages();

  private convertHexToRGB(hexCode: string) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  public static getInstance(): NativeImages {
    return NativeImages._instance;
  }

  public getCircularImage(imageSource: ImageSource) {
    let image = imageSource.ios;
    let imageWidth = imageSource.width;
    let imageHeight = imageSource.height;
    let imageView: UIImageView = new UIImageView({ image });
    let layer = imageView.layer;
    let newSize = CGSizeMake(imageWidth, imageHeight);
    imageView.clipsToBounds = true;
    imageView.backgroundColor = UIColor.clearColor;
    imageView.layer.masksToBounds = true;
    imageView.layer.cornerRadius = imageWidth/2;
    UIGraphicsBeginImageContextWithOptions(newSize, false , 0.0)
    layer.renderInContext(UIGraphicsGetCurrentContext());
    let roundedImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return roundedImage;
  }

  public getIconTextImage(iconText: any, imageWidth: number, imageHeight: number, stylesJSON?: string, scale?: number) {
    let stylesObject;
    if (stylesJSON) {
      stylesObject = JSON.parse(stylesJSON);
    }
    let frame = CGRectMake(0, 0, imageWidth, imageHeight);
    let newSize = CGSizeMake(imageWidth, imageHeight);
    let nameLabel = UILabel.new();
    nameLabel.textAlignment = NSTextAlignment.Center;
    nameLabel.frame = frame;
    if (stylesObject && stylesObject.BackgroundColor && stylesObject.BackgroundColor.startsWith('#')) {
      const backgroundColorRGB = this.convertHexToRGB(stylesObject.BackgroundColor);
      nameLabel.backgroundColor = new UIColor({red: backgroundColorRGB.r/255.0, green: backgroundColorRGB.g/255.0, blue: backgroundColorRGB.b/255.0, alpha: 1.0 });
    } else {
      nameLabel.backgroundColor = new UIColor({hue: 209/360, saturation: 95/100, brightness: 81/100, alpha: 1.0});
    }
    if (stylesObject && stylesObject.FontColor && stylesObject.FontColor.startsWith('#')) {
      const fontColorRGB = this.convertHexToRGB(stylesObject.FontColor);
      nameLabel.textColor = new UIColor({red: fontColorRGB.r/255.0, green: fontColorRGB.g/255.0, blue: fontColorRGB.b/255.0, alpha: 1.0 });
    } else {
      nameLabel.textColor = UIColor.whiteColor;
    }
    if (stylesObject && stylesObject.FontSize) {
      if ( stylesObject.FontSize >= DEFAULT_ICON_TEXT_FONT_SIZE ) {
        stylesObject.FontSize = DEFAULT_ICON_TEXT_FONT_SIZE; 
      }
      nameLabel.font = UIFont.systemFontOfSize(stylesObject.FontSize);
    } else {
      nameLabel.font = UIFont.systemFontOfSize(DEFAULT_ICON_TEXT_FONT_SIZE);
    }
    nameLabel.text = iconText;
    UIGraphicsBeginImageContextWithOptions(newSize, false, 0.0);
    nameLabel.layer.renderInContext(UIGraphicsGetCurrentContext());
    let nameImage = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext();
    return nameImage
  }
}
