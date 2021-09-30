import { BaseActionDefinition } from './BaseActionDefinition';
export declare class ProgressBannerActionDefinition extends BaseActionDefinition {
    readonly message: string;
    readonly completionMessage: string;
    readonly completionTimeout: number;
    readonly animated: boolean;
    readonly actionLabel: string;
    readonly onActionLabelPress: string;
    readonly completionActionLabel: string;
    readonly onCompletionActionLabelPress: string;
    readonly dismissBannerOnAction: boolean;
}
