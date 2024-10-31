import { ChangeEvent } from 'react';

import { DEFAULT_TEXT_TRUNCATE_LENGTH } from '../constants/common';

import config from '../config';

import { AnyObject } from '../types';

export const log = {
  error: (e: Error | string, ...rest: Array<Error | string>): void => {
    const style = 'color:red';
    // eslint-disable-next-line no-console
    if (!rest.length) console.error(e);
    if (rest.length) {
      if (typeof e === 'string') {
        // eslint-disable-next-line no-console
        console.log('%c' + e + ': ', style);
        // eslint-disable-next-line no-console
      } else console.error(e);
      rest.forEach(v => {
        if (typeof v === 'string') {
          // eslint-disable-next-line no-console
          console.log('%c' + v, style);
          // eslint-disable-next-line no-console
        } else console.error(v);
      });
    }
  },
  info: (t: unknown, ...rest: Array<unknown>): void => {
    const style = 'color:green';
    // eslint-disable-next-line no-console
    if (!rest.length) {
      // eslint-disable-next-line no-console
      console.log('%cLog info: ', style);
      // eslint-disable-next-line no-console
      console.log(t);
    }
    if (rest.length) {
      // eslint-disable-next-line no-console
      console.log('%c' + t + ': ', style);
      rest.forEach(v => {
        // eslint-disable-next-line no-console
        console.log(v);
      });
    }
  },
};

export async function copyToClipboard(text: string): Promise<void> {
  // mobile workaround because mobile devices don't have clipboard object in navigator
  function copyToMobileClipboard(str: string): void {
    const el = document.createElement('textarea');
    el.value = str;
    // @ts-ignore
    el.style = { position: 'absolute', left: '-9999px' };
    el.setAttribute('readonly', '');
    document.body.appendChild(el);

    if (/ipad|ipod|iphone/i.exec(navigator.userAgent)) {
      // save current contentEditable/readOnly status
      const editable = el.contentEditable;
      const readOnly = el.readOnly;

      // convert to editable with readonly to stop iOS keyboard opening
      // @ts-ignore
      el.contentEditable = true;
      el.readOnly = true;

      // create a selectable range
      const range = document.createRange();
      range.selectNodeContents(el);

      // select the range
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      el.setSelectionRange(0, 999999);

      // restore contentEditable/readOnly to original state
      el.contentEditable = editable;
      el.readOnly = readOnly;
    } else {
      el.select();
    }

    document.execCommand('copy');
    document.body.removeChild(el);
  }
  try {
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(
      window.navigator.appVersion,
    );
    if (!isMobileDevice) return await navigator.clipboard.writeText(text);

    return copyToMobileClipboard(text);
  } catch (e) {
    log.error(e);
  }
}

