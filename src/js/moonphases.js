'use strict';

/* ********** CONSTANTS ********** */

const MS_IN_DAY = 86400000;
const HR_IN_DAY = 24;
const MIN_IN_HOUR = 60;
const SEC_IN_MIN = 60;

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

/* ********** HELPER FUNCTIONS ********** */

function normalizeDeg(deg) {
    if (deg < 0) {
        return 360. + (deg % 360)
    }
    return deg % 360
}

function radToDeg(rad) {
    return rad * (180 / Math.PI)
}

function degToRad(deg) {
    return deg / (180 / Math.PI)
}

function getDecimals(n) {
    return n - Math.trunc(n)
}

function jdeToUTC(jde) {
    // JDE = Julian Ephemeris Day

    if (jde < 0) {
        // This function is only valid for positive JDEs
        return NaN
    }

    const jde_adj = jde + 0.5,
          Z = Math.trunc(jde_adj),
          F = jde_adj - Z;

    let A, alpha;

    if (Z < 2299161) {
        A = Z;
    } else {
        alpha = Math.trunc((Z - 1867216.25) / 36524.25);
        A = Z + 1 + alpha - Math.trunc(alpha / 4);
    }

    const B = A + 1524,
          C = Math.trunc((B - 122.1) / 365.25),
          D = Math.trunc(365.25 * C),
          E = Math.trunc((B - D) / 30.6001);

    let UTCy, UTCm, UTCd, UTChr, UTCmin, UTCsec;

    // UTC day of the month (with decimals), hours, minutes, and seconds
    UTCd = B - D - Math.trunc(30.6001 * E) + F;
    UTChr = HR_IN_DAY * getDecimals(UTCd);
    UTCmin = MIN_IN_HOUR * getDecimals(UTChr);
    UTCsec = SEC_IN_MIN * getDecimals(UTCmin);

    // UTC month
    E < 14 ? UTCm = E - 1 : UTCm = E - 13;

    // UTC year
    UTCm > 2 ? UTCy = C - 4716 : UTCy = C - 4715;

    // Remember that month is 0-indexed
    return new Date(UTCy, UTCm - 1, UTCd, UTChr, UTCmin, UTCsec).toString();
}

/* ********** MOON PHASES FUNCTIONS ********** */

/**
 * Return the Planetary Arguments adjustment for a given n and T
 * @param {Number} n This Number is found in the getNthNM() function
 * @param {Number} T This Number is found in the getNthNM() function
 * @return {Number} The Planetary Arguments adjustment */
function getPlnArgsAdj(n, T) {
    // The 14 As Planetary arguments
    const arr1 = [
        299.77 + 0.107408 * n - 0.009173 * (T ** 2),
        251.88 + 0.016321 * n,
        251.83 + 26.651886 * n,
        349.42 + 36.412478 * n,
        84.66 + 18.206239 * n,
        141.74 + 53.303771 * n,
        207.14 + 2.453732 * n,
        154.84 + 7.30686 * n,
        34.52 + 27.261239 * n,
        207.19 + 0.121824 * n,
        291.34 + 1.844379 * n,
        161.72 + 24.198154 * n,
        239.56 + 25.513099 * n,
        331.55 + 3.592518 * n
    ];

    // Take a sin on the 14 As
    const arr2 = arr1.map(item1 => Math.sin(degToRad(item1)));

    // 14 additional adjustments
    const arr3 = [325, 165, 164, 126, 110, 62, 60, 56, 47, 42, 40, 37, 35, 23];

    // Planetary Arguments array
    const PA_arr = arr2.map((item2, index2) => item2 * arr3[index2]);

    // Sum up the Planetary Arguments array to get the Planetary Arguments adjustment
    // Don't forget the x 10^-6 because we performed a x 10^6 for all arr3 items
    return (PA_arr.reduce((n1, n2) => n1 + n2, 0) * (10 ** -6))
}

/**
 * Return the New Moon Corrections adjustment for a given E, S, M, F, O
 * @param {Number} E This Number is found in the getNthNM() function
 * @param {Number} S This Number is found in the getNthNM() function
 * @param {Number} M This Number is found in the getNthNM() function
 * @param {Number} F This Number is found in the getNthNM() function
 * @param {Number} O This Number is found in the getNthNM() function
 * @return {Number} The New Moon Corrections adjustment
 * */
