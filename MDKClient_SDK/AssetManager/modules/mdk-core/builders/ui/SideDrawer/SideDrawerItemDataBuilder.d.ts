import { BaseDataBuilder } from '../../BaseDataBuilder';
import { IContext } from '../../../context/IContext';
export declare class SideDrawerItemDataBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    setName(name: string): SideDrawerItemDataBuilder;
    setImage(image: string): SideDrawerItemDataBuilder;
    setTitle(title: string): SideDrawerItemDataBuilder;
    setAction(action: string): SideDrawerItemDataBuilder;
    setVisible(visible: boolean): SideDrawerItemDataBuilder;
    setPageToOpen(pageToOpen: string): SideDrawerItemDataBuilder;
    setResetIfPressedWhenActive(resetIfPressedWhenActive: boolean): SideDrawerItemDataBuilder;
    setTextAlignment(textAlignment: string): SideDrawerItemDataBuilder;
    setStyles(styles: any): SideDrawerItemDataBuilder;
}
