import { BaseDataBuilder } from '../../BaseDataBuilder';
import { IContext } from '../../../context/IContext';
export declare class SideDrawerSectionDataBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    setName(name: string): SideDrawerSectionDataBuilder;
    setCaption(caption: string): SideDrawerSectionDataBuilder;
    setVisible(visible: boolean): SideDrawerSectionDataBuilder;
    setPreserveImageSpacing(preserveImageSpacing: boolean): SideDrawerSectionDataBuilder;
    setSeparatorEnabled(separatorEnabled: boolean): SideDrawerSectionDataBuilder;
    setStyles(styles: any): SideDrawerSectionDataBuilder;
}
