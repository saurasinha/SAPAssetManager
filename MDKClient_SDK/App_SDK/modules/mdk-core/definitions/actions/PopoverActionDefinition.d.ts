import { BaseActionDefinition } from './BaseActionDefinition';
export declare class PopoverActionDefinition extends BaseActionDefinition {
    constructor(path: string, data: any);
    readonly message: string;
    getMessage(): string;
    readonly title: string;
    getTitle(): string;
    readonly items: PopoverItemDefinition[];
    getItemDefs(): PopoverItemDefinition[];
}
export declare class PopoverItemDefinition {
    private data;
    constructor(itemDefinition: any);
    readonly title: string;
    getTitle(): string;
    readonly icon: string;
    getIcon(): string;
    readonly onPress: string;
    getOnPressAction(): string;
    readonly visible: boolean;
    readonly enabled: boolean;
}
