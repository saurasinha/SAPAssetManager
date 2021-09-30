import { View } from 'tns-core-modules/ui/core/view';
import * as application from 'tns-core-modules/application';

export class ViewWrapper extends View {
  private _iosView: any;
  private _androidView: any;
  get ios(): any {
    return this._iosView;
  }
  get android(): any {
    return this._androidView;
  }
  public setView(view: any) {
    this._androidView = view;
    this._iosView = undefined;
  }
};
