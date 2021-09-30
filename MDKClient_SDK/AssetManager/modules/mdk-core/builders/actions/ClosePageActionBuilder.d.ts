import { BaseDataBuilder } from '../BaseDataBuilder';
import { IContext } from '../../context/IContext';
export declare class ClosePageActionBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    build(): Promise<any>;
    setDismissModal(modal: any): ClosePageActionBuilder;
    setCancelPendingActions(cancelPendingActions: boolean): ClosePageActionBuilder;
}
