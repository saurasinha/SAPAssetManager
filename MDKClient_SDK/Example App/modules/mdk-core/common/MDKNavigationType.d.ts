export declare enum MDKNavigationType {
    Inner = 0,
    Outer = 1,
    Cross = 2,
    Root = 3
}
export declare function isNavigationTypeValid(navType: string): boolean;
export declare function parseNavigationType(navType: string): MDKNavigationType;
