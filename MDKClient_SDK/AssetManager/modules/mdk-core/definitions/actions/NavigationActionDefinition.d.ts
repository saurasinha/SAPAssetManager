import { BaseActionDefinition } from './BaseActionDefinition';
export declare class NavigationActionDefinition extends BaseActionDefinition {
    constructor(path: string, data: any);
    getPageToOpen(): string;
    getPageMetadata(): string | object;
    getTransition(): any;
    readonly isModalNavigation: boolean;
    readonly isOuterNavigation: boolean;
    readonly isInnerNavigation: boolean;
    readonly isRootNavigation: boolean;
    isModalPage(): boolean;
    readonly isFullScreenModal: boolean;
    isModalPageFullscreen(): boolean;
    readonly isClearHistory: boolean;
    getNavigationType(): string;
}
