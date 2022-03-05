import { US_LOCALE } from '../constants/common';

export const createRangeString = target => {
  const separator = target.max ? ' - ' : '+';
  return `${target.min}${separator}${target.max || ''}`;
};

export const prepateDate = dateString => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return `${dt}/${month}/${year}`;
};

export const CURRENCY_OPTIONS = {
  minimumFractionDigits: 2,
  style: 'currency',
};

export const currencyString = (
  num,
  currency = 'USD',
  options = CURRENCY_OPTIONS,
) => {
  return `${num.toLocaleString(US_LOCALE, {
    ...options,
    currency,
  })}`;
};
