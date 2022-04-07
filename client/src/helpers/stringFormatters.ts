import { US_LOCALE } from '../constants/common';

export const createRangeString = (target: {
  max?: string;
  min: string;
}): string => {
  const separator = target.max ? ' - ' : '+';
  return `${target.min}${separator}${target.max || ''}`;
};

export const prepateDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dt = date.getDate();
  let monthStr = '';
  let dtStr = '';

  if (dt < 10) {
    dtStr = '0' + dt;
  }
  if (month < 10) {
    monthStr = '0' + month;
  }

  return `${dtStr}/${monthStr}/${year}`;
};

export const CURRENCY_OPTIONS = {
  minimumFractionDigits: 2,
  style: 'currency',
};

export const currencyString = (
  num: number,
  currency = 'USD',
  options: { minimumFractionDigits: number; style: string } = CURRENCY_OPTIONS,
): string => {
  return `${num.toLocaleString(US_LOCALE, {
    ...options,
    currency,
  })}`;
};
