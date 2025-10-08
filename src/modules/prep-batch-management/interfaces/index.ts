export type IBatchList = {
  batch: string;
  batchDate: Date;
  targetYield: string;
  notes?: string | null;
  batchStatus: string;
  updatedAt: Date;
};

export type IBatchListProvided = {
  batchList_values: IBatchList[];
  batchList_columns: IColumnDataTable[];
  batchList_getClassOfBatchStatus: (batchStatus: string) => string;
};
