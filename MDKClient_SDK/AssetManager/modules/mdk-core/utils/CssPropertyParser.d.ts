import { Color } from 'tns-core-modules/color';
export declare enum Selectors {
    TypeSelector = 0,
    ClassSelector = 1,
    IdSelector = 2
}
export declare class CssPropertyParser {
    static getPropertyFromSelector(selectorType: Selectors, selectorName: string, propertyName: string): string;
    static createColor(colorString: string): Color;
    static createFontSize(fontSize: string): Number;
    static createFontFamily(fontFamily: string): string;
    static createFontWeight(fontWeight: string): number;
    private static ruleSet;
    private static _checkGroupSelector;
    private static _getSelectorsFromGroup;
}
