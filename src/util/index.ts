export const mergeDateTime = (date?: Date, time?: Date) => {
    date = date || new Date;
    if (!time) return date;
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
    );
}