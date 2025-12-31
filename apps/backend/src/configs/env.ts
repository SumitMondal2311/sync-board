import "dotenv/config";
import { cleanEnv, num, str } from "envalid";

export const env = cleanEnv(process.env, {
    PORT: num({ default: 4321 }),
    DATABASE_URL: str(),
});
