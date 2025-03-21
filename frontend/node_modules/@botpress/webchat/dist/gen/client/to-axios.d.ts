import { AxiosRequestConfig } from "axios";
export type Primitive = string | number | boolean;
export type Value<P extends Primitive> = P | P[] | Record<string, P>;
export type QueryValue = Value<string> | Value<boolean> | Value<number> | undefined;
export type AnyQueryParams = Record<string, QueryValue>;
export type HeaderValue = string | undefined;
export type AnyHeaderParams = Record<string, HeaderValue>;
export type AnyBodyParams = Record<string, any>;
export type ParsedRequest = {
    method: string;
    path: string;
    query: AnyQueryParams;
    headers: AnyHeaderParams;
    body: AnyBodyParams;
};
export declare const toAxiosRequest: (req: ParsedRequest) => AxiosRequestConfig;
