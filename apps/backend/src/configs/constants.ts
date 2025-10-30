export const IS_PROD = process.env.NODE_ENV === "production";
export const MAX_DB_RECONNECTION_ATTEMPTS = IS_PROD ? 5 : 3;
