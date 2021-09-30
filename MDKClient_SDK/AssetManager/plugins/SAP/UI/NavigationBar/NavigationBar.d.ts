import { Page } from 'tns-core-modules/ui/page';
import { Color } from 'tns-core-modules/color';
import { Font } from 'tns-core-modules/ui/styling/font';
export declare class NavigationBar {
    static applyFioriStyle(): void;
    static applyTitleStyle(page: Page, backgroundColor: Color, titleColor: Color, titleFont: Font): void;
    static updateActionBarElevation(page: Page, on: Boolean): void;
}
