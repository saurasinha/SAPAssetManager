/**
 * Contains the Label class, which represents a standard label widget.
 * @module "ui/label"
 */ /** */

 import { Label } from 'tns-core-modules/ui/label';

/**
 * Represents a text label.
 */
export class ToolbarLabel extends Label {
    /**
     * Gets the native [android widget](http://developer.android.com/reference/android/widget/TextView.html) 
     * that represents the user interface for this component. Valid only when running on Android OS.
     */
    public android: any /* android.widget.TextView */;

    /**
     * Gets the native [UILabel](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UILabel_Class/) 
     * that represents the user interface for this component. Valid only when running on iOS.
     */
    public ios: any /* UILabel */;

    /**
     * Gets or sets whether the Label wraps text or not.
     */
    public textWrap: boolean;

    /**
     * Gets or sets the toolbar font size unit.
     */
    // toolbarFontSize: string;
    public fontSizeUnit: string;
}
