import { BaseActionDefinition } from './BaseActionDefinition';
export declare class ClosePageActionDefinition extends BaseActionDefinition {
    static dismissModalType: {
        Canceled: string;
        Completed: string;
    };
    constructor(path: string, data: any);
    readonly cancelPendingActions: boolean;
    readonly dismissModal: string;
}
