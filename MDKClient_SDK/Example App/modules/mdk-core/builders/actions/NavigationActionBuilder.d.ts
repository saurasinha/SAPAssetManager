import { BaseDataBuilder } from '../BaseDataBuilder';
import { IContext } from '../../context/IContext';
export declare class NavigationActionBuilder extends BaseDataBuilder {
    private static _curves;
    private static _names;
    constructor(context: IContext);
    build(): Promise<any>;
    setClearHistory(clearHistory: boolean): NavigationActionBuilder;
    setModalPage(modalPage: boolean): NavigationActionBuilder;
    setModalPageFullscreen(isFullScreen: boolean): NavigationActionBuilder;
    setPageToOpen(pageToOpen: string): NavigationActionBuilder;
    setPageMetadata(pageMetadata: string | object): NavigationActionBuilder;
    setIsOuterNavigation(isOuterNavigation: boolean): NavigationActionBuilder;
    setIsInnerNavigation(isInnerNavigation: boolean): NavigationActionBuilder;
    setIsRootNavigation(isRootNavigation: boolean): NavigationActionBuilder;
    setTransition(transition: any): NavigationActionBuilder;
    setNavigationType(type: any): NavigationActionBuilder;
    private getValueFromKey;
    private correctTansition;
}
