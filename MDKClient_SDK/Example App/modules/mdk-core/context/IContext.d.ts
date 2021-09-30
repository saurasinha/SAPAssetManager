import { PressedItem } from '../controls/PressedItem';
import { IClientAPI } from './IClientAPI';
import { IFilterable } from '../controls/IFilterable';
import { ITargetServiceSpecifier } from '../data/ITargetSpecifier';
import { ExecuteSource } from '../common/ExecuteSource';
import { ContextItem } from '../controls/ContextItem';
export interface ISearchContext {
    filter?: string;
    orderBy?: string;
    searchKeys?: string[];
    serviceName?: string;
    service?: ITargetServiceSpecifier;
}
export interface IContext {
    binding?: any;
    clientAPI: IClientAPI;
    clientAPIProps: IClientAPIProps;
    clientData: IClientData;
    element?: any;
    searchContext?: ISearchContext;
    readonly readLink: string;
    resetClientAPIProps(): void;
}
export interface IClientAPIProps {
    actionBinding?: any;
    appEventData?: any;
    bindingProperty?: string;
    cancelPendingActions?: boolean;
    filter?: IFilterable;
    missingRequiredControls?: Array<any>;
    newControlValue?: any;
    pressedItem?: PressedItem;
    eventSource?: ExecuteSource;
    contextItem?: ContextItem;
}
export interface IClientData {
    actionResults?: any;
    DeletedAttachments?: any;
    UserId?: string;
}
export declare function setFromPageFunction(func: () => IContext): void;
export declare function fromPage(): IContext;
