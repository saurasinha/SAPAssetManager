import { BaseSectionObservable } from '../sections/BaseSectionObservable';
import { IAppSettingChangeListener } from '../../utils/AppSettingsManager';
export declare class ButtonSectionObservable extends BaseSectionObservable implements IAppSettingChangeListener {
    private static readonly VISIBLE_DEFINITION_KEY;
    private readonly ENABLED_PARAM_KEY;
    private readonly ITEMS_PARAM_KEY;
    private readonly STYLE_TEXT_PARAM_KEY;
    private readonly TEXT_ALIGNMENT_PARAM_KEY;
    private readonly TITLE_TEXT_PARAM_KEY;
    private readonly VISIBLE_PARAM_KEY;
    private _blockingUserInteraction;
    private static _objectID;
    private buttonID;
    bind(): Promise<Object>;
    onPress(cell: any): Promise<void>;
    onAppSettingChange(key: string, type: string, value?: any): void;
    protected _filterCells(items: Array<Object>): Array<Object>;
    private _allowUserInteraction;
    private _blockUserInteraction;
    private _bindButton;
    private _bindUserInteraction;
    private _getItem;
    private _mapMetadataKey;
    private _onPressHandler;
    private _onPressHandlerKey;
    private _unblockUserInteraction;
    private _userInteractionBlocked;
}
