

export interface IQueueStateStore {
  queue_isLoading: boolean;
}

export interface IQueueListRequestBody {
  orderStatus: string;
}

export interface IQueueListResponse {
  data:{
    success: boolean;
    message: string;
  }
}

