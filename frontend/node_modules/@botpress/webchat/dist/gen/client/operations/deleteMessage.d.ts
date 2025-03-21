export interface DeleteMessageRequestHeaders {
    "x-user-key": string;
}
export interface DeleteMessageRequestQuery {
}
export interface DeleteMessageRequestParams {
    id: string;
}
export interface DeleteMessageRequestBody {
}
export type DeleteMessageInput = DeleteMessageRequestBody & DeleteMessageRequestHeaders & DeleteMessageRequestQuery & DeleteMessageRequestParams;
export type DeleteMessageRequest = {
    headers: DeleteMessageRequestHeaders;
    query: DeleteMessageRequestQuery;
    params: DeleteMessageRequestParams;
    body: DeleteMessageRequestBody;
};
export declare const parseReq: (input: DeleteMessageInput) => DeleteMessageRequest & {
    path: string;
};
export interface DeleteMessageResponse {
}
