import { BaseActionDefinition } from './BaseActionDefinition';
export declare class BannerMessageActionDefinition extends BaseActionDefinition {
    readonly Message: string;
    readonly Duration: number;
    readonly Animated: boolean;
    readonly ActionLabel: string;
    readonly OnActionLabelPress: string;
    readonly DismissBannerOnAction: boolean;
}
