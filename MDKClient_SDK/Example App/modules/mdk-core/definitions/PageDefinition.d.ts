import { ContainerDefinition } from './ContainerDefinition';
import { ToolbarDefinition } from './ToolbarDefinition';
import { BottomNavigationDefinition } from './controls/BottomNavigationDefinition';
import { SideDrawerDefinition } from './controls/SideDrawer/SideDrawerDefinition';
import { FlexibleColumnLayoutDefinition } from './controls/FlexibleColumnLayoutDefinition';
export declare class PageDefinition extends ContainerDefinition {
    private toolbar;
    constructor(path: any, data: any);
    getActionBarItems(): any;
    getToolbar(): ToolbarDefinition;
    getBottomNavigation(): BottomNavigationDefinition;
    getFlexibleColumnLayout(): FlexibleColumnLayoutDefinition;
    getSideDrawer(): SideDrawerDefinition;
    getOnLoadedEvent(): any;
    getOnReturningEvent(): any;
    getOnResumeEvent(): any;
    getOnUnLoadedEvent(): any;
    getOnActivityBackPressedEvent(): any;
    getResult(): any;
    readonly dataSubscriptions: Array<any>;
    getPullDown(): any;
    getsectionCount(): number;
    isStaticSectionPresent(): boolean;
}
