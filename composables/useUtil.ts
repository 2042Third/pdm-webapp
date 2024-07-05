export const useUtil = () => {
  const unixToHumanReadableTime = (unixTime) => {
    const date = new Date(unixTime);
    return date.toLocaleString();
  }
  return {
    unixToHumanReadableTime,
  }
}
