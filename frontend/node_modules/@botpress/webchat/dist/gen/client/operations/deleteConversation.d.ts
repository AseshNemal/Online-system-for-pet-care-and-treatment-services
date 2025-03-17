export interface DeleteConversationRequestHeaders {
    "x-user-key": string;
}
export interface DeleteConversationRequestQuery {
}
export interface DeleteConversationRequestParams {
    id: string;
}
export interface DeleteConversationRequestBody {
}
export type DeleteConversationInput = DeleteConversationRequestBody & DeleteConversationRequestHeaders & DeleteConversationRequestQuery & DeleteConversationRequestParams;
export type DeleteConversationRequest = {
    headers: DeleteConversationRequestHeaders;
    query: DeleteConversationRequestQuery;
    params: DeleteConversationRequestParams;
    body: DeleteConversationRequestBody;
};
export declare const parseReq: (input: DeleteConversationInput) => DeleteConversationRequest & {
    path: string;
};
export interface DeleteConversationResponse {
}
