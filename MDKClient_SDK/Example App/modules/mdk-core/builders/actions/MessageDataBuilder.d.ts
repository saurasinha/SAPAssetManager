import { BaseDataBuilder } from '../BaseDataBuilder';
export declare class MessageDataBuilder extends BaseDataBuilder {
    build(): Promise<any>;
    setMessage(message: any): MessageDataBuilder;
    setOkButtonCaption(caption: any): MessageDataBuilder;
    setCancelButtonCaption(caption: any): MessageDataBuilder;
    setTitle(title: any): MessageDataBuilder;
}
