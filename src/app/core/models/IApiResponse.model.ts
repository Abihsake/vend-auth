import { AppDomains } from '../enum/app-domains';

export interface IApiSuccessResponse<T> {
  message: string;
  data: T;
}

export interface IApiErrorResponse {
  statusCode: number;
  message: string[] | string;
  error: string;
}

export type AppDomain = AppDomains.COSTEASY | AppDomains.EPROCUREMENT | AppDomains.FLOW | AppDomains.POS;
