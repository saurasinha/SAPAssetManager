import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import { IPopoverData } from './IPopoverData';
import {DataConverter} from '../Common/DataConverter';
import * as app from 'tns-core-modules/application';
import { Util } from '../Common/Util';

declare var com;

export class Popover {

  public static getInstance(): Popover {
    return Popover._instance;
  }

  private static _instance: Popover = new Popover();
  private _interop = com.sap.mdk.client.ui.popover.Popover.getInstance();

  private constructor() {
    if (Popover._instance) {
      throw new Error(ErrorMessage.POPOVER_INSTANTIATION_FAILED);
    }
    Popover._instance = this;
  }

  public show(data: any): Promise<IPopoverData> {
    let context = app.android.foregroundActivity;
    let pressedItem = this.getPressedItem(data.pressedItem);
    return new Promise((resolve, reject) => {
      let nativeCallback = new com.sap.mdk.client.ui.popover.IPopoverCallback ({
        onPress: (item) => {
          let onPressValue = Util.getPopoverOnPress(item);
          resolve(onPressValue);
        },
      });
      return this._interop.showPopover(DataConverter.toJavaObject(data), 
        pressedItem, nativeCallback, context);
    });
  }

  public dismiss(page) {
    // no-op
  }

  public setPopoverAnchor(modalFrame, page, pressedItem) {
    // no-op
  }

  private getPressedItem(pressedItem) {
    if (!pressedItem) {
      return null;
    }

    if (pressedItem.isActionItem()) {
      // Action was triggered from an action bar
      const actionItem = pressedItem.getActionItem();
      const nativeBar = actionItem.actionBar.nativeViewProtected;
      const index = nativeBar.getMenu().findItemIndex(actionItem._getItemId());
      // BCP-2070066946: Fix popover not showing
      // the ActionMenuView might not always be at 0 index.
      let navBarChild;
      for (let i = 0; i < nativeBar.getChildCount(); i++) {
        navBarChild = nativeBar.getChildAt(i);
        if (navBarChild instanceof androidx.appcompat.widget.ActionMenuView) {
          break;
        } else {
          navBarChild = null;
        }
      }
      if (navBarChild && index > -1) {
        const navBarChildMenuItem =  navBarChild.getChildAt(index);
        return navBarChildMenuItem;
      }
    } else if (pressedItem.isToolbarItem()) {
      return pressedItem.getToolbarItem().actionView.android;
    } else if (pressedItem.isTabItem()) {
      // Action was triggered from tabItem
      return pressedItem.getTabItem().nativeView;
    } else {
      // Action was triggered from a control
      return pressedItem.getControlView().android;
    }
  }
};
