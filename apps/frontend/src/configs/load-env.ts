export const loadEnv = () => {
    ["NEXT_PUBLIC_BASE_URL"].forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`${key}: undefined`);
        }
    });
};
