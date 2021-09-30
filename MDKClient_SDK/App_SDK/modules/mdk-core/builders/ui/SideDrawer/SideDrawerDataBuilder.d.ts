import { BaseDataBuilder } from '../../BaseDataBuilder';
import { IContext } from '../../../context/IContext';
export declare class SideDrawerDataBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    setName(name: string): SideDrawerDataBuilder;
    setClearHistory(clearHistory: boolean): SideDrawerDataBuilder;
    setStyles(styles: any): SideDrawerDataBuilder;
}
