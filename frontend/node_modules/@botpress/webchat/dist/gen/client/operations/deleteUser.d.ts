export interface DeleteUserRequestHeaders {
    "x-user-key": string;
}
export interface DeleteUserRequestQuery {
}
export interface DeleteUserRequestParams {
}
export interface DeleteUserRequestBody {
}
export type DeleteUserInput = DeleteUserRequestBody & DeleteUserRequestHeaders & DeleteUserRequestQuery & DeleteUserRequestParams;
export type DeleteUserRequest = {
    headers: DeleteUserRequestHeaders;
    query: DeleteUserRequestQuery;
    params: DeleteUserRequestParams;
    body: DeleteUserRequestBody;
};
export declare const parseReq: (input: DeleteUserInput) => DeleteUserRequest & {
    path: string;
};
export interface DeleteUserResponse {
}