export const getHash = async (itemToHash: File): Promise<string> => {
  if (!(itemToHash instanceof Blob)) return;
  const arrayBuffer = await itemToHash.arrayBuffer();
  const msgUint8 = new Uint8Array(arrayBuffer);

  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const checkNativeShare = (): boolean => {
  try {
    return !!navigator.share;
  } catch (e) {
    return false;
  }
};

export const nativeShareIsAvailable = checkNativeShare();
export const shareData = (data: { url?: string; text?: string }): void => {
  try {
    navigator.share(data);
  } catch (e) {
    //
  }
};

export const commonFormatTime = (date: string): string => {
  if (!date) return 'N/A';

  const isDateInUtc = /z/i.test(date);
  const activationDate = isDateInUtc ? date : getUTCDate(date);

  const activationDay = (dateString: string | number) =>
    new Date(dateString).toLocaleDateString([], {
      year: 'numeric',
      month: '2-digit',
      day: 'numeric',
    });

  const activationTime = (dateString: string | number) =>
    new Date(dateString).toLocaleString([], {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

  return `${activationDay(activationDate)} @ ${activationTime(activationDate)}`;
};

export const getValueFromPaste = async (): Promise<string | undefined> => {
  if (!navigator.clipboard.readText) return;

  const clipboardStr = await navigator.clipboard.readText();

  return clipboardStr.trim();
};

// Normalize date if not exists "Z" parameter
export const getUTCDate = (dateString: string): number => {
  const date = new Date(dateString);

  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );
};

export const truncateTextInMiddle = (
  text: string,
  startChar: number = DEFAULT_TEXT_TRUNCATE_LENGTH,
  endChar: number = DEFAULT_TEXT_TRUNCATE_LENGTH,
): string => {
  if (!text) return text;

  if (
    text.length < startChar ||
    text.length < endChar ||
    (text.length - endChar < endChar + 1 &&
      text.length - startChar < startChar + 1)
  )
    return text;
  const start = text.substring(0, startChar);
  const end = text.substring(text.length - endChar, text.length);

  return start + '...' + end;
};

export const transformInputValues = ({
  e,
  transformedValue,
  onChange,
}: {
  e: ChangeEvent<HTMLInputElement>;
  transformedValue: string;
  onChange: (value: string) => void;
}): void => {
  const startPos = e.target.selectionStart;
  const endPos = e.target.selectionEnd;
  onChange(transformedValue);
  setTimeout(() => e.target.setSelectionRange(startPos, endPos), 0);
};

export const removeExtraCharactersFromString = (
  str: string | null,
): string | null => {
  if (str == null) {
    return null;
  }

  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (/[A-Za-z0-9]/.test(char)) {
      result += char;
    }
  }

  return result;
};

export const reorder = (
  list: AnyObject[],
  startIndex: number,
  endIndex: number,
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const removeTrailingSlashFromUrl = (url: string) => {
  if (typeof url === 'string' && url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  return url;
};

export const transformBaseUrl = () =>
  removeTrailingSlashFromUrl(config.baseUrl);

export const loadImage = async (url?: string): Promise<string | null> => {
  if (!url) return null;

  const img = new Image();
  img.src = url;

  return new Promise<string | null>(resolve => {
    img.onload = () => {
      resolve(url);
    };

    img.onerror = () => {
      resolve(null);
    };
  });
};

export const extractLastValueFormUrl = (url: string) => {
  const path = new URL(url).pathname;

  const pathWithoutParams = path.split('?')[0];
  const pathWithoutHashes = pathWithoutParams.split('#')[0];

  const splittedPath = pathWithoutHashes.split('/');

  let lastValue = splittedPath[splittedPath.length - 1];

  if (!lastValue) {
    lastValue = splittedPath[splittedPath.length - 2];
  }

  if (lastValue.startsWith('@')) {
    lastValue = lastValue.substr(1);
  }

  return lastValue;
};

export const isURL = (str: string) => {
  const urlPattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;

  return urlPattern.test(str);
};

export const convertToNewDate = (
  timestampOrDateString: number | string,
): Date => {
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

export const getNextGovernanceDate = (): string => {
  const dates = [
    new Date(Date.UTC(new Date().getUTCFullYear(), 3, 15, 19)), // April 15th 2PM (UTC-5)
    new Date(Date.UTC(new Date().getUTCFullYear(), 7, 16, 19)), // August 16th 2PM (UTC-5)
    new Date(Date.UTC(new Date().getUTCFullYear(), 11, 15, 19)), // December 15th 2PM (UTC-5)
  ];

  const now = new Date();

  const nextDate =
    dates.find(date => date > now) ||
    new Date(dates[0].setFullYear(dates[0].getFullYear() + 1));

  const month = nextDate.toLocaleString('en-US', {
    month: 'long',
    timeZone: 'America/New_York',
  });
  const day = nextDate.toLocaleString('en-US', {
    day: 'numeric',
    timeZone: 'America/New_York',
  });
  const time = nextDate.toLocaleString('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: 'America/New_York',
  });
  const year = nextDate.toLocaleString('en-US', {
    year: 'numeric',
    timeZone: 'America/New_York',
  });

  return `${month} ${day}th ${time} (UTC-5), ${year}`;
};
