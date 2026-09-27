/**
 * Utility functions for local calendar dates in HabitLoop.
 * 
 * IMPORTANT: Date-only strings (e.g., "2026-09-27") must be treated as local calendar dates,
 * NOT UTC timestamps. JavaScript's `new Date("YYYY-MM-DD")` defaults to UTC midnight,
 * which shifts the weekday and date when evaluated in local timezones.
 */

/**
 * Parses a date-only string "YYYY-MM-DD" into a local Date object at 00:00:00 local time.
 */
export function parseLocalDate(dateStr) {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;
  
  const cleanStr = String(dateStr).split('T')[0];
  const parts = cleanStr.split('-');
  
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month, day);
    }
  }
  
  return new Date(dateStr);
}

/**
 * Formats a Date object or local date string into "YYYY-MM-DD" format using local calendar values.
 */
export function formatLocalDate(dateInput) {
  const d = dateInput ? (dateInput instanceof Date ? dateInput : parseLocalDate(dateInput)) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the user's current local date string in "YYYY-MM-DD" format.
 */
export function getTodayDateStr() {
  return formatLocalDate(new Date());
}

/**
 * Returns weekday name ("Sunday", "Monday", ..., or "SUN", "MON", ...) for a date-only string.
 */
export function getWeekdayName(dateStr, format = 'short') {
  const d = parseLocalDate(dateStr);
  const SHORT_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const LONG_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = d.getDay();
  return format === 'long' ? LONG_DAYS[dayIndex] : SHORT_DAYS[dayIndex];
}

/**
 * Formats a date string for display (e.g. "Sunday, Sep 27")
 */
export function formatDisplayDate(dateStr, includeWeekday = true) {
  const d = parseLocalDate(dateStr);
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthStr = MONTHS[d.getMonth()];
  const dateNum = d.getDate();
  const weekdayStr = getWeekdayName(dateStr, 'long');

  if (includeWeekday) {
    return `${weekdayStr}, ${monthStr} ${dateNum}`;
  }
  return `${monthStr} ${dateNum}`;
}

/**
 * Returns difference in calendar days (date2 - date1).
 */
export function getCalendarDaysDiff(startDateStr, endDateStr) {
  const start = parseLocalDate(startDateStr);
  const end = parseLocalDate(endDateStr);
  const diffTime = end.getTime() - start.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Adds calendar days to a date string without timezone shifts.
 */
export function addCalendarDays(dateStr, daysCount) {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + daysCount);
  return formatLocalDate(d);
}

/**
 * Returns an array of 7 consecutive calendar date strings starting from startDateStr.
 */
export function get7CalendarDays(startDateStr) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addCalendarDays(startDateStr, i));
  }
  return days;
}

/**
 * Returns structured weekday objects for a list of date strings (e.g. for Dashboard calendar)
 */
export function getWeekDaysList(datesList) {
  const todayStr = getTodayDateStr();
  return datesList.map(dStr => {
    const dObj = parseLocalDate(dStr);
    return {
      dateStr: dStr,
      dateNum: dObj.getDate(),
      dayStr: getWeekdayName(dStr, 'short'),
      fullDay: getWeekdayName(dStr, 'long'),
      isToday: dStr === todayStr,
    };
  });
}
