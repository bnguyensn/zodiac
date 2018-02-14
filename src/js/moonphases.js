'use strict';

const MS_IN_DAY = 86400000;

const MEAN_LUNATION_DAYS = 29.530588;  // Mean value of a moon synodic month
const MEAN_LUNATION_MS = MEAN_LUNATION_DAYS * MS_IN_DAY;

const NEW_MOON_EPOCH_DATE = new Date(2000, 0, 6, 18, 14);  // There was a New Moon starting on this Date
const NEW_MOON_EPOCH_MS = NEW_MOON_EPOCH_DATE.getTime();

/**
 * Return the approximate New Moon dates sandwiching a given date
 * @param {Date} date A given date
 * @return {Array} [NM_date1, NM_date2] New Moon dates sandwiching the given date. If the given date is a New Moon Date, NM_date 2 === undefined.
 * */
function getNMSandwichDates(date) {
    const date_ms = date.getTime();
    const date_norm = date.setHours(0, 0, 0, 0);  // Normalise to 00:00:00:0000

    // Find out the ms difference between the New Moon epoch and our given date
    const date_elapsed_ms = date_ms - NEW_MOON_EPOCH_MS;

    // Find the two New Moon dates sandwiching our given date
    const low_end_LP = Math.floor(date_elapsed_ms / MEAN_LUNATION_MS);
    const low_end_NMDate = new Date(NEW_MOON_EPOCH_MS + low_end_LP * MEAN_LUNATION_MS);
    const low_end_NMDate_norm = new Date(low_end_NMDate);
    low_end_NMDate_norm.setHours(0, 0, 0, 0);

    let high_end_LP;
    let high_end_NMDate;
    let high_end_NMDate_norm;

    if (date_norm !== low_end_NMDate_norm) {
        high_end_LP = low_end_LP + 1;
        high_end_NMDate = new Date(NEW_MOON_EPOCH_MS + high_end_LP * MEAN_LUNATION_MS);
        high_end_NMDate_norm = new Date(high_end_NMDate);
        high_end_NMDate_norm.setHours(0, 0, 0, 0);
    }
    
    return [low_end_NMDate, high_end_NMDate]
}

/**
 * 
 * */
function getChineseNewYear(year) {

}

function test() {
    const d = new Date(2028, 1, 14);

    const a = getNMSandwichDates(d);

    console.log(`NMDate 1 = ${a[0]}\nNMDate 2 = ${a[1]}`);
}

test();

/*
module.exports = {
    getNMSandwichDates: getNMSandwichDates
};
*/
