export const useUtil = () => {
  const unixToHumanReadableBad = (unixTime) => {
    const date = new Date(unixTime);
    return date.toLocaleString();
  }

  /**
   * Converts Unix timestamp to human readable format
   * @param {string|number} unixTime - Unix timestamp in seconds or milliseconds
   * @param {object} options - Optional Intl.DateTimeFormat options
   * @returns {string} Formatted date string
   */
  const unixToHumanReadableTime = (unixTime: string | number, options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }) => {
    if (!unixTime) return '---';

    // Convert string to number if needed
    const timestamp = typeof unixTime === 'string' ? parseInt(unixTime) : unixTime;

    // Check if timestamp is in milliseconds or seconds
    const dateValue = timestamp.toString().length > 10
      ? timestamp
      : timestamp * 1000;

    try {
      return new Intl.DateTimeFormat(undefined, options).format(new Date(dateValue));
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  /**
   * Returns relative time (e.g., "2 hours ago", "in 3 days")
   * @param {string|number} unixTime - Unix timestamp in seconds or milliseconds
   * @returns {string} Relative time string
   */
  const getRelativeTime = (unixTime: string | number) => {
    if (!unixTime) return '---';

    const timestamp = typeof unixTime === 'string' ? parseInt(unixTime) : unixTime;
    const dateValue = timestamp.toString().length > 10
      ? timestamp
      : timestamp * 1000;

    try {
      const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
      const now = Date.now();
      const diff = dateValue - now;

      const diffInSeconds = diff / 1000;
      const diffInMinutes = diffInSeconds / 60;
      const diffInHours = diffInMinutes / 60;
      const diffInDays = diffInHours / 24;

      if (Math.abs(diffInDays) >= 1) {
        return rtf.format(Math.round(diffInDays), 'day');
      }
      if (Math.abs(diffInHours) >= 1) {
        return rtf.format(Math.round(diffInHours), 'hour');
      }
      if (Math.abs(diffInMinutes) >= 1) {
        return rtf.format(Math.round(diffInMinutes), 'minute');
      }
      return rtf.format(Math.round(diffInSeconds), 'second');
    } catch (error) {
      console.error('Error formatting relative time:', error);
      return 'Invalid Date';
    }
  };

  return {
    unixToHumanReadableTime,
    unixToHumanReadableBad,
    getRelativeTime,
  }
}
