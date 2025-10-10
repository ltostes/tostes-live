import * as d3 from 'd3'

import { hours_offset } from './data/constants.js';

export function dateFixer(date) {
    // Accepts Date ISO 8601 format (date and time UTC) as string
    return new Date(d3.timeFormat('%Y-%m-%d')(new Date(
        `${date.slice(0, -1)}+${d3.format("02")(hours_offset)}:00`
      )))
}

export function getWeeksAgo(date, refDate) {
    return d3.timeWeek.count(date, d3.utcMonday.floor(refDate))
}
export function isDateWithinRange(dateToCheck, startDate, endDate) {
    // Ensure dates are converted to Date objects
    const date = new Date(dateToCheck);
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    return date >= start && date <= end;
}

export function getWeekStreak(gameDates, refDate) {
    const weeksAgoArray = gameDates
      .filter((f) => f <= refDate)
      .map((g) => getWeeksAgo(g, refDate));
    const currentStreak = weeksAgoArray.reduce((acc, cur) => (cur - acc <= 1 ? cur : acc), -1) + 1;
  
    return currentStreak;
}

export function removeDuplicates(array, id="id") {
    const seen = new Set();
    return array.filter(item => {
      const identifier = item[id]; // Replace 'id' with your unique property
      return seen.has(identifier) ? false : seen.add(identifier);
    });
  }
