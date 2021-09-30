import { Page } from 'tns-core-modules/ui/page';
import { Color } from 'tns-core-modules/color';
import { Font, FontWeight, FontStyle } from 'tns-core-modules/ui/styling/font';
import * as PlatformModule from 'tns-core-modules/platform';
declare var NavigationBarBridge: any;

export class NavigationBar {
  public static applyFioriStyle() {
    NavigationBarBridge.applyFioriStyle();
  }

  public static applyTitleStyle(page: Page, backgroundColor: Color, titleColor: Color, titleFont: Font) {
    if (page.frame) {
      let navController = page.frame.ios.controller;
      let navigationBar = navController ? navController.navigationBar : null;
      if (navigationBar) {
        // Disabling setting translucent to false is a temp workaround as 
        // from NS4.x upgrade, when the translucent is to false will have a shift down issue on our native container
        // navigationBar.translucent = false;
        let defaultUIFont = UIFont.systemFontOfSize(UIFont.labelFontSize);
        let titleTextAttributes;
        if (titleColor && titleFont) {
          titleTextAttributes = {
            [NSForegroundColorAttributeName]: titleColor.ios,
            [NSFontAttributeName]: titleFont.getUIFont(defaultUIFont),  
          };
        } else if (titleColor) {
          titleTextAttributes = {
            [NSForegroundColorAttributeName]: titleColor.ios
          };
        } else if (titleFont) {
          titleTextAttributes = {
            [NSFontAttributeName]: titleFont.getUIFont(defaultUIFont)
          };
        }
        if (titleTextAttributes) {
          if (PlatformModule.device.sdkVersion.toString().indexOf('13') >= 0) {
            let navBarAppearance = navigationBar.standardAppearance ? 
              navigationBar.standardAppearance : UINavigationBarAppearance.new();
            navBarAppearance.titleTextAttributes = <any> titleTextAttributes;
            UINavigationBar.appearanceWhenContainedInInstancesOfClasses([UINavigationController.class()])
              .standardAppearance = navBarAppearance;
          } else {
            navigationBar.titleTextAttributes = <any> titleTextAttributes;
          }
        }
        // BCP-2170048226: Update style for status bar as Black to achieve white text and icon color
        // This is applicable to both light and dark modes as the background color is dark color.
        // TODO: allow customisation to the barStyle so that
        // if user customise the actionbar background color to be light color, 
        // they can set the barStyle to be default (black text and icon color).
        // We cannot use 'navigationBar.barStyle = UIBarStyle.Black;' as it does not work for SideDrawer scenario.
        // Use setStatusBarStyleAnimated api as suggested by NativeScript (#NS-917974): https://ticket.nstudio.io/tickets.php?id=1172
        UIApplication.sharedApplication.setStatusBarStyleAnimated(UIStatusBarStyle.LightContent, true);
      }
    }
  }

  public static updateActionBarElevation(page: Page, on: Boolean) {
    //
  }
}
