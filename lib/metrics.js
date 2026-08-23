export const getMinutes = (startedAt) => {
    const now = new Date();
    const ms = now - startedAt;
    const minutes = Math.floor(ms / (1000 * 60));
    return minutes;
}   

export const countTime = (startedAt) => {
    const minutes = getMinutes(startedAt);
    const hours = Math.trunc(minutes / 60);
    const leftHoursMinutes = minutes % 60;
    if (minutes < 60) {
        return `${minutes} мин.`;
    }
    return `${hours}ч. ${leftHoursMinutes ?? '00'}мин.`;
};