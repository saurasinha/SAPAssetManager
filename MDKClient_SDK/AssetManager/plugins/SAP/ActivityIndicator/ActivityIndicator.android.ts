import { IIndicatorItem } from './ActivityIndicator';
import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import * as app from 'tns-core-modules/application';
const androidApp = app.android;
declare var com: any;
declare var org: any;

export class ActivityIndicator {
  public static get instance(): ActivityIndicator {
    return ActivityIndicator._instance;
  }

  private static _instance: ActivityIndicator = new ActivityIndicator();
  private _activityIndicatorBridge = new com.sap.mdk.client.ui.fiori.activityIndicator.ActivityIndicator();

  private _shownItems: IIndicatorItem[] = [];

  private _isHidden: boolean = false;
  private _currentId: number = 0;
  private _screenSharing: boolean;

  private constructor() {
    if (ActivityIndicator._instance) {
      throw new Error(ErrorMessage.ACTIVITY_INDICATOR_INSTANTIATION_FAILED);
    }
    ActivityIndicator._instance = this;
  }

  public dismiss(indicatorDisplayer: {}): void {
    const itemToRemove = this._shownItems.find((item: IIndicatorItem) => {
      return item.indicatorDisplayer === indicatorDisplayer;
    });
    if (itemToRemove) {
      this.dismissWithId(itemToRemove.id);
    }
  }

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

  public setScreenSharing(screenSharing: boolean) {
    this._screenSharing = screenSharing;
  }

  private get _isActive(): boolean {
    return this._shownItems.length > 0;
  }

  private _showCurrentItem(): void {
    const item = this._shownItems[this._shownItems.length - 1];
    const params: org.json.JSONObject = new org.json.JSONObject();
    params.put('text', item.text);
    params.put('subText', item.subText);
    params.put('screenSharing', this._screenSharing);
    this._activityIndicatorBridge.show(params, androidApp.foregroundActivity);
  }
};
