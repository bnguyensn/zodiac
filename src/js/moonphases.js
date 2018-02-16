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

/**
 * Convert a given Julian Ephemeris Day to UTC
 * */
function jdeToUTC(jde) {
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
    return new Date(UTCy, UTCm - 1, UTCd, UTChr, UTCmin, UTCsec);
}

/**
 * Convert a given date to year with decimal
 */
function dateToYrDcm(date) {
    const y = date.getFullYear();

    const d_start = new Date(y, 0, 1).getTime(),
          d_end = new Date(y + 1, 0, 1).getTime();

    const d_total = d_end - d_start;
    const d_elapsed = date.getTime() - d_start;

    const y_dcm = d_elapsed / d_total;

    return y + y_dcm;
}

/* ********** MOON PHASES FUNCTIONS ********** */

/**
 * From a given point in time (year with decimal), return its 2 sandwiching New Moon index relative to the JDE epoch
 * This is a helper for the getNthNM() function
 * */
function yrToSandwichNs(year) {
    const n = (year - 2000) * 12.3685;

    return [Math.floor(n), Math.ceil(n)]
}

/**
 * Return the Planetary Arguments adjustment for a given n and T. These parameters come from the getNthNM() function
 * */
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
 * Return the New Moon Corrections adjustment for a given E, S, M, F, and O
 * These parameters come from the getNthNM() function
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
 * Return the nth New Moon since the epoch JDE date
 * @param {Number} n A number representing the nth New Moon since the epoch JDE date
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

/* ********** EXPORT FUNCTIONS ********** */

/**
 * Return the approximate New Moon dates sandwiching a given UTC date
 * @param {Date} date A given UTC date
 * @return {Array} New Moon dates sandwiching the given UTC date
 * */
function getNMSandwichDates(date) {
    const ns = yrToSandwichNs(dateToYrDcm(date));

    return [getNthNM(ns[0]), getNthNM(ns[1])]
}

module.exports = {
    getNMSandwichDates: getNMSandwichDates
};