/**
 * @description Interface for Self Order Login Form Data
 */
export interface ISelfOrderLoginFormData {
  code: string;
  email: string;
  name: string;
  number: string;
}

/**
 * @description Interface for Self Order Login Payload
 */
export interface ISelfOrderLoginPayload {
  code: string;
  email: string;
  name: string;
  number: string;
  storeId: string | null;
}
