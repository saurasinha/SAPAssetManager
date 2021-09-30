import { BaseDataBuilder } from '../../BaseDataBuilder';
import { IContext } from '../../../context/IContext';
export declare class SideDrawerHeaderDataBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    setIcon(icon: string): SideDrawerHeaderDataBuilder;
    setIconIsCircular(iconIsCircular: boolean): SideDrawerHeaderDataBuilder;
    setDisableIconText(disableIconText: boolean): SideDrawerHeaderDataBuilder;
    setHeadline(headline: string): SideDrawerHeaderDataBuilder;
    setSubHeadline(subHeadline: string): SideDrawerHeaderDataBuilder;
    setAction(action: string): SideDrawerHeaderDataBuilder;
    setAlignment(alignment: string): SideDrawerHeaderDataBuilder;
}
