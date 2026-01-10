/**
 * Convert 24-hour time string to 12-hour AM/PM format
 * @param {string} time24 - Time in "HH:mm" format (e.g., "14:30")
 * @returns {string} Time in "h:mm AM/PM" format (e.g., "2:30 PM")
 */
export function formatTimeToAMPM(time24) {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Convert AM/PM time string back to 24-hour format for storage
 * @param {string} time12 - Time in "h:mm AM/PM" format
 * @returns {string} Time in "HH:mm" format
 */
export function formatTimeFrom12To24(time12) {
  if (!time12) return '';
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12;

  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10);

  if (period.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

/**
 * Format time range for display
 * @param {string} startTime - Start time in 24-hour format
 * @param {string} endTime - End time in 24-hour format (optional)
 * @returns {string} Formatted time or range
 */
export function formatTimeRange(startTime, endTime) {
  const start = formatTimeToAMPM(startTime);
  if (!endTime) return start;
  const end = formatTimeToAMPM(endTime);
  return `${start} - ${end}`;
}
