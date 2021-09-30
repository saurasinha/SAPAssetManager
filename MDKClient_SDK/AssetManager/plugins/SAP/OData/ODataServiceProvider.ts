export class ODataServiceProvider {
  public static getServiceTimeZoneAbbreviation() {
    return '';
  }

  public static clear(context, name) {
    return new Promise((resolve, reject) => resolve(''));
  }

  /// Offline specific methods
  public download(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public initOfflineStore(context, params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public upload(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public close(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public clear(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  /// Online specific methods
  public create(params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public open(context, params): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  /// Common CRUD methods
  public read(entitySet, properties, queryString, headers, requestOptions, pageSize?): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public createEntity(odataCreator): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public updateEntity(odataUpdater): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public deleteEntity(odataDeleter): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public deleteMediaEntity(entitySetName, queryString, readLink, headers, requestOptions): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public createMediaEntity(entitySetName, properties, headers, requestOptions, media): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public createRelatedMediaEntity(entitySetName, properties, parent, headers, 
                                  requestOptions, media): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public downloadMedia(entitySet, queryString, readLink, headers, requestOptions): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public isMediaLocal(entitySet, readLink): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  // Change Set methods
  public beginChangeSet(): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public cancelChangeSet(): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public commitChangeSet(): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public count(entitySet, properties, queryString): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };
  
  public callFunction(functionName, functionParameters, functionOptions): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public getPropertyType(params): string {
    return '';
  };

  public getVersion(params): number {
    return 0;
  };

  public getOfflineStoreStatus(): string {
    return '';
  };

  public downloadStream(entitySetName, properties, query, readLink, headers, requestOptions): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public uploadStream(entitySetName, properties, query, readLink, headers, requestOptions): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  };

  public undoPendingChanges(entitySetName, queryOptions, readLink): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public getOfflineParameter(name): any {
    return null;
  };

  public setOfflineParameter(name, value): void {
  };

  public getPreviousUser(): string {
    return '';
  }
}
