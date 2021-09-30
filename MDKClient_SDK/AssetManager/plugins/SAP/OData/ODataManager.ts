export class OData {
  private _onChangeset = false;

  public isOnChangeSet(): boolean {
    return this._onChangeset;
  }

  public createService(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public openService(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public downloadMedia(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public isMediaLocal(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public downloadOfflineOData(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public initializeOfflineStore(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public closeOfflineStore(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public clearOfflineStore(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public uploadOfflineOData(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public cancelUploadOfflineOData(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public cancelDownloadOfflineOData(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public read(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public update(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public create(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public createRelated(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public delete(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public createMedia(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public createRelatedMedia(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public beginChangeSet(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public cancelChangeSet(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public commitChangeSet(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public deleteMedia(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public count(params): Promise<number> {
    return new Promise((resolve, reject) => resolve(0));
  }

  public callFunction(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public getPropertyType(params): string {
    return '';
  }

  public getVersion(params): number {
    return 0;
  }

  public getOfflineStoreStatus(params): string {
    return '';
  }

  public downloadStream(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public uploadStream(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public undoPendingChanges(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public base64StringToBinary(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public getOfflineParameter(params): any {
    return null;
  }

  public setOfflineParameter(params): void {
  }

  public getPreviousUser(): string {
    return '';
  }
};
