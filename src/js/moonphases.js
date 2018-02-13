'use strict';

const MS_IN_DAY = 86400000;

const MEAN_LUNATION_DAY = 29.5295;  // Mean value of a moon synodic month
const MEAN_LUNATION_MS = MEAN_LUNATION_DAY * MS_IN_DAY;

const NEW_MOON_EPOCH_DATE = new Date(2000, 0, 1, 12, 24, 1);  // We know there's a New Moon on this date
const NEW_MOON_EPOCH_MS = NEW_MOON_EPOCH_DATE.getTime();

/**
 * Return the approximate closest New Moon date to a given date
 * @param {Date} date A given date
 * @return {Date} nm_date Closest New Moon date
 * */
function getClosestNM(date) {
    const date_ms = date.getTime();

    // Find out the ms difference between the New Moon epoch and our given date
    // Note that date.getTime() returns a ms value relative to the 1970 epoch, which means it could be < 0
    let date_elapsed_ms = 0;
    if (date_ms < 0) {
        date_elapsed_ms = -date_ms + NEW_MOON_EPOCH_MS;
    } else {
        date_elapsed_ms = Math.abs(date_ms - NEW_MOON_EPOCH_MS);
    }

}