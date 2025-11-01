import { config } from "dotenv";
import { cleanEnv, num, str } from "envalid";

config();

export const env = cleanEnv(process.env, {
    NODE_ENV: str({
        choices: ["development", "test", "production"],
    }),
    DATABASE_URL: str(),
    PORT: num({ default: 4321 }),
});
