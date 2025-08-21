export * from './cash-in-out-list.interface';

export interface ICashInOutStateStore {
  cashInOut_isLoading: boolean;
  cashInOut_list: ICashInOutData;
}

export interface ICashInOutData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  meta: ISecondPageMeta;
}

export interface ICashInOutListResponse extends IDefaultResponseFetch {
  data: ICashInOutData;
}
