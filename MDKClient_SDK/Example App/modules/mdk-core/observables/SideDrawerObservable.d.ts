import { BaseObservable } from "./BaseObservable";
import { SideDrawer } from "../controls/SideDrawer";
import { SideDrawerDefinition } from "../definitions/controls/SideDrawer/SideDrawerDefinition";
import { Page } from 'tns-core-modules/ui/page';
import { ODataAction } from '../actions/ODataAction';
export declare class SideDrawerObservable extends BaseObservable {
    constructor(sideDrawer: SideDrawer, sideDrawerDefinition: SideDrawerDefinition, oPage: Page);
    onDataChanged(action: ODataAction, result: any): void;
    protected registerDataListeners(oControlDef: any): Promise<any>;
}
