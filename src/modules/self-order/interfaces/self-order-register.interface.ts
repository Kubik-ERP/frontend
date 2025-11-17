/**
 * @description Interface for Self Order Register Form Data
 */
export interface ISelfOrderRegisterFormData {
  code: string;
  name: string;
  number: string;
}

/**
 * @description Interface for Self Order Register Payload
 */
export interface ISelfOrderRegisterPayload {
  code: string;
  name: string;
  number: string;
  storeId: string | null;
}
