
export function formatDate(date) {
    var month = date.getMonth(),
        year = date.getFullYear();

    if (month == 0) {
        month = 12
    }

    var day = '' + date.getDate(),
        month = '' + month,
        year = '' + year;

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
