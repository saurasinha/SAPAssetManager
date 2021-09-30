import { BaseDataBuilder } from '../BaseDataBuilder';
import { IContext } from '../../context/IContext';
export declare class ToolbarItemDataBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    setName(name: string): ToolbarItemDataBuilder;
    setSystemItem(systemItem: string): ToolbarItemDataBuilder;
    setCaption(caption: string): ToolbarItemDataBuilder;
    setImage(image: string): ToolbarItemDataBuilder;
    setAction(action: string): ToolbarItemDataBuilder;
    setEnabled(enabled: boolean): ToolbarItemDataBuilder;
    setVisible(visible: boolean): ToolbarItemDataBuilder;
    setClickable(clickable: boolean): ToolbarItemDataBuilder;
    setOnPress(onPress: string): ToolbarItemDataBuilder;
    setWidth(width: number): ToolbarItemDataBuilder;
    setItemType(itemType: string): ToolbarItemDataBuilder;
}
