export const convertToIsoString = ({ ms = 0, mask = [], offset = [] }) => {
  const date = new Date(ms);

  const [mYear, mMonth, mDate, mHours, mMinutes, mSeconds, mMs] = Array(7)
    .fill(null)
    .map((_, i) => (i < mask.length && typeof mask[i] === 'number' ? mask[i] : null));
  const [oYear, oMonth, oDate, oHours, oMinutes, oSeconds, oMs] = Array(7)
    .fill(0)
    .map((emp, i) => (i < offset.length ? offset[i] || emp : emp));

  const utcMs = Date.UTC(
    (typeof mYear === 'number' ? mYear : date.getUTCFullYear()) + oYear,
    (typeof mMonth === 'number' ? mMonth : date.getUTCMonth()) + oMonth,
    (typeof mDate === 'number' ? mDate : date.getUTCDate()) + oDate,
    (typeof mHours === 'number' ? mHours : date.getUTCHours()) + oHours,
    (typeof mMinutes === 'number' ? mMinutes : date.getUTCMinutes()) + oMinutes,
    (typeof mSeconds === 'number' ? mSeconds : date.getUTCSeconds()) + oSeconds,
    (typeof mMs === 'number' ? mMs : date.getUTCMilliseconds()) + oMs,
  );

  const utcDate = new Date(utcMs);

  return utcDate
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
};

export const startDayMask = [null, null, null, 0, 0, 0, 1];
export const endDayMask = [null, null, null, 23, 59, 59, 999];
