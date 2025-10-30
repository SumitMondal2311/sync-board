export const IS_PROD = process.env.NODE_ENV === "production";
export const MAX_VERIFICATION_CODE_ATTEMPTS = IS_PROD ? 5 : 3;
export const VERIFICATION_CODE_EXPIRY = IS_PROD ? 30 * 60 : 5 * 60;
export const MAX_DB_RECONNECTION_ATTEMPTS = IS_PROD ? 5 : 3;
export const SESSION_EXPIRY = IS_PROD ? 24 * 60 * 60 : 60 * 60;
