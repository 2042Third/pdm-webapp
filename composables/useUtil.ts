import { fromByteArray, toByteArray } from 'base64-js';
export const useUtil = () => {
  const unixToHumanReadableBad = (unixTime) => {
    const date = new Date(unixTime);
    return date.toLocaleString();
  }

  /**
   * Converts a BigInt to a Base64 string
   * @param {BigInt} bigintValue - BigInt value to convert
   * @returns {string} Base64 string
   * */
  function bigintToBase64(bigintValue) {
    // Ensure the input is a regular number
    const num = Number(bigintValue);

    // Convert number to an 8-byte array
    const bytes = new Uint8Array(8);
    let remaining = num;

    for (let i = 7; i >= 0; i--) {
      bytes[i] = remaining & 0xFF;
      remaining = Math.floor(remaining / 256);
    }

    // Encode to Base64
    return fromByteArray(bytes);
  }

  /**
   * Converts a Base64 string to a BigInt
   * @param {string} base64Value - Base64 string to convert
   * @returns {BigInt} BigInt value
   * */
  function base64ToBigint(base64Value) {
    // Decode Base64 to a byte array
    const bytes = toByteArray(base64Value);

    // Convert the byte array back to number
    let result = 0;
    for (let i = 0; i < bytes.length; i++) {
      result = (result * 256) + bytes[i];
    }

    return result;
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
    bigintToBase64,
    base64ToBigint,
  }
}
