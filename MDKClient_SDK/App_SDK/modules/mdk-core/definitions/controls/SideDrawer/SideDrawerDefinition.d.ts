import { SideDrawerSectionDefinition } from "./SideDrawerSectionDefinition";
import { SideDrawerHeaderDefinition } from "./SideDrawerHeaderDefinition";
import { BaseControlDefinition } from "../BaseControlDefinition";
export declare class SideDrawerDefinition extends BaseControlDefinition {
    private _clearHistory;
    private _sections;
    private _header;
    private _styles;
    private _drawerButton;
    private _alwaysShowDrawerButton;
    constructor(path: any, data: any, parent: any);
    readonly clearHistory: any;
    readonly header: SideDrawerHeaderDefinition;
    readonly sections: SideDrawerSectionDefinition[];
    readonly styles: any;
    readonly drawerButton: string;
    readonly alwaysShowDrawerButton: any;
    private _loadHeader;
    private _loadSections;
}
