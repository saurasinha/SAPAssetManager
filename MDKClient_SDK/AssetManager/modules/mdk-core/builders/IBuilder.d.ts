export interface IBuilder {
  data: any;
  build(): Promise<any>;
}
