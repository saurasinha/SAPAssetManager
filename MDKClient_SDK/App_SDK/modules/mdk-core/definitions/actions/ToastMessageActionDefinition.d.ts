import { BaseActionDefinition } from './BaseActionDefinition';
export declare class ToastMessageActionDefinition extends BaseActionDefinition {
    readonly animated: boolean;
    readonly duration: number;
    readonly icon: string;
    readonly isIconHidden: boolean;
    readonly maxNumberOfLines: number;
    readonly message: string;
}
