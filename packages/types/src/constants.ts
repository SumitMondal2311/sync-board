// ----- Query Params ----- //

export const QUERY_PARAMS = {
    board_id: "board_id",
    list_id: "list_id",
} as const;

// ----- Cookies ----- //

export const COOKIES = {
    sign_up_attempt_token: "__sua_token",
    session_id: "__session_id",
} as const;

// ----- Headers ----- //

export const HEADERS = {
    workspace_id: "x-workspace-id",
} as const;
