'use strict';

const fs = require('fs');
const path = require('path');

const cny = require('./cny');

/**
 * Check if the passed parameter is a valid UTC year
 * Valid = an integer between 1 and 9999
 * @param n Anything
 * @return {Boolean} Return true if the passed parameter is a valid UTC year
 * */
function validateYear(n) {
    return Number.isInteger(n) && n > 0 && n < 9999
}

/**
 * Return an object containing the Chinese New Year dates for each given UTC year
 * @param {int} start A UTC year. If providing a range of years, this will be the start of the range
 * @param {int} stop Default to the start year. If providing a range of years, this will be the end of the range
 * @param {int} step Default to 1. If providing a range of years, this will be the step amount
 * @return {Object} An object containing the Chinese New Year dates for each given UTC year
 * */
function createCNYlist(start, stop = start, step = 1) {
    if (!validateYear(start) || !validateYear(stop) || !Number.isInteger(step)) {
        throw Error
    }

    if (stop === start) {
        // Only 1 year was provided
        return {[start]: cny.getCNY(start)}
    } else if (stop < start) {
        // TODO:

    } else {
        // TODO:

    }
}

function writeCNYlist(data) {
    const fileName = 'cnylist.json';
    fs.writeFile(fileName, data, (err) => {
        if (err) throw err;
        console.log(`Successfully created a Chinese New Year list at ${path.join(__dirname, fileName)}`);
    })
}

