export declare class StyleHelper {
    private static _colorProperty;
    private static _fontFamilyProperty;
    private static _fontSizeProperty;
    private static _backgroundColorProperty;
    private static _darkOption;
    private static _lightOption;
    static getStyle(selector: any, cssClassName: any): any;
    static convertStyleToCssString(styleObj: any, className: string): string;
    static getValidTheme(themeName: string): string;
    static setTheme(themeName: string, initialLaunch?: boolean): boolean;
    static getTheme(): string;
    static getAvailableThemes(): string[];
}
