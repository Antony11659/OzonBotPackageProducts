export const countPackagingTime = (startedAt) => {
    const now = new Date();
    const ms = now - startedAt;
    const minutes = Math.floor(ms / (1000 * 60));
    return minutes;
};