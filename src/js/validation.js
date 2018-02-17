'use strict';

const DEFAULT_DATE = {
    year: 2000,
    month: 1,
    day: 1
};

function checkNonDigits(str) {

    // Return true if str contains any non-digit character
    return /[\D]/.test(str)
}

function validateYear(year) {
    console.log(Number.isInteger(year) && year >= 1 && year <= 9999);
    return Number.isInteger(year) && year >= 1 && year <= 9999
}

function validateMonth(month) {
    console.log(Number.isInteger(month) && month >= 1 && month <= 12);
    return Number.isInteger(month) && month >= 1 && month <= 12
}

function validateDay(day, month = 1, year = 2000) {

    // The check uses default figures Jan (a month with 31 days) and 2000 (a leap year) to give the maximum allowable result
    // month and year should have been validated already in other functions
    const max_day = new Date(year, month, 0).getDate();
    console.log(`max_day = ${max_day}`);
    console.log(Number.isInteger(day) && day >= 1 && day <= max_day);
    return Number.isInteger(day) && day >= 1 && day <= max_day
}

function validateDate(date) {
    console.log(`Original params: year ${date.year}, month ${date.month}, day ${date.day}`);

    const check_date = {};

    for (let key in date) {
        if (date.hasOwnProperty(key)) {
            if (date[key] === '') {
                check_date[key] = DEFAULT_DATE[key];
            } else {
                check_date[key] = Number(date[key]);
            }
        }
    }

    console.log(`Updated params: year ${check_date.year}, month ${check_date.month}, day ${check_date.day}`);

    return validateYear(check_date.year) && validateMonth(check_date.month) && validateDay(check_date.day, check_date.month, check_date.year)
}

module.exports = {
    checkNonDigits: checkNonDigits,
    validateDate: validateDate
};