import { BaseDataBuilder } from '../BaseDataBuilder';
import { IContext } from '../../context/IContext';
export declare class TabItemDataBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    setName(name: string): TabItemDataBuilder;
    setCaption(caption: string): TabItemDataBuilder;
    setImage(image: string): TabItemDataBuilder;
    setAction(action: string): TabItemDataBuilder;
    setEnabled(enabled: boolean): TabItemDataBuilder;
    setVisible(visible: boolean): TabItemDataBuilder;
    setResetIfPressedWhenActive(resetIfPressedWhenActive: boolean): TabItemDataBuilder;
}
