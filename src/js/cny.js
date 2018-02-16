'use strict';

import * as moonphases from './moonphases';

/* ********** CONSTANTS ********** */

// As a rule of thumb, Chinese New Year falls between Jan 21 and Feb 21
// We define here these two extremes and median date between them to support our functions
const CNY_HE_MONTH = 1;  // Note that month 1 = Feb
const CNY_HE_DAY = 21;

const CNY_LE_MONTH = 0;
const CNY_LE_DAY = 21;

const CNY_MEDIAN_MONTH = 1;
const CNY_MEDIAN_DAY = 16;

/* ********** FUNCTIONS ********** */

/**
 * Return the approximate Chinese New Year date from a given UTC year
 * @param {Number} year A given UTC year
 * @return {Date} Approximate Chinese New Year UTC date for the given UTC year
 * */
function getCNY(year) {
    const CNY_median_date = new Date(year, CNY_MEDIAN_MONTH, CNY_MEDIAN_DAY);

    const CNY_sandwich_dates = moonphases.getNMSandwichDates(CNY_median_date);

    // As a rule of thumb, return the "later" date, unless it's later than Feb 21, then return the "earlier" date
    const CNY_he_date = new Date(year, CNY_HE_MONTH, CNY_HE_DAY);

    if (CNY_sandwich_dates[1] > CNY_he_date) {
        return CNY_sandwich_dates[0]
    }
    return CNY_sandwich_dates[1]
}

module.exports = {
    getCNY: getCNY
}