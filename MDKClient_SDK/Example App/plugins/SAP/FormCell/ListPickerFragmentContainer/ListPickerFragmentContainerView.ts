import { Page } from 'tns-core-modules/ui/page/page';
import { MDKFormCellModel } from '../FormCellFactory/FormCellFactory';

export class ListPickerFragmentContainerView {

  protected page: Page;
  protected containerCallback: any;
  protected params: any;

  constructor(page: Page, params: any) {
    this.page = page;
    this.params = params;
  }

  public createNativeView(): Object {
    // intentional no-op
    return undefined;
  }

  public disposeNativeView(): void {
    // intentional no-op
  }

  public initNativeView(): void {
    // intentional no-op
  }

  public onFragmentContainerLoaded(): void {
    // intentional no-op
  }

  public onNavigatingBack(): void {
    // intentional no-op
  }

  public collapseToolBarActionView(): void {
    // intentional no-op
  }
};
