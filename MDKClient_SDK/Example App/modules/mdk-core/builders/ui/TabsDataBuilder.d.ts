import { TabControlBaseDataBuilder } from './TabControlBaseDataBuilder';
import { IContext } from '../../context/IContext';
export declare class TabsDataBuilder extends TabControlBaseDataBuilder {
    constructor(context: IContext);
    setPosition(position: string): TabsDataBuilder;
    setSelectedIndex(selectedIndex: any): TabsDataBuilder;
    setSwipeEnabled(swipeEnabled: boolean): TabsDataBuilder;
    setVisible(visible: boolean): TabsDataBuilder;
}
