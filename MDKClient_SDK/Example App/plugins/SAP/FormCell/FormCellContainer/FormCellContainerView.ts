import { Page } from 'tns-core-modules/ui/page/page';
import { MDKFormCellModel } from '../FormCellFactory/FormCellFactory';

export class FormCellContainerView {

  protected page: Page;
  protected containerCallback: any;
  protected params: any;

  constructor(page: Page, containerCallback: any, params: any) {
    this.page = page;
    this.containerCallback = containerCallback;
    this.params = params;
  }

  public addFormCell(model: MDKFormCellModel) {
    // intentional no-op
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

  public updateCell(params: any, row: number, section: number) {
    // intentional no-op
  }
  
  public updateCells(params: any, style: any) {
    // intentional no-op
  }

  public setFocus(row: number, section: number, keyboardVisibility: string): void {
    // intentional no-op
  }

  public hideLazyLoadingIndicator(row: number, section: number) {
    // intentional no-op
  }

  public setInEmbeddedFrame(embedded: boolean) {
    // No-op
  }
};
