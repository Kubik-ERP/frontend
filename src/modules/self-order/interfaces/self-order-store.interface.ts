/**
 * @description Interface for Self Order Store State
 */
export interface ISelfOrderStoreState {
  selfOrder_isLoading: boolean;
  selfOrderInvalid_isLoading: boolean;
  selfOrderLogin_isLoading: boolean;
  selfOrderRegister_isLoading: boolean;
}

/**
 * @description Interface for Self Order Verify Payload
 */
export interface ISelfOrderVerifyPayload {
  storeId: string;
  tablesName: string;
}

/**
 * @description Interface for Self Order Verify Response
 */
export interface ISelfOrderVerifyResponse {
  message: string;
  valid: boolean;
}
