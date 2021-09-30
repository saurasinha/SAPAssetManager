declare const enum SoftKeyboardType {
    Implicit = 0,
    Show = 1,
    Hide = 2
}
export declare class Util {
    static toSoftKeyboardType(keyboardVisibility: string): SoftKeyboardType;
    static getPopoverOnPress(onPress: any): any;
}
export {};
