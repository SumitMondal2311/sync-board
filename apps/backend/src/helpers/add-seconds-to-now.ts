export const addSecondsToNow = (duration: number) => {
    return new Date(Date.now() + 1000 * duration);
};
