import { env } from "@/configs/env";

export const MAX_DB_RECONNECTION_ATTEMPTS = env.isProd ? 5 : 3;
export const VERIFICATION_CODE_EXPIRY = env.isProd ? 30 * 60 : 5 * 60;
export const MAX_VERIFICATION_CODE_ATTEMPTS = env.isProd ? 5 : 3;
export const SESSION_EXPIRY = env.isProd ? 24 * 60 * 60 : 60 * 60;
export const MAX_ACTIVE_SESSIONS = env.isProd ? 5 : 2;
