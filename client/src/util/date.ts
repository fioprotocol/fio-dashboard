import { DateRange } from '../types';

export const localDateToUtc = ({
  ms = Date.now(),
  mask = [],
  offset = [],
} = {}) => {
  const date = new Date(ms);

  const [mYear, mMonth, mDate, mHours, mMinutes, mSeconds, mMs] = Array(7)
    .fill(null)
    .map((_, i) =>
      i < mask.length && typeof mask[i] === 'number' ? mask[i] : null,
    );
  const [oYear, oMonth, oDate, oHours, oMinutes, oSeconds, oMs] = Array(7)
    .fill(0)
    .map((emp, i) => (i < offset.length ? offset[i] || emp : emp));

  const resolvedDate = new Date(
    (typeof mYear === 'number' ? mYear : date.getFullYear()) + oYear,
    (typeof mMonth === 'number' ? mMonth : date.getMonth()) + oMonth,
    (typeof mDate === 'number' ? mDate : date.getDate()) + oDate,
    (typeof mHours === 'number' ? mHours : date.getHours()) + oHours,
    (typeof mMinutes === 'number' ? mMinutes : date.getMinutes()) + oMinutes,
    (typeof mSeconds === 'number' ? mSeconds : date.getSeconds()) + oSeconds,
    (typeof mMs === 'number' ? mMs : date.getMilliseconds()) + oMs,
  );

  return resolvedDate.getTime();
};

export const startDayMask = [null, null, null, 0, 0, 0, 1];

export const endDayMask = [null, null, null, 23, 59, 59, 999];

export const dateRangeConditions = {
  get today(): DateRange {
    return {
      startDate: localDateToUtc({ mask: startDayMask }),
    };
  },
  get yesterday(): DateRange {
    return {
      startDate: localDateToUtc({
        mask: startDayMask,
        offset: [0, 0, -1],
      }),
      endDate: localDateToUtc({
        mask: endDayMask,
        offset: [0, 0, -1],
      }),
    };
  },
  get last7days(): DateRange {
    return {
      startDate: localDateToUtc({
        mask: startDayMask,
        offset: [0, 0, -7],
      }),
    };
  },
  get lastMonth(): DateRange {
    return {
      startDate: localDateToUtc({
        mask: startDayMask,
        offset: [0, -1],
      }),
    };
  },
  get lastHalfOfYear(): DateRange {
    return {
      startDate: localDateToUtc({
        mask: startDayMask,
        offset: [0, -6],
      }),
    };
  },
} as const;

export type DateRangeConditions = keyof typeof dateRangeConditions;
