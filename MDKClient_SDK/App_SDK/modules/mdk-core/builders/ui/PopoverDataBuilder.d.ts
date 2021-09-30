import { BaseDataBuilder } from '../BaseDataBuilder';
import { MDKPage } from '../../pages/MDKPage';
import { IContext } from '../../context/IContext';
export declare class PopoverItemDataBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    setEnabled(enabled: boolean): PopoverItemDataBuilder;
    setIcon(icon: string): PopoverItemDataBuilder;
    setOnPress(onPress: string): PopoverItemDataBuilder;
    setTitle(title: string): PopoverItemDataBuilder;
    setVisible(visible: boolean): PopoverItemDataBuilder;
}
export declare class PopoverDataBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    setMessage(message: string): PopoverDataBuilder;
    setPage(page: MDKPage): this;
    setPressedItem(pressedItem: any): this;
    setTitle(title: string): PopoverDataBuilder;
    readonly newItem: PopoverItemDataBuilder;
}
