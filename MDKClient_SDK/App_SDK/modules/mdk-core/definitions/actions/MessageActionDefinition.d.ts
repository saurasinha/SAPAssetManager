import { BaseActionDefinition } from './BaseActionDefinition';
export declare class MessageActionDefinition extends BaseActionDefinition {
    constructor(path: string, data: any);
    readonly message: string;
    readonly okCaption: string;
    readonly onOK: string;
    readonly cancelCaption: string;
    readonly onCancel: string;
    readonly title: string;
    getMessage(): string;
    getOKCaption(): string;
    getTitle(): string;
}
