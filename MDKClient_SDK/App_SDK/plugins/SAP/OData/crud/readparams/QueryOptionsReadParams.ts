import { ReadParams } from './ReadParams';

export class QueryOptionsReadParams extends ReadParams {
  private queryOptions: string;
  
  public constructor(entitySetName: string, queryOptions: string) {
    super(entitySetName);
    this.queryOptions = queryOptions;
  }

  public getQueryOptions(): string {
    return this.queryOptions;
  }
}
