import { ActionItem } from 'tns-core-modules/ui/action-bar';
import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import { IPopoverData } from './IPopoverData';
import { CommonUtil } from '../ErrorHandling/CommonUtil';
import { TabStrip } from 'tns-core-modules/ui/tab-navigation-base/tab-strip';
import { Util } from '../Common/Util';

declare var PopoverBridge: any;

export class Popover {

  public static getInstance(): Popover {
    return Popover._instance;
  }

  private static _instance: Popover = new Popover();
  private _interop = PopoverBridge.new();

  private constructor() {
    if (Popover._instance) {
      throw new Error(ErrorMessage.POPOVER_INSTANTIATION_FAILED);
    }
    Popover._instance = this;
  }

  public show(data: any): Promise<IPopoverData> {
    if (!data || !data.page) {
      Promise.reject("No valid popover data to show popover");
    }
  
    return this.getPopoverAnchor(data.page, data.pressedItem).then(anchor => {
      const page = data.page;

      // if there is no pressedItem, or no anchor found, popover menu is displayed in middle of screen.
      if (anchor) {
        // find anchor. then save pressedItem in page for restoring in future
        if (!page.popOverData || page.popOverData !== data) {
          page.popOverData = data;
        }
      } 

      let params: any = {};
      Object.assign(params, data);
      params.page = data.page.ios;
      params.pressedItem = anchor;
      return new Promise((resolve, reject) => {
        return this._interop.showResolveReject(params, onPress => {
          // clear cached data for popover
          if (page.popOverData) {
            page.popOverData = null;
          }
          let onPressValue = Util.getPopoverOnPress(onPress);
          resolve(onPressValue);
        }, (code, message, error) => {
          // clear cached data for popover
          if (page.popOverData) {
            page.popOverData = null;
          }
          reject(CommonUtil.toJSError(code, message, error));
        });
      });
    });
  }

  public dismiss(page) {
    if (page.ios && page.ios.presentedViewController) {
      if (page.ios.presentedViewController.modalPresentationStyle === UIModalPresentationStyle.Popover) {
        page.ios.presentedViewController.dismissViewControllerAnimatedCompletion(false, null);
      }
    }
  }

  public setPopoverAnchor(modalFrame, page, pressedItem) {
    if (modalFrame.viewController) {
      modalFrame.viewController.modalPresentationStyle = UIModalPresentationStyle.Popover;
      let popover = modalFrame.viewController.popoverPresentationController;
      if (popover !== null && pressedItem) {
        this.getPopoverAnchor(page, pressedItem).then(anchor => {
          if (anchor) {
            if (pressedItem.isActionItem() || pressedItem.isToolbarItem()) {
              popover.barButtonItem = anchor;
              popover.permittedArrowDirections = UIPopoverArrowDirection.Any; 
            } else {
              // It's a control
              const pressedControlView = anchor.getControlView();
              popover.sourceView = pressedControlView.ios;
              popover.sourceRect = pressedControlView.ios.bounds;
              popover.permittedArrowDirections = UIPopoverArrowDirection.Any; 
            }
            // save pressedItem in PopOver modal frame if it is not saved, or it is different to existing one
            if (!modalFrame.popOverAnchorItem || modalFrame.popOverAnchorItem !== pressedItem) {
              modalFrame.popOverAnchorItem = pressedItem;
            }
          }
        });
      }
    }
  }

  // TODO-FUTURE: It should be easier to resolve the underlying iOS component
  // to use as anchor. Somewhere inside _actionItem or _toolbarItem the
  // UIBarButtonItem must live and we should just get it from there instead
  // of with this looping around or the promise because of getToolbar()
  // returning one.

  private getPopoverAnchor(page, pressedItem) {
    // for popver triggered by action, there is no pressedItem attached. No need to find anchor
    if (!pressedItem) {
      return Promise.resolve(null);
    }

    if (pressedItem.isActionItem() && pressedItem.getActionItem()) {
      // Action was triggered from an action bar
      const actionItem = pressedItem.getActionItem();
      if (actionItem.ios && actionItem.actionBar && actionItem.actionBar.ios && actionItem.actionBar.actionItems) {
        // Get index of the ActionItem on that side
        const side: string = actionItem.ios.position;
        const actionItems = actionItem.actionBar.actionItems.getItems();
        if (side && actionItems && Array.isArray(actionItems)) {
          const sameSideActionItems = actionItems.filter(item => {
            // SB-5097 - add additional filter for visible items
            if (item.ios) {
              return item.ios.position === side && item.visibility === 'visible';
            }
          });
          let pos = sameSideActionItems.indexOf(actionItem);
          let index = side === 'left' ? pos : sameSideActionItems.length - pos - 1;
          if (index >= 0 && page.actionBar.ios && page.actionBar.ios.topItem) {
            let buttonItem: UIBarButtonItem;
            const navBar = page.actionBar.ios.topItem;
            if (side === 'left') {
              if (navBar.leftBarButtonItems.count > 0 && index < navBar.leftBarButtonItems.count) {
                buttonItem = navBar.leftBarButtonItems[index];
              }
            } else {
              if (navBar.rightBarButtonItems.count > 0 && index < navBar.rightBarButtonItems.count) {
                buttonItem = navBar.rightBarButtonItems[index];
              }
            }
            return Promise.resolve(buttonItem);
          }
        }
      }
    } else if (pressedItem.isToolbarItem() && pressedItem.getToolbarItem()) {
      return page.getToolbar().then((toolbarControl) => {
        // Action was triggered from a toolbar
        if (toolbarControl && toolbarControl.view()) {
          const toolbar = toolbarControl.view();
          const senderTag = pressedItem.getToolbarItem().tag;
          if (toolbar.ios && toolbar.ios.items && senderTag) {
            for (let i = 0; i < toolbar.ios.items.count; i++) {
              if (toolbar.ios.items[i].tag === senderTag) {
                return toolbar.ios.items[i];
              }
            }
          }
        }
      });
    } else if (pressedItem.isTabItem() && pressedItem.getTabItem()) {
      // Action was triggered from tabItem
      const senderId = pressedItem.getTabItem().id;
      const tabStrip = page.getTabControl();
      if (tabStrip instanceof TabStrip) {
        for (let item of tabStrip.items) {
          if (item.id === senderId) {
            return Promise.resolve(item.nativeView);
          }
        }
      }
   } else {
      // Action was triggered from a control
      if (pressedItem.getControlView() && pressedItem.getControlView().ios) {
        return Promise.resolve(pressedItem.getControlView().ios);
      }
    }
    return Promise.resolve(null);
  }
};
