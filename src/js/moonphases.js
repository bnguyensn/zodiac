'use strict';

const MS_IN_DAY = 86400000;

const MEAN_LUNATION_DAYS = 29.530588853;  // Mean value of a moon synodic month
const MEAN_LUNATION_MS = MEAN_LUNATION_DAYS * MS_IN_DAY;

const NEW_MOON_EPOCH_DATE = new Date(2000, 0, 6, 18, 14);  // There was a New Moon starting on this Date (note that month 0 = Jan)
const NEW_MOON_EPOCH_MS = NEW_MOON_EPOCH_DATE.getTime();

// As a rule of thumb, Chinese New Year falls between Jan 21 and Feb 21
// We define here these two extremes and median date between them to support our functions
const CNY_HE_MONTH = 1;  // Note that month 1 = Feb
const CNY_HE_DAY = 21;

const CNY_LE_MONTH = 0;
const CNY_LE_DAY = 21;

const CNY_MEDIAN_MONTH = 1;
const CNY_MEDIAN_DAY = 16;

/**
 * Normalise a given degree
 * @param {Number} deg The degree to be normalised
 * @return The normalised degree
 * */
function normalizeDeg(deg) {
    if (deg < 0) {
        return 360. + (deg % 360)
    }
    return deg % 360
}

/**
 * Return the nth New Moon since the New Moon epoch UTC date (06/01/2000 18:14)
 * @param {Number} n A number representing the nth New Moon since the New Moon epoch UTC date
 * @return {Date} New Moon date corresponding to the given n
 * */
function getNthNM(n) {
    // Approximate Julian centuries since the 2000 epoch
    const t = n / 1236.85;

    // Time since the 2000 epoch (days)
    const n_extra_days = MEAN_LUNATION_DAYS + 0.00013377 * (t ** 2) + 0.000000150 * (t ** 3) + 0.00000000073 * (t ** 4);

    // E
    const E = 1 - 0.002516 * t - 0.0000074 * (t ** 2);

    // The Sun's mean anomaly (deg)
    const S = 2.5534 + 29.10535669 * n - 0.0000218 * (t ** 2) - 0.00000011 * (t ** 3);
    const S_norm = normalizeDeg(S);

    // The Moon's mean anomaly (deg)
    const M = 201.5643 + 385.81693528 * n + 0.0107438 * (t ** 2) + 0.00001239 * (t ** 3) - 0.000000058 * (t ** 4);
    const M_norm = normalizeDeg(M);

    // The Moon's argument of latitude (deg)
    const F = 160.7108 + 390.67050274 * n - 0.0016341 * (t ** 2) - 0.00000227 * (t ** 3) + 0.000000011 * (t ** 4);
    const F_norm = normalizeDeg(F);

    // Longitude of the ascending node of the lunar orbit (deg)
    const O = 124.7746 - 1.5637558 * n + 0.0020691 * (t ** 2) + 0.00000215 * (t ** 3);
    const O_norm = normalizeDeg(O);

    // New Moon corrections (days)
    
}


/**
 * Return the approximate New Moon dates sandwiching a given UTC date
 * @param {Date} date A given UTC date
 * @return {Array} New Moon dates sandwiching the given UTC date. If the given UTC date is a New Moon Date, NM_date 2 === undefined.
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
    
    return [low_end_NMDate, high_end_NMDate];
}

/**
 * Return the approximate Chinese New Year date from a given UTC year
 * @param {Number} year A given UTC year
 * @return {Date} Approximate Chinese New Year UTC date for the given UTC year
 * */
function getChineseNewYear(year) {
    const CNY_median_date = new Date(year, CNY_MEDIAN_MONTH, CNY_MEDIAN_DAY);

    const CNY_sandwich_dates = getNMSandwichDates(CNY_median_date);

    if (!CNY_sandwich_dates[1]) {
        // Our median date is actually a New Moon date i.e. it's a Chinese New Year Date!
        return CNY_median_date
    } else {
        // As a rule of thumb, return the "later" date, unless it's later than Feb 21, then return the "earlier" date
        const CNY_he_date = new Date(year, CNY_HE_MONTH, CNY_HE_DAY);
        if (CNY_sandwich_dates[1] > CNY_he_date) {
            return CNY_sandwich_dates[0]
        }
        return CNY_sandwich_dates[1]
    }
}

function test() {
    const y = 2038

    const a = getChineseNewYear(y);
    const china_a = new Date(a);
    china_a.setHours(a.getHours() + 8);

    console.log(`CNY in ${y} = ${a.toString()} (UTC)\n${china_a.toString()} (China UTC + 8)`);
}

test();

/*
module.exports = {
    getNMSandwichDates: getNMSandwichDates
};
*/
