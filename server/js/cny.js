'use strict';

const moonphases = require('./moonphases');

/* ********** CONSTANTS ********** */

// As a rule of thumb, Chinese New Year falls between Jan 21 and Feb 21
// We define here these two extremes and median date between them to support our functions
const CNY_HE_MONTH = 1;  // Note that month 1 = Feb
const CNY_HE_DAY = 21;

const CNY_MEDIAN_MONTH = 1;
const CNY_MEDIAN_DAY = 16;

const zodiacs = [
    'Mouse',
    'Ox',
    'Tiger',
    'Rabbit',
    'Dragon',
    'Snake',
    'Horse',
    'Goat',
    'Monkey',
    'Chicken',
    'Dog',
    'Pig'
];

const zodiacY = 1996;

/* ********** FUNCTIONS ********** */

/**
 * Return the approximate Chinese New Year date from a given UTC year
 * @param {int} year A given UTC year
 * @return {Date} Approximate Chinese New Year UTC date for the given UTC year
 * */
function getCNY(year) {
    const CNY_median_date = new Date(year, CNY_MEDIAN_MONTH, CNY_MEDIAN_DAY);

    const CNY_sandwich_dates = moonphases.getNMSandwichDates(CNY_median_date);

    // As a rule of thumb, return the "later" date
    // Unless it's later than Feb 21, then return the earlier date
    const CNY_he_date = new Date(year, CNY_HE_MONTH, CNY_HE_DAY);

    if (CNY_sandwich_dates[1] > CNY_he_date) {
        return CNY_sandwich_dates[0]
    }
    return CNY_sandwich_dates[1]
}

/**
 * Return the Chinese zodiac of a given UTC year
 * Keep in mind that Chinese New Year (CNY) occurs around mid Jan - mid Feb and this check is not being performed here
 * @param {int} year A given UTC year
 * @return {String} A Chinese zodiac
 * */
function getZodiacFromYear(year) {
    const zodiac_i = year < zodiacY ? 11 + ((year + 1 - zodiacY) % 12) : (year - zodiacY) % 12;
    return zodiacs[zodiac_i]
}

/**
 * Return the Chinese zodiac related to a given UTC date
 * We perform the CNY check mentioned in getZodiacFromYear() here
 * @param {Date} date A given UTC date
 * @return {String} A Chinese zodiac, or '' if date is not a Date
 * */
function getZodiac(date) {
    if (date instanceof Date) {
        const UTCy = date.getFullYear();
        const cny = getCNY(UTCy);

        if (date >= cny) {
            return getZodiacFromYear(UTCy)
        } else {
            return getZodiacFromYear(UTCy - 1)
        }
    } else {
        return ''
    }
}

module.exports = {
    getCNY: getCNY,
    getZodiac: getZodiac
};