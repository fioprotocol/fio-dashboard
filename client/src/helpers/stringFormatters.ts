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
const locale = 'en-US';

export const currencyString = (
  num: number,
  currency: string = 'USD',
  options: { minimumFractionDigits: number; style: string } = CURRENCY_OPTIONS,
): string => {
  return `${num.toLocaleString(locale, {
    ...options,
    currency,
  })}`;
};
