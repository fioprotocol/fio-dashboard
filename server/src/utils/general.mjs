export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

export const convertToNewDate = timestampOrDateString => {
  const timestampNumber = Number(timestampOrDateString);

  if (!isNaN(timestampNumber)) {
    // If it's a valid numeric timestamp (seconds or milliseconds)
    if (timestampNumber.toString().length === 13) {
      // It's in milliseconds
      return new Date(timestampNumber);
    } else {
      // It's in seconds, convert to milliseconds
      return new Date(timestampNumber * 1000);
    }
  }

  // If it's not a valid numeric timestamp, try parsing as Date string
  const date = new Date(timestampOrDateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // If it's neither a valid timestamp nor a valid Date string
  throw new Error('Invalid input: Unable to convert to Date.');
};
