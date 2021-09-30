import { BaseDataBuilder } from '../BaseDataBuilder';
import * as frameModule from 'tns-core-modules/ui/frame';
import { IContext } from '../../context/IContext';
import { IBannerData, BannerType } from 'mdk-sap/BannerMessage/IBannerData';
export declare class BannerDataBuilder extends BaseDataBuilder {
    constructor(context: IContext);
    build(): Promise<any>;
    buildError(message: string, topFrame: frameModule.Frame, type: BannerType): IBannerData;
    setAnimated(animated: boolean): BannerDataBuilder;
    setBottomOffset(offset: number): BannerDataBuilder;
    setDuration(duration: number): BannerDataBuilder;
    setMaxNumberOfLines(maxNumberOfLines: number): BannerDataBuilder;
    setMessage(message: string): BannerDataBuilder;
    setTopFrame(frame: frameModule.Frame): BannerDataBuilder;
    setType(type: BannerType): BannerDataBuilder;
    setActionLabel(actionLabel: string): BannerDataBuilder;
    setOnActionLabelPress(onActionLabelPress: string): BannerDataBuilder;
    setCompletionActionLabel(completionActionLabel: string): BannerDataBuilder;
    setOnCompletionActionLabelPress(onCompletionActionLabelPress: string): BannerDataBuilder;
    setDismissBannerOnAction(dismissBannerOnAction: boolean): BannerDataBuilder;
    private _getPressValue;
    private _getToolbarHeight;
}