function getNMCorrsAdj(E, S, M, F, O) {
    // 25 New Moon corrections 1
    const arr1 = [
        -0.4072,
        0.17241 * E,
        0.01608,
        0.01039,
        0.00739 * E,
        -0.00514 * E,
        0.00208 * (E ** 2),
        -0.00111,
        -0.00057,
        0.00056 * E,
        -0.00042,
        0.00042 * E,
        0.00038 * E,
        -0.00024 * E,
        -0.00017,
        -0.00007,
        0.00004,
        0.00004,
        0.00003,
        0.00003,
        -0.00003,
        0.00003,
        -0.00002,
        -0.00002,
        0.00002
    ];

    // 25 New Moon corrections 2
    const arr2 = [
        M,
        S,
        2 * M,
        2 * F,
        M - S,
        M + S,
        2 * S,
        M - 2 * F,
        M + 2 * F,
        2 * M + S,
        3 * M,
        S + 2 * F,
        S - 2 * F,
        2 * M - S,
        O,
        M + 2 * S,
        2 * M - 2 * F,
        3 * S,
        M + S - 2 * F,
        2 * M + 2 * F,
        M + S + 2 * F,
        M - S + 2 * F,
        M - S - 2 * F,
        3 * M + S,
        4 * M
    ];

    // Take a sin on the 25 New Moon corrections 2
    const arr3 = arr2.map(item2 => Math.sin(degToRad(item2)));

    // New Moon Corrections array
    const NMCorrs_arr = arr1.map((item1, index1) => item1 * arr3[index1]);

    // Sum up the New Moon Corrections array to get the New Moon Corrections adjustment
    return NMCorrs_arr.reduce((n1, n2) => n1 + n2, 0)
}

/**
 * Return the nth New Moon since the New Moon epoch UTC date (06/01/2000 18:14)
 * @param {Number} n A number representing the nth New Moon since the New Moon epoch UTC date
 * @return {Date} New Moon date corresponding to the given n
 * */
function getNthNM(n) {
    // Approximate Julian centuries since the 2000 epoch
    const T = n / 1236.85;

    // New Moon time
    const JDE = 2451550.09765 + 29.530588853 * n
                + 0.00013377 * (T ** 2) + 0.000000150 * (T ** 3) + 0.00000000073 * (T ** 4);

    // E
    const E = 1 - 0.002516 * T - 0.0000074 * (T ** 2);

    // The Sun's mean anomaly (deg)
    const S = 2.5534 + 29.10535669 * n - 0.0000218 * (T ** 2) - 0.00000011 * (T ** 3);
    const S_norm = normalizeDeg(S);

    // The Moon's mean anomaly (deg)
    const M = 201.5643 + 385.81693528 * n + 0.0107438 * (T ** 2) + 0.00001239 * (T ** 3) - 0.000000058 * (T ** 4);
    const M_norm = normalizeDeg(M);

    // The Moon's argument of latitude (deg)
    const F = 160.7108 + 390.67050274 * n - 0.0016341 * (T ** 2) - 0.00000227 * (T ** 3) + 0.000000011 * (T ** 4);
    const F_norm = normalizeDeg(F);

    // Longitude of the ascending node of the lunar orbit (deg)
    const O = 124.7746 - 1.5637558 * n + 0.0020691 * (T ** 2) + 0.00000215 * (T ** 3);
    const O_norm = normalizeDeg(O);

    // New Moon corrections (days)
    const NMCadj = getNMCorrsAdj(E, S_norm, M_norm, F_norm, O_norm);

    // Planetary arguments adjustment
    const PAadj = getPlnArgsAdj(n, T);

    // JDE with adjustments
    const JDE_adj = JDE + NMCadj + PAadj;

    return jdeToUTC(JDE_adj)
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

function test2() {
    console.log(getPlnArgsAdj(-283, -0.22881));
}

module.exports = {
    jdeToUTC: jdeToUTC,
    getPlnArgsAdj: getPlnArgsAdj,
    getNMCorrsAdj: getNMCorrsAdj,
    getNthNM: getNthNM
};