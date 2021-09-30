import * as frameModule from 'tns-core-modules/ui/frame';
export declare enum BannerType {
    progress = 1,
    progressCompletion = 2,
    standard = 3
}
export interface IBannerData {
    message: string;
    topFrame: frameModule.Frame;
    type: BannerType;
    duration?: number;
    animated?: boolean;
    bottomOffset?: number;
    maxLines?: number;
    CloseButtonCaption?: string;
    actionLabel?: string;
    onActionLabelPress?: string;
    completionActionLabel?: string;
    onCompletionActionLabelPress?: string;
    dismissBannerOnAction?: boolean;
    view?: any;
}
