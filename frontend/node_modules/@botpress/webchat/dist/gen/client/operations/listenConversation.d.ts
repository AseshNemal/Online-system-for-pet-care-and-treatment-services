export interface ListenConversationRequestHeaders {
    "x-user-key": string;
}
export interface ListenConversationRequestQuery {
}
export interface ListenConversationRequestParams {
    id: string;
}
export interface ListenConversationRequestBody {
}
export type ListenConversationInput = ListenConversationRequestBody & ListenConversationRequestHeaders & ListenConversationRequestQuery & ListenConversationRequestParams;
export type ListenConversationRequest = {
    headers: ListenConversationRequestHeaders;
    query: ListenConversationRequestQuery;
    params: ListenConversationRequestParams;
    body: ListenConversationRequestBody;
};
export declare const parseReq: (input: ListenConversationInput) => ListenConversationRequest & {
    path: string;
};
export interface ListenConversationResponse {
}
