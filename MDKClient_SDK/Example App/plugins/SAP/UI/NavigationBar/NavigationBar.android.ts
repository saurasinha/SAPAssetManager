import * as app from 'tns-core-modules/application';
import { Page } from 'tns-core-modules/ui/page';
import { Color } from 'tns-core-modules/color';
import { Font } from 'tns-core-modules/ui/styling/font';
import * as nativeHelper from 'tns-core-modules/utils/native-helper';

declare var android;

export class NavigationBar {
  public static applyFioriStyle() {
    //
  }

  public static applyTitleStyle(page: Page, backgroundColor: Color, titleColor: Color, titleFont: Font) {
    // let density = app.android.context.getResources().getDisplayMetrics().density;
    // let padding = Device.deviceType === 'Phone' ? 16 : 24;
    let nativeActionBar = page.actionBar.nativeViewProtected;
    if (nativeActionBar) {
      // nativeActionBar.setPadding(0, 0, padding * density, 0);
      // set status bar color
      let activity = app.android.foregroundActivity;
      if (activity) {
        if (backgroundColor) {
          activity.getWindow().setStatusBarColor(backgroundColor.android);
        } else {
          let colorId = nativeHelper.ad.getResources().getIdentifier(
            'sap_ui_page_footer_background',
            'color',
            nativeHelper.ad.getApplicationContext().getPackageName()
          );
          if (colorId > -1) {
            let color = nativeHelper.ad.getResources().getColor(colorId);
            if (color) {
              activity.getWindow().setStatusBarColor(new Color(color).android);
            }
          }
        }
        if (titleColor) {
          // TODO-FUTURE: set StatusBar textcaor programmatically
          // activity.getWindow().setStatusBarColor(backgroundColor.android);
        }
      }
      // set title styles
      let typeFace = titleFont.getAndroidTypeface();
      for (let n = 0; n < nativeActionBar.getChildCount(); n++) {
        let view = nativeActionBar.getChildAt(n);
        if (view.setTextSize) {
          if (titleColor) {
            view.setTextColor(titleColor.android);
          }
          if (!isNaN(titleFont.fontSize)) {
            view.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, titleFont.fontSize);
          }
          if (typeFace) {
            view.setTypeface(typeFace, typeFace.getStyle());
          }
        }
      }
    }
  }

  // update elevation on action bar
  public static updateActionBarElevation(page: Page, on: Boolean) {
    if (on) {
      let density = app.android.context.getResources().getDisplayMetrics().density;
      page.actionBar.nativeViewProtected.setElevation(4 * density);
    } else {
      page.actionBar.nativeViewProtected.setElevation(0);
    }
  }
}
