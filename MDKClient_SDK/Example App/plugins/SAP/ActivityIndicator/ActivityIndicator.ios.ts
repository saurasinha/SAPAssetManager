import { IIndicatorItem } from './ActivityIndicator';
import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
declare var ActivityIndicatorViewBridge: any;

export class ActivityIndicator {
  public static get instance(): ActivityIndicator {
    return ActivityIndicator._instance;
  }

  private static _instance: ActivityIndicator = new ActivityIndicator();
  private _activityIndicatorBridge = ActivityIndicatorViewBridge.new();
  // Stack of items passed by requests to show the indicator. When dismiss is called,
  // the next item in the stack, which would have been shown before, is shown again.
  private _shownItems: IIndicatorItem[] = [];
  // True if the activity indicator is active, but hidden.
  private _isHidden: boolean = false;
  private _currentId: number = 0;

  private constructor() {
    if (ActivityIndicator._instance) {
      throw new Error(ErrorMessage.ACTIVITY_INDICATOR_INSTANTIATION_FAILED);
    }
    ActivityIndicator._instance = this;
  }

  /**
   * Dismiss an item with an associated indicatorDisplayer.
   * @param indicatorDisplayer - The caller of this function. Used
   * to figure out which item should be dismissed.
   */
  public dismiss(indicatorDisplayer: {}): void {
    const itemToRemove = this._shownItems.find((item: IIndicatorItem) => {
      return item.indicatorDisplayer === indicatorDisplayer;
    });
    if (itemToRemove) {
      this.dismissWithId(itemToRemove.id);
    }
  }

  /**
   * Dismiss an activity indicator item.
   * @param {number} id - The id of the item to be dismissed.
   * This is provided to ensure that the right message is dismissed
   * in the case of multiple shown items. If undefined,
   * the top item will be dismissed.
   */
  public dismissWithId(id: number): void {
    let indexToRemove: number = this._shownItems.findIndex((item: IIndicatorItem) => {
      return item.id === id;
    });
    if (indexToRemove === -1) {
      // The id could be undefined or the item could have been 
      // removed by a previous call without an id.
      // Find the first appropriate item to remove, starting from the end of the list.
      const reversedCopy: IIndicatorItem[] = this._shownItems.slice().reverse();
      indexToRemove = this._shownItems.length - 1 - reversedCopy.findIndex((item: IIndicatorItem) => {
        // Do not dismiss items associated with an indicatorDisplayer,
        // because those are guaranteed to be dismissed with an id.
        // Dismiss the first item without an indicatorDisplayer.
        return !item.indicatorDisplayer;
      });
      if (indexToRemove === -1) {
        // Didn't find any items without an indicatorDisplayer,
        // so there's nothing to do.
        return;
      }
    }
    const dismissingCurrentIndicator: boolean = indexToRemove === this._shownItems.length - 1;
    this._shownItems.splice(indexToRemove, 1);
    if (!dismissingCurrentIndicator) {
      return;
    }
    if (this._isActive) {
      // There's another item to be shown.
      if (!this._isHidden) {
        this._showCurrentItem();
      }
    } else {
      // The activity indicator is no longer active.
      if (this._isHidden) {
        this._isHidden = false;
      } else {
        this._activityIndicatorBridge.dismiss();
      }
    }
  }

  /**
   * 
   * @param text The text to be shown
   * @param indicatorDisplayer Optional. The caller of this function. Used
   * to keep track of which item should be dismissed when dismiss is called.
   * If this is provided, callers don't have to keep
   * track of the id. Should only be omitted if the caller can't reliably
   * be the same object that calls dismiss - namely calls from ClientAPI.
   * @returns The id that can be used to dismiss the indicator
   */
  public show(text: string, indicatorDisplayer?: {}, subText?: string): number {
    const item: IIndicatorItem = {
      id: this._currentId++,
      indicatorDisplayer,
      subText: subText || '',
      text: text || '',
    };
    this._shownItems.push(item);
    if (!this._isHidden) {
      // Even if the indicator was already shown, call show to update the text.
      this._showCurrentItem();
    }
    return item.id;
  }

  public hide(): void {
    if (!this._isActive || this._isHidden) {
      return;
    }
    this._activityIndicatorBridge.dismiss();
    this._isHidden = true;
  }

  public unhide(): void {
    if (!this._isActive || !this._isHidden) {
      return;
    }
    this._showCurrentItem();
    this._isHidden = false;
  }

  private get _isActive(): boolean {
    return this._shownItems.length > 0;
  }

  private _showCurrentItem(): void {
    const item = this._shownItems[this._shownItems.length - 1];
    const params = {
      subText: item.subText,
      text: item.text,
    };
    this._activityIndicatorBridge.show(params);
  }
};
