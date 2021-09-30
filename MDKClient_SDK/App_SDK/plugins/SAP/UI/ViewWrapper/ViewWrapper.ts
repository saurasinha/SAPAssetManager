export class ViewWrapper {
  private _iosView: any;
  private _androidView: any;
  get ios(): any {
    return this._iosView;
  }
  get android(): any {
    return this._androidView;
  }
  public setView(view: any) {
    //
  }
};
