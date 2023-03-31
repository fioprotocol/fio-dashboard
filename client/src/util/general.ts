import { ChangeEvent } from 'react';

import { DEFAULT_TEXT_TRUNCATE_LENGTH } from '../constants/common';

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
): string | null => (str != null ? str.replaceAll(/[^A-Za-z0-9]/g, '') : null);

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
